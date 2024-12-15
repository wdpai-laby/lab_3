from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import BusinessUser
from .serializers import BusinessUserSerializer
from .serializers import RegisterSerializer, SystemUserSerializer
from django.contrib.auth import get_user_model


SystemUser = get_user_model()


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def business_user_list(request):
    if request.method == 'GET':
        users = BusinessUser.objects.all()
        serializer = BusinessUserSerializer(users, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = BusinessUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def business_user_detail(request, pk):
    if request.method == 'GET':
        user = BusinessUser.objects.get(pk=pk)
        serializer = BusinessUserSerializer(user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        user = BusinessUser.objects.get(pk=pk)
        serializer = BusinessUserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        user = BusinessUser.objects.get(pk=pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

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