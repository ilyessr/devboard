from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import RegisterSerializer, UserSerializer
from .jwt import EmailTokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


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


class CookieTokenRefreshView(APIView):
    def post(self, request):
        refresh = request.COOKIES.get("refresh_token")

        if not refresh:
            return Response(status=401)

        token = RefreshToken(refresh)
        return Response({"access": str(token.access_token)})
