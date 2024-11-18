from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.user_list, name='user-list'),  # Endpoint for GET and POST
    path('users/<int:pk>/', views.user_delete, name='user-delete'),  # Endpoint for DELETE
]