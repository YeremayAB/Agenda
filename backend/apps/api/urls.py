from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
 
from .views import validate_microsoft_token
 
urlpatterns = [
    path('validate-microsoft/', validate_microsoft_token),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]