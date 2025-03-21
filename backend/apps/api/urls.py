from django.urls import path, re_path
from rest_framework_simplejwt.views import TokenRefreshView

from rest_framework import permissions
from .views import validate_microsoft_token, get_users, get_user, FavoriteUserView


urlpatterns = [
    path('validate-microsoft/', validate_microsoft_token),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    # URL para obtener la información de los usuarios
    path('users/', get_users, name='get_users'),
    # URL para obtener la información de un usuario específico por su ID
    path('users/<int:user_id>', get_user, name='get_user'),
    # URL para cerrar sesión
    path('logout/', get_users, name='get_users'),
    path('favorites/<str:user_id>', FavoriteUserView.as_view()),
    path('favorites', FavoriteUserView.as_view())
      
]
  
