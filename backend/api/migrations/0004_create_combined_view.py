from django.db import migrations, models

def create_film_details_view(apps, schema_editor):
    with schema_editor.connection.cursor() as cursor:
        cursor.execute("""
            CREATE VIEW combinedfilms AS
             SELECT api_film.id_film,
                api_film.title,
                api_film.year,
                api_film.duration,
                api_filmwebfilm.score,
                api_imdbfilm.rating,
                api_rottenfilm.critics_score,
                api_rottenfilm.user_score,
                api_imdbfilm.votes
            FROM api_film
                LEFT JOIN api_imdbfilm ON api_film.id_film = api_imdbfilm.id_film
                LEFT JOIN api_rottenfilm ON api_film.id_film = api_rottenfilm.id_film
                LEFT JOIN api_filmwebfilm ON api_film.id_film = api_filmwebfilm.id_film; 
        """)

def drop_film_details_view(apps, schema_editor):
    with schema_editor.connection.cursor() as cursor:
        cursor.execute("DROP VIEW IF EXISTS combinedfilms")

class Migration(migrations.Migration):

    dependencies = [
        # List any dependencies (e.g. previous migrations)
    ]

    operations = [
        migrations.RunPython(create_film_details_view, reverse_code=drop_film_details_view),
    ]