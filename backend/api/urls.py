from django.urls import path
from .views import business_user_list, business_user_detail, register, system_user_detail
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('business-users/', business_user_list, name='business-user-list'),  # Endpoint for GET and POST
    path('business-users/<int:pk>/', business_user_detail, name='business-user-delete'),  # Endpoint for GET, PUT and DELETE
    path('register/', register, name='register'),  # Endpoint for POST
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Endpoint for POST
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Endpoint for POST
    path('me/', system_user_detail, name='system-user-detail'),  # Endpoint for GET
]