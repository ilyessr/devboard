from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from boards.models import Board, Column, Card

User = get_user_model()


class Command(BaseCommand):
    help = "Seed demo data (user, board, columns, cards)"

    def handle(self, *args, **kwargs):
        email = "demo@example.com"
        password = "demo1234"

        user, created = User.objects.get_or_create(email=email)

        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS("Demo user created"))
        else:
            self.stdout.write("Demo user already exists")

        # create board
        board, _ = Board.objects.get_or_create(
            owner=user,
            name="Demo Project",
        )

        # columns
        todo, _ = Column.objects.get_or_create(
            board=board,
            name="Todo",
            position=0,
        )

        doing, _ = Column.objects.get_or_create(
            board=board,
            name="Doing",
            position=1,
        )

        done, _ = Column.objects.get_or_create(
            board=board,
            name="Done",
            position=2,
        )

        # cards
        Card.objects.get_or_create(
            column=todo,
            title="Setup project",
            description="Initialize Django and React",
            position=0,
        )

        Card.objects.get_or_create(
            column=todo,
            title="Create authentication",
            description="JWT with refresh cookie",
            position=1,
        )

        Card.objects.get_or_create(
            column=doing,
            title="Build boards UI",
            description="React Query + forms",
            position=0,
        )

        Card.objects.get_or_create(
            column=done,
            title="Design architecture",
            description="Feature-based React structure",
            position=0,
        )

        self.stdout.write(self.style.SUCCESS("Demo data seeded successfully"))
