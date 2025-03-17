from rest_framework import serializers
from .models import User

def get_access_token():
    app = msal.ConfidentialClientApplication(
        client_id=settings.OUTLOOK_CLIENT_ID,
        authority=f"https://login.microsoftonline.com/{settings.OUTLOOK_TENANT_ID}",
        client_credential=settings.OUTLOOK_CLIENT_SECRET,
    )
   
    result = app.acquire_token_for_client(scopes=["https://graph.microsoft.com/.default"])
    print('El resultado es:', result)
 
    if "access_token" in result:
        return result["access_token"]
    else:
        print(f"Error retrieving access token: {result.get('error_description')}")
        return None

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'position', 'profile_image', 'status']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

        