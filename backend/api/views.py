from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Film, FilmwebFilm, RottenFilm, IMDBFilm
from .serializers import FilmSerializer, FilmwebFilmSerializer, RottenFilmSerializer, IMDBFilmSerializer
from .serializers import RegisterSerializer, SystemUserSerializer
from django.contrib.auth import get_user_model


SystemUser = get_user_model()


# @api_view(['GET', 'POST'])
@api_view(['GET'])
@permission_classes([AllowAny])
def film_list(request):
    if request.method == 'GET':
        films = Film.objects.all()
        filmweb_films = FilmwebFilm.objects.all()
        rotten_films = RottenFilm.objects.all()
        imdb_films = IMDBFilm.objects.all()
        serializer = FilmSerializer(films, many=True)
        filmweb_serializer = FilmwebFilmSerializer(filmweb_films, many=True)
        rotten_serializer = RottenFilmSerializer(rotten_films, many=True)
        imdb_serializer = IMDBFilmSerializer(imdb_films, many=True)
        return Response(serializer.data + filmweb_serializer.data + rotten_serializer.data + imdb_serializer.data)

    # elif request.method == 'POST':
    #     serializer = FilmSerializer(data=request.data)
    #     filmweb_serializer = FilmwebFilmSerializer(data=request.data)
    #     rotten_serializer = RottenFilmSerializer(data=request.data)
    #     imdb_serializer = IMDBFilmSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data + filmweb_serializer.data + rotten_serializer.data + imdb_serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors + filmweb_serializer.errors + rotten_serializer.errors + imdb_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST']) 
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
                serializer.data, 
                status=status.HTTP_201_CREATED
        )
    return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def system_user_detail(request):
    user = SystemUser.objects.get(pk=request.user.id)
    serializer = SystemUserSerializer(user)
    return Response(serializer.data)
