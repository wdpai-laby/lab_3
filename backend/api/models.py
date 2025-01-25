from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class Film(models.Model):
    id_film = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    year = models.IntegerField()
    duration = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return f'{self.title} {self.year}'


class RottenFilm(models.Model):
    id_rottenfilm = models.AutoField(primary_key=True)
    id_film = models.OneToOneField(
        Film,
        on_delete=models.CASCADE,  # Deletes the related RottenFilm if the Film entry is deleted
        related_name='rotten_film',
        db_column='id_film'
    )
    critics_score = models.IntegerField()
    user_score = models.IntegerField()

    def __str__(self):
        return f'{self.film.title} ({self.film.year})'


class FilmwebFilm(models.Model):
    id_filmwebfilm = models.AutoField(primary_key=True)
    id_film = models.OneToOneField(
        Film,
        on_delete=models.CASCADE,  # Deletes the related FilmwebFilm if the Film entry is deleted
        related_name='filmweb_film',
        db_column='id_film'
    )
    score = models.FloatField()

    def __str__(self):
        return f'{self.film.title} ({self.film.year})'
    

class IMDBFilm(models.Model):
    id_imdbfilm = models.AutoField(primary_key=True)
    id_film = models.OneToOneField(
        Film,
        on_delete=models.CASCADE,  # Deletes the related IMDBFilm if the Film entry is deleted
        related_name='imdb_film',
        db_column='id_film'
    )
    rating = models.FloatField()
    votes = models.IntegerField()

    def __str__(self):
        return f'{self.film.title} ({self.film.year})'

class CombinedFilms(models.Model):
    id_film = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=255)
    year = models.IntegerField()
    duration = models.CharField(max_length=50)
    score = models.FloatField()
    critics_score = models.IntegerField()
    user_score = models.IntegerField()
    rating = models.FloatField()
    votes = models.IntegerField()

    class Meta:
        managed = False  # Don't let Django try to create, alter, or delete this table
        db_table = 'combinedfilms'  # This is the name of your database view

    def __str__(self):
        return f'{self.film.title} ({self.film.year})'
    
class SystemUser(AbstractUser):
    """
    Custom user model for the system.
    """
    email = models.EmailField(unique=True)

    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_set",
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions_set",
        blank=True,
    )

    def __str__(self):
        return self.username
    