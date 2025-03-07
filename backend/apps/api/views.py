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
        return Response({'status': 'ok', 'user': user_data})
    else:
        return Response({'error': 'Token inválido'}, status=401)