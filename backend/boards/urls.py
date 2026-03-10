from django.urls import path
from .views import (
    BoardListCreateAPIView,
    BoardRetrieveUpdateDestroyAPIView,
    ColumnListCreateAPIView,
    ColumnDestroyAPIView,
)

urlpatterns = [
    path("", BoardListCreateAPIView.as_view(), name="board-list-create"),
    path("<int:pk>/", BoardRetrieveUpdateDestroyAPIView.as_view(), name="board-detail"),
    path(
        "<int:board_id>/columns/",
        ColumnListCreateAPIView.as_view(),
        name="column-list-create",
    ),
    path("columns/<int:pk>/", ColumnDestroyAPIView.as_view(), name="column-delete"),
]
