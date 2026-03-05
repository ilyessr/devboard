from django.urls import path
from .views import BoardListCreateAPIView, BoardDetailAPIView

urlpatterns = [
    path("boards/", BoardListCreateAPIView.as_view()),
    path("boards/<int:pk>/", BoardDetailAPIView.as_view()),
]
