# apps/api/views.py
import requests
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer

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

@api_view(['GET'])
def get_users(request):
    tenant_id = env('MICROSOFT_TENANT_ID')
    client_id = env('MICROSOFT_CLIENT_ID')
    client_secret = env('MICROSOFT_CLIENT_SECRET')

    # Endpoint para obtener el token de acceso
    token_url = f"https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token"
    token_data = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret,
        "scope": "https://graph.microsoft.com/.default"
    }

    try:
        token_response = requests.post(token_url, data=token_data)
        token_response.raise_for_status()
        access_token = token_response.json().get("access_token")

        if not access_token:
            return Response({"error": "No se pudo obtener el token de acceso"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        headers = {"Authorization": f"Bearer {access_token}"}
        users_response = requests.get(GRAPH_API_USERS_URL, headers=headers)
        users_response.raise_for_status()

        return Response(users_response.json(), status=status.HTTP_200_OK)

    except requests.exceptions.RequestException as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        serializer= UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

# import requests
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .models import User
 
# GRAPH_API_URL = "https://graph.microsoft.com/v1.0/me"
 
# @api_view(['POST'])
# def validate_microsoft_token(request):
#     """ Valida el token de Microsoft y registra automáticamente el usuario en la base de datos. """
#     token = request.data.get('token')
#     if not token:
#         return Response({'error': 'Token no proporcionado'}, status=400)
 
#     headers = {'Authorization': f'Bearer {token}'}
#     response = requests.get(GRAPH_API_URL, headers=headers)
 
#     if response.status_code == 200:
#         user_data = response.json()
 
#         # Extraer los datos necesarios
#         email = user_data.get('mail') or user_data.get('userPrincipalName')  # Asegurar el email
#         name = user_data.get('displayName', 'Usuario Desconocido')
#         position = user_data.get('jobTitle', 'No especificado')
#         profile_picture_url = "https://graph.microsoft.com/v1.0/me/photo/$value"  # URL de la imagen
#         # Registrar usuario en la base de datos (o actualizar si ya existe)
#         user, created = User.objects.update_or_create(
#             email=email,
#             defaults={
#                 "name": name,
#                 "position": position,
#                 "profile_image": profile_picture_url,
#                 "status": "Activo",
#             }
#         )
 
#         return Response({
#             'status': 'ok',
#             'user': {
#                 'id': user.id,
#                 'name': user.name,
#                 'email': user.email,
#                 'position': user.position,
#                 'profilePicture': user.profile_image,
#             },
#             'redirect_url': '/dashboard',
#             'message': 'Usuario registrado correctamente' if created else 'Usuario actualizado'
#         })
 
#     elif response.status_code == 401:
#         return Response({'error': 'Token inválido o expirado'}, status=401)
 
#     return Response({'error': 'Error al obtener datos del usuario'}, status=response.status_code)
 
 
# @api_view(['GET'])
# def auth_callback(request):
#     """ Manejo del callback de autenticación de Microsoft """
#     return Response({'message': 'Callback recibido'})