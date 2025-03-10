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
        # Aquí se responde con la URL a la que se debe redirigir el usuario en el frontend
        return Response({'status': 'ok', 'redirect_url': '/dashboard'})  # La URL donde se redirigirá al usuario
    elif response.status_code == 401:
        return Response({'error': 'Token inválido o expirado'}, status=401)
    elif response.status_code == 403:
        return Response({'error': 'Permisos insuficientes para acceder al recurso'}, status=403)
    elif response.status_code == 400:
        return Response({'error': 'Solicitud incorrecta, verifica el token'}, status=400)
    else:
        return Response({'error': 'Error desconocido al validar el token'}, status=response.status_code)
