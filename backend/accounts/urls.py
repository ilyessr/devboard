from django.urls import path
from .views import RegisterAPIView, LoginAPIView, MeAPIView, CookieTokenRefreshView

urlpatterns = [
    path("register/", RegisterAPIView.as_view()),
    path("login/", LoginAPIView.as_view()),
    path("refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
    path("me/", MeAPIView.as_view()),
]
x
