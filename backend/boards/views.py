from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Board, Column
from .serializers import BoardSerializer, ColumnSerializer


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


class ColumnDestroyAPIView(generics.DestroyAPIView):
    serializer_class = ColumnSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Column.objects.filter(board__owner=self.request.user)
