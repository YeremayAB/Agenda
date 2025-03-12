import requests
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
 
User = get_user_model()
 
@api_view(['POST'])
def validate_microsoft_token(request):
    ms_token = request.data.get('msToken')
    if not ms_token:
        return Response({'error': 'Token no proporcionado'}, status=status.HTTP_400_BAD_REQUEST)
 
    # Llama a Microsoft Graph para obtener datos del usuario
    headers = {'Authorization': f'Bearer {ms_token}'}
    graph_response = requests.get('https://graph.microsoft.com/v1.0/me', headers=headers)
 
    if graph_response.status_code == 200:
        user_data = graph_response.json()
        # Obtén el email; puede venir en 'mail' o 'userPrincipalName'
        email = user_data.get('mail') or user_data.get('userPrincipalName')
        if not email:
            return Response({'error': 'No se encontró email en los datos del usuario'}, status=status.HTTP_400_BAD_REQUEST)
 
        # Busca o crea el usuario
        user, created = User.objects.get_or_create(email=email, defaults={
            'username': email.split('@')[0],
            'first_name': user_data.get('givenName'),
            'last_name': user_data.get('surname')
        })
 
        # Genera un token JWT (refresh + access) usando SimpleJWT
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        return Response({
            'status': 'ok',
            'access': access_token,
            'refresh': str(refresh),
            'user': user_data,  # Devuelve los datos de Microsoft si lo necesitas
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Token de Microsoft inválido'}, status=status.HTTP_401_UNAUTHORIZED)