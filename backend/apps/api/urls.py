from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from .views import MicrosoftLogin



urlpatterns = [
    # path('token/', TokenObtainPairView(), name='token_obtain_pair'),
    # path('token/refresh/', TokenRefreshView, name='token_refresh'),
    path("microsoft/", MicrosoftLogin.as_view(), name="microsoft_login"),
]
