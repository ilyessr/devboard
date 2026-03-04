from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from typing import List, Optional


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email: str, password: Optional[str] = None, **extra_fields):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email: str, password: Optional[str] = None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        return self.create_user(email=email, password=password, **extra_fields)


class User(AbstractUser):
    username = None

    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"  # Use email to login
    REQUIRED_FIELDS: List[str] = []

    objects = UserManager()
