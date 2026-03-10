from django.urls import path
from .views import BoardListCreateAPIView, BoardRetrieveUpdateDestroyAPIView

urlpatterns = [
    path("", BoardListCreateAPIView.as_view(), name="board-list-create"),
    path("<int:pk>/", BoardRetrieveUpdateDestroyAPIView.as_view(), name="board-detail"),
]
