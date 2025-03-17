from django.urls import path, re_path
from rest_framework_simplejwt.views import TokenRefreshView

from rest_framework import permissions
from .views import validate_microsoft_token, get_users, get_user


urlpatterns = [
    path('validate-microsoft/', validate_microsoft_token),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/', get_users, name='get_users'),
    path('users/<int:user_id>', get_user, name='get_user'),
    
      
]
  
