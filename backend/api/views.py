from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import CombinedFilms, FavoriteFilms
from .serializers import RegisterSerializer, SystemUserSerializer, CombinedFilmsSerializer, FavoriteFilmsSerializer
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken


SystemUser = get_user_model()


@api_view(['GET'])
@permission_classes([AllowAny])
def film_list(request):
    if request.method == 'GET':
        films = CombinedFilms.objects.all()
        serializer = CombinedFilmsSerializer(films, many=True)
        return Response(serializer.data)
    
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
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()  # Blacklist the token
        return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def system_user_detail(request):
    if request.method == 'GET':
        user = SystemUser.objects.get(pk=request.user.id)
        serializer = SystemUserSerializer(user)
        return Response(serializer.data)
    if request.method == 'PUT':
        user = SystemUser.objects.get(pk=request.user.id)
        serializer = SystemUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', "POST"])
@permission_classes([IsAuthenticated])
def favorites(request):
    user_id = request.user.id

    if request.method == 'GET':
        favorites = FavoriteFilms.objects.filter(id_system_user=user_id)
        serializer = FavoriteFilmsSerializer(favorites, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        request.data['id_system_user'] = user_id
        serializer = FavoriteFilmsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
        return Response(
            request.data,
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def favorites_delete(request, pk):
        user_id = request.user.id
        favorite = FavoriteFilms.objects.get(id_system_user=user_id, id_film=pk)
        if favorite:
            favorite.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)
    