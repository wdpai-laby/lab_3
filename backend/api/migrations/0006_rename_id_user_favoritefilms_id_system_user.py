# Generated by Django 4.2 on 2025-01-29 16:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_favoritefilms'),
    ]

    operations = [
        migrations.RenameField(
            model_name='favoritefilms',
            old_name='id_user',
            new_name='id_system_user',
        ),
    ]
