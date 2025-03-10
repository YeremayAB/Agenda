from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
import os

@api_view(['POST'])
def validate_microsoft_token(request):
    token = request.data.get('token')

    if not token:
        return Response({'error': 'Token no proporcionado'}, status=status.HTTP_400_BAD_REQUEST)

    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get('https://graph.microsoft.com/v1.0/me', headers=headers)

    if response.status_code == 200:
        user_data = response.json()
        
        # Devuelves la URL con un parámetro de estado o token, que luego manejarás en el frontend
        return Response({
            'status': 'ok', 
            'user': user_data, 
            'redirectUrl': 'http://localhost:3000/dashboard'
        })
    else:
        return Response({'error': 'Token inválido'}, status=status.HTTP_401_UNAUTHORIZED)


# def get_msal_config(request):
#     config = {
#         "clientId": os.getenv("MICROSOFT_CLIENT_ID"),
#         "authority": f"https://login.microsoftonline.com/{os.getenv('MICROSOFT_TENANT_ID')}",
#         "redirectUri": "http://localhost:3000/auth/callback",
#     }
#     return JsonResponse(config)