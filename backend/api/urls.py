from django.urls import path
from .views import film_list, register, system_user_detail, favorites, favorites_delete, logout
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('film-list/', film_list, name='film-list'),  # Endpoint for GET and POST
    path('register/', register, name='register'),  # Endpoint for POST
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Endpoint for POST
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Endpoint for POST
    path('logout/', logout, name='logout'),  # Endpoint for POST
    path('me/', system_user_detail, name='system-user-detail'),  # Endpoint for GET, PUT
    path('favorites/', favorites, name='favorites'), # Endpoint for GET, POST
    path('favorites/<int:pk>/', favorites_delete, name='favorites-delete') # Endpoint for DELETE
]