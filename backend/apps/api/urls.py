from django.urls import path
from .views import validate_microsoft_token
from .views import auth_callback
 
urlpatterns = [
    path('validate-microsoft/', validate_microsoft_token),
    path('auth/callback', auth_callback),
]
 
 