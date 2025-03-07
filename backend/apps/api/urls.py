from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from .views import MicrosoftLogin, TokenObtainPairView, TokenRefreshView



urlpatterns = [
    path('token/', TokenObtainPairView(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView, name='token_refresh'),
    path("microsoft/", MicrosoftLogin, name="microsoft_login"),
    path("listaUsuarios/", listar_usuarios, name="listar_usuarios"), 
]
