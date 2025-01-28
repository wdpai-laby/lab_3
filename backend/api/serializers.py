from rest_framework import serializers
from .models import Film, FilmwebFilm, RottenFilm, IMDBFilm, CombinedFilms, SystemUser, FavoriteFilms

class FilmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Film
        fields = ['id_film', 'title', 'year', 'duration']

class RottenFilmSerializer(serializers.ModelSerializer):
    class Meta:
        model = RottenFilm
        fields = ['id_rottenfilm', 'id_film', 'critics_score', 'user_score']

class FilmwebFilmSerializer(serializers.ModelSerializer):
    class Meta:
        model = FilmwebFilm
        fields = ['id_filmwebfilm', 'id_film', 'score']

class IMDBFilmSerializer(serializers.ModelSerializer):
    class Meta:
        model = IMDBFilm
        fields = ['id_imdbfilm', 'id_film', 'rating', 'votes']

class CombinedFilmsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CombinedFilms
        fields = ['id_film', 'title', 'year', 'duration', 'score', 'critics_score', 'user_score', 'rating', 'votes']

class FavoriteFilmsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteFilms
        fields = ['id_favourite', 'id_film', 'id_system_user']

# Serializery dla SystemUser
class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer do rejestracji użytkownika systemowego.
    """
    password = serializers.CharField(write_only=True)

    class Meta:
        model = SystemUser
        fields = ['username', 'email', 'password']


    def create(self, validated_data):
        user = SystemUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class SystemUserSerializer(serializers.ModelSerializer):
    """
    Serializer do odczytu danych użytkownika systemowego.
    """
    class Meta:
        model = SystemUser
        fields = ['email', 'groups', 'user_permissions']