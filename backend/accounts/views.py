from django.conf import settings
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import RegisterSerializer, UserSerializer
from .jwt import EmailTokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenRefreshSerializer


def _set_refresh_cookie(response, refresh_token: str) -> None:
    response.set_cookie(
        key=settings.AUTH_REFRESH_COOKIE,
        value=refresh_token,
        httponly=settings.AUTH_REFRESH_COOKIE_HTTP_ONLY,
        secure=settings.AUTH_REFRESH_COOKIE_SECURE,
        samesite=settings.AUTH_REFRESH_COOKIE_SAMESITE,
        path=settings.AUTH_REFRESH_COOKIE_PATH,
        max_age=int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
    )


def _clear_refresh_cookie(response) -> None:
    response.delete_cookie(
        key=settings.AUTH_REFRESH_COOKIE,
        path=settings.AUTH_REFRESH_COOKIE_PATH,
        samesite=settings.AUTH_REFRESH_COOKIE_SAMESITE,
    )


class RegisterAPIView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


class MeAPIView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class LoginAPIView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code != status.HTTP_200_OK:
            return response

        refresh_token = response.data.get("refresh")
        if not refresh_token:
            return response

        _set_refresh_cookie(response, refresh_token)
        response.data.pop("refresh", None)
        return response


class CookieTokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh = request.COOKIES.get(settings.AUTH_REFRESH_COOKIE)

        if not refresh:
            return Response({"detail": "Missing refresh cookie"}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = TokenRefreshSerializer(data={"refresh": refresh})
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        response = Response({"access": data["access"]}, status=status.HTTP_200_OK)
        rotated_refresh = data.get("refresh")
        if rotated_refresh:
            _set_refresh_cookie(response, rotated_refresh)

        return response


class LogoutAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        _clear_refresh_cookie(response)
        return response
