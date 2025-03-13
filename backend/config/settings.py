from datetime import timedelta
import environ
import os
from pathlib import Path
 
BASE_DIR = Path(__file__).resolve().parent.parent
 
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))
 
SECRET_KEY = env('DJANGO_SECRET_KEY')
DEBUG = env.bool('DJANGO_DEBUG', default=False)
ALLOWED_HOSTS = env.list('DJANGO_ALLOWED_HOSTS', default=[])
 
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
 
    'corsheaders',
    'rest_framework',
    'drf_yasg', 
    'rest_framework_simplejwt.token_blacklist',
 
    'apps.api',
    'apps.core',
]
 
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',  # Necesario para sesiones
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',  # Necesario para autenticación
    'django.contrib.messages.middleware.MessageMiddleware',  # Necesario para mensajes
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
 # 🔥 CORS CONFIGURACIÓN
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # 🔥 Permite peticiones desde tu frontend
]

CORS_ALLOW_CREDENTIALS = True  # 🔥 Permitir cookies y tokens de autenticación

CORS_ALLOW_HEADERS = [
    "content-type",
    "authorization",
    "access-control-allow-origin",
]

CORS_ALLOW_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]  # 🔥 Métodos permitido

 
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
 
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('POSTGRESQL_NAME'),
        'USER': env('POSTGRESQL_USER'),
        'PASSWORD': env('POSTGRESQL_PASSWORD'),
        'HOST': env('POSTGRESQL_HOST'),
        'PORT': env('POSTGRESQL_PORT'),
    }
}
 
LANGUAGE_CODE = 'es'
TIME_ZONE = 'Atlantic/Canary'
USE_I18N = True
USE_TZ = True
 
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
 
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}
 
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=10),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}
 
ROOT_URLCONF = 'config.urls'
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.office365.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = env('OUTLOOK_HOST_EMAIL')
EMAIL_HOST_PASSWORD = env('OUTLOOK_HOST_PASSWORD')
 
MICROSOFT_CLIENT_ID = env('MICROSOFT_CLIENT_ID')
MICROSOFT_CLIENT_SECRET = env('MICROSOFT_CLIENT_SECRET')
MICROSOFT_TENANT_ID = env('MICROSOFT_TENANT_ID')
MICROSOFT_AUTHORITY = f"https://login.microsoftonline.com/{MICROSOFT_TENANT_ID}"
MICROSOFT_SCOPE = ["User.Read"]


CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
