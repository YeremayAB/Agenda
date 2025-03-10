    # from django.urls import path
    # from .views import validate_microsoft_token
    
    # urlpatterns = [
    #     path('validate-microsoft/', validate_microsoft_token),
    # ]
    
from django.urls import path
from .views import validate_microsoft_token

urlpatterns = [
    path('validate-microsoft/', validate_microsoft_token),
    #  path('api/get-msal-config/', views.get_msal_config, name='get_msal_config'),
]
    