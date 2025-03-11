import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def validate_microsoft_token(request):
    token = request.data.get('token')

    if not token:
        return Response({'error': 'Token no proporcionado'}, status=400)

    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get('https://graph.microsoft.com/v1.0/me', headers=headers)

    if response.status_code == 200:
        user_data = response.json()
        user_info = {
            'id': user_data.get('id'),
            'name': user_data.get('displayName'),
            'email': user_data.get('mail') or user_data.get('userPrincipalName'),
            'jobTitle': user_data.get('jobTitle'),
            'profilePicture': "https://graph.microsoft.com/v1.0/me/photo/$value"
        }
        return Response({'status': 'ok', 'user': user_info, 'redirect_url': '/dashboard'})
    elif response.status_code == 401:
        return Response({'error': 'Token inválido o expirado'}, status=401)
    return Response({'error': 'Error al obtener datos del usuario'}, status=response.status_code)

@api_view(['GET'])
def auth_callback(request):
    # Handle the callback logic here
    return Response({'message': 'Callback received'})
