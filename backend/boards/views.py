from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Board
from .serializers import BoardSerializer


class BoardListCreateAPIView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BoardSerializer

    def get_queryset(self):
        return Board.objects.filter(owner=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class BoardDetailAPIView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BoardSerializer

    def get_queryset(self):
        return Board.objects.filter(owner=self.request.user)
