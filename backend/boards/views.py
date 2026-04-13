from django.db import transaction
from django.db.models import F
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Board, Column, Card
from .serializers import BoardSerializer, ColumnSerializer, CardSerializer


class BoardListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Board.objects.filter(owner=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class BoardRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Board.objects.filter(owner=self.request.user)


class ColumnListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ColumnSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        board = get_object_or_404(
            Board, id=self.kwargs["board_id"], owner=self.request.user
        )
        return board.columns.all()

    def perform_create(self, serializer):
        board = get_object_or_404(
            Board, id=self.kwargs["board_id"], owner=self.request.user
        )
        next_position = board.columns.count()
        serializer.save(board=board, position=next_position)


class ColumnRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ColumnSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Column.objects.filter(board__owner=self.request.user)

    def perform_destroy(self, instance):
        board_id = instance.board_id
        deleted_position = instance.position
        instance.delete()
        Column.objects.filter(board_id=board_id, position__gt=deleted_position).update(
            position=F("position") - 1
        )


class CardListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        column = get_object_or_404(
            Column,
            id=self.kwargs["column_id"],
            board__owner=self.request.user,
        )
        return column.cards.all()

    def perform_create(self, serializer):
        column = get_object_or_404(
            Column,
            id=self.kwargs["column_id"],
            board__owner=self.request.user,
        )
        next_position = column.cards.count()
        serializer.save(column=column, position=next_position)


class CardRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Card.objects.filter(column__board__owner=self.request.user)

    def perform_destroy(self, instance):
        column_id = instance.column_id
        deleted_position = instance.position
        instance.delete()
        Card.objects.filter(column_id=column_id, position__gt=deleted_position).update(
            position=F("position") - 1
        )

    @transaction.atomic
    def patch(self, request, *args, **kwargs):
        card = self.get_object()
        old_column_id = card.column_id
        old_position = card.position

        title = request.data.get("title")
        description = request.data.get("description")
        if title is not None:
            card.title = str(title).strip()
        if description is not None:
            card.description = str(description)

        target_column_id = request.data.get("column")
        if target_column_id is None:
            target_column = card.column
        else:
            target_column = get_object_or_404(
                Column,
                id=target_column_id,
                board__owner=request.user,
            )

        requested_position = request.data.get("position")
        if requested_position is None:
            target_position = old_position if target_column.id == old_column_id else target_column.cards.count()
        else:
            try:
                target_position = int(requested_position)
            except (TypeError, ValueError):
                return Response(
                    {"detail": "position must be an integer"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        if target_column.id != old_column_id:
            Card.objects.filter(column_id=old_column_id, position__gt=old_position).update(
                position=F("position") - 1
            )

            max_target_position = target_column.cards.count()
            target_position = max(0, min(target_position, max_target_position))

            Card.objects.filter(column=target_column, position__gte=target_position).update(
                position=F("position") + 1
            )

            card.column = target_column
            card.position = target_position
        else:
            max_target_position = max(0, card.column.cards.count() - 1)
            target_position = max(0, min(target_position, max_target_position))

            if target_position > old_position:
                Card.objects.filter(
                    column=card.column,
                    position__gt=old_position,
                    position__lte=target_position,
                ).exclude(id=card.id).update(position=F("position") - 1)
            elif target_position < old_position:
                Card.objects.filter(
                    column=card.column,
                    position__gte=target_position,
                    position__lt=old_position,
                ).exclude(id=card.id).update(position=F("position") + 1)

            card.position = target_position

        card.save()
        return Response(self.get_serializer(card).data, status=status.HTTP_200_OK)
