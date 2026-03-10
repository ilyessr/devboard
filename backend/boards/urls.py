from django.urls import path
from .views import (
    BoardListCreateAPIView,
    BoardRetrieveUpdateDestroyAPIView,
    ColumnListCreateAPIView,
    ColumnDestroyAPIView,
    CardListCreateAPIView,
    CardDestroyAPIView,
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
    path(
        "columns/<int:column_id>/cards/",
        CardListCreateAPIView.as_view(),
        name="card-list-create",
    ),
    path("cards/<int:pk>/", CardDestroyAPIView.as_view(), name="card-delete"),
]
