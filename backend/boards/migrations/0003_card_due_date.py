from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("boards", "0002_card"),
    ]

    operations = [
        migrations.AddField(
            model_name="card",
            name="due_date",
            field=models.DateField(blank=True, null=True),
        ),
    ]
