from django.urls import path
from .views import film_list, register, system_user_detail
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('film-list/', film_list, name='film-list'),  # Endpoint for GET and POST
    path('register/', register, name='register'),  # Endpoint for POST
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Endpoint for POST
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Endpoint for POST
    path('me/', system_user_detail, name='system-user-detail'),  # Endpoint for GET
]