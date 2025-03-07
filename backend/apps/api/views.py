from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from allauth.socialaccount.providers.microsoft.views import MicrosoftGraphOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.models import SocialAccount
from dj_rest_auth.jwt_auth import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()





class MicrosoftLogin(SocialLoginView):
    adapter_class = MicrosoftGraphOAuth2Adapter
    permission_classes = [AllowAny]

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

    def post(self, request, *args, **kwargs):
        # Serializa los datos de la solicitud
        self.serializer = self.get_serializer(data=request.data)
        self.serializer.is_valid(raise_exception=True)
        self.login()
        
        user = self.user
        if not user or not user.is_authenticated:
            return Response({"error": "No se pudo autenticar al usuario"}, status=400)

        # Verifica si el usuario tiene una cuenta de Microsoft vinculada
        social_account = SocialAccount.objects.filter(user=user, provider='microsoft').first()
        if social_account:
            extra_data = social_account.extra_data

            # Actualiza o crea el usuario con los datos de Microsoft
            profile, created = User.objects.update_or_create(
                email=user.email,
                defaults={
                    "username": user.username,
                    "first_name": user.first_name or extra_data.get("givenName", "Sin nombre"),
                    "last_name": user.last_name or extra_data.get("surname", "Sin apellido"),
                    "position": extra_data.get("jobTitle", "Sin cargo"),
                    "profile_image": extra_data.get("picture", ""),
                    "status": "Active"
                }
            )

            # Crea o actualiza el perfil de usuario si es necesario
            if created:
                # Crear perfil de usuario si no existe
                profile = UserProfile.objects.create(user=profile)

            # Genera tokens de autenticación
            refresh = RefreshToken.for_user(profile)
            access_token = refresh.access_token

            return Response({
                "message": "Usuario autenticado correctamente",
                "user": {
                    "email": profile.email,
                    "first_name": profile.first_name,
                    "last_name": profile.last_name,
                    "position": profile.position,
                    "profile_image": profile.profile_image
                },
                "access_token": str(access_token),
                "refresh_token": str(refresh)
            })
        
        return Response({"error": "No se encontró cuenta de Microsoft vinculada"}, status=400)

        