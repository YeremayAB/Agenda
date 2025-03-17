# apps/api/views.py
import requests
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
import environ

env = environ.Env()
env.read_env()

GRAPH_API_USERS_URL = "https://graph.microsoft.com/v1.0/users"

User = get_user_model()

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import requests
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
def validate_microsoft_token(request):
    """
    Valida un token de Microsoft y autentica al usuario en el sistema.

    **Parámetros:**
        - request (Request): Solicitud HTTP que debe contener el token de Microsoft en el cuerpo (`msToken`).

    **Proceso:**
        1. Obtiene el token de Microsoft desde la solicitud.
        2. Realiza una solicitud a Microsoft Graph para obtener los datos del usuario.
        3. Extrae el email del usuario desde la respuesta de Microsoft.
        4. Busca o crea un usuario en la base de datos con los datos obtenidos.
        5. Genera un token JWT de acceso y refresh para el usuario autenticado.

    **Salida:**
        - (Response): Respuesta JSON con:
            - `status` (str): "ok" si la autenticación es exitosa.
            - `access` (str): Token de acceso generado.
            - `refresh` (str): Token de actualización generado.
            - `user` (dict): Datos del usuario obtenidos desde Microsoft.

    **Códigos de estado:**
        - 200: Autenticación exitosa.
        - 400: Token no proporcionado o datos insuficientes en la respuesta de Microsoft.
        - 401: Token de Microsoft inválido.

    **Excepciones:**
        - Puede fallar si el token de Microsoft es incorrecto o si hay problemas con la API de Microsoft.
    """
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
    """
    Vista para obtener todos los usuarios de Microsoft Graph API con paginación.
    - Utiliza credenciales de cliente para obtener un token de acceso.
    - Recupera todos los usuarios disponibles en Microsoft Graph API, manejando la paginación automáticamente.

    Respuestas:
        - 200 OK: Devuelve una lista de todos los usuarios con su cantidad total.
        - 500 Internal Server Error: Si ocurre un error al obtener el token o al llamar a Microsoft Graph API.
    """
    try:
        tenant_id = env('MICROSOFT_TENANT_ID')
        client_id = env('MICROSOFT_CLIENT_ID')
        client_secret = env('MICROSOFT_CLIENT_SECRET')

        token_url = f"https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token"
        token_data = {
            "grant_type": "client_credentials",
            "client_id": client_id,
            "client_secret": client_secret,
            "scope": "https://graph.microsoft.com/.default"
        }

        # Obtener el token de acceso
        token_response = requests.post(token_url, data=token_data)
        token_json = token_response.json()

        if "access_token" not in token_json:
            return Response({"error": f"Error obteniendo token: {token_json}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        access_token = token_json["access_token"]
        headers = {"Authorization": f"Bearer {access_token}"}

        # Obtener TODOS los usuarios con paginación
        users = []
        next_url = GRAPH_API_USERS_URL

        while next_url:
            users_response = requests.get(next_url, headers=headers)
            
            if users_response.status_code != 200:
                return Response({"error": f"Error en Microsoft Graph: {users_response.json()}"}, status=users_response.status_code)

            users_data = users_response.json()
            users.extend(users_data.get("value", []))  # Agregar usuarios a la lista

            # Verificar si hay más páginas
            next_url = users_data.get("@odata.nextLink")

        return Response({"total_users": len(users), "users": users}, status=status.HTTP_200_OK)

    except requests.exceptions.RequestException as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_user(request, user_id):
    """
    Vista para obtener los detalles de un usuario específico por su ID.
    - Busca al usuario en la base de datos utilizando el modelo User.
    - Serializa los datos del usuario y los devuelve en formato JSON.

    Parámetros:
        - user_id (int): ID del usuario a buscar

    Respuestas:
        - 200 OK: Devuelve los datos serializados del usuario si se encuentra.
        - 404 Not Found: Si el usuario no existe en la base de datos.
    """
    try:
        user = User.objects.get(id=user_id)
        serializer= UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def logout(request):
    """
    Vista para cerrar sesión invalidando un token de refresco.
    - Verifica si el token de refresco proporcionado es válido.
    - Si es válido, agrega el token a la lista negra para invalidarlo.

    Parámetros:
        - refresh_token (str): Tokem de refresco proporcionado en el cuerpo de la solicitud.

    Respuestas:
        - 200 OK: Sesión cerrada correctamente.
        - 400 Bad Request: Si no se proporciona un token de refresco o si el token es inválido/expirado.
        - 500 Internal Server Error: Si ocurre un error inesperado durante el proceso.
    """

    try:
        # Obtén el token de refresco del encabezado Authorization
        refresh_token = request.data.get('refresh_token')
        
        if not refresh_token:
            return Response({'error': 'No se proporcionó un token de refresco'}, status=status.HTTP_400_BAD_REQUEST)

        # Verificar si el token de refresco es válido
        try:
            refresh = RefreshToken(refresh_token)
            refresh.blacklist()  # Agrega el token a la lista negra para invalidarlo

            return Response({'status': 'success', 'message': 'Sesión cerrada correctamente'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Token inválido o expirado'}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'error': f'Error al cerrar sesión: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
