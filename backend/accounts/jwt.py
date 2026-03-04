from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    # Tell SimpleJWT we use email as the username field
    username_field = User.USERNAME_FIELD  # "email"

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(
            request=self.context.get("request"),
            email=email,
            password=password,
        )

        if user is None:
            # Standard DRF error for auth failure
            from rest_framework.exceptions import AuthenticationFailed

            raise AuthenticationFailed("Invalid credentials", code="authorization")

        # This will produce access/refresh tokens
        data = super().validate(attrs)
        return data
