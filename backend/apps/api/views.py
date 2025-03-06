import request 
import environ
from django.http import JsonResponse
from rest_framework.decorators import api_view
import jwt

env = environ.Env()
environ.Env.read_env()

MICROSOFT_CLIENT_ID = env("MICROSOFT_CLIENT_ID")
MICROSOFT_TENANT_ID = env("MICROSOFT_TENANT_ID")

@api_view(["POST"])
def microsoft_login(request):
    token = request.data.get("token")
    if not token:
        return JsonResponse({"error": "Token no proporcionado"}, status=400)

    url =  f"https://login.microsoftonline.com/{MICROSOFT_TENANT_ID}/v2.0/.well-known/openid-configuration"
    jswks_uri = requests.get(url).json()["jwks_uri"]
    public_keys = requests.get(jswks_uri).json()

    try:
        decoded_token = jwt.decode(token, public_keys, algorithms=["RS256"], audience= MICROSOFT_CLIENT_ID)
        return JsonResponse({"message": "Token válido", "user": decoded_token})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=401)