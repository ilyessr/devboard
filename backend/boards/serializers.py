from rest_framework import serializers
from .models import Board, Column


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ["id", "name", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class ColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = Column
        fields = ["id", "name", "position", "created_at", "updated_at"]
        read_only_fields = ["id", "position", "created_at", "updated_at"]
