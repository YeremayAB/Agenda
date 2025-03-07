from django.db import models
from django.contrib.auth.models import AbstractUser
from django.shortcuts import get_object_or_404
from allauth.socialaccount.models import SocialAccount

# Modelo para Departamentos
class Department(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


# Modelo Personalizado de Usuario
class UserProfile(AbstractUser):
    # Evita conflictos de relaciones inversas
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name="userprofile_set",
        related_query_name="userprofile"
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="userprofile_set",
        related_query_name="userprofile"
    )

    # Campos personalizados
    position = models.CharField(max_length=255, blank=True, null=True)
    profile_image = models.URLField(blank=True, null=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, blank=True, null=True)
    STATUS_CHOICES = [
        ('Active', 'Activo'),
        ('Ex-Employee', 'Ex-Empleado'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')

    def missing_fields(self):
        """Devuelve una lista de campos que están vacíos y necesitan completarse."""
        missing = []
        if not self.first_name:
            missing.append("first_name")
        if not self.email:
            missing.append("email")
        if not self.position:
            missing.append("position")
        if not self.profile_image:
            missing.append("profile_image")
        if not self.department:
            missing.append("department")
        return missing

    def __str__(self):
        return self.get_full_name() or self.username

    @staticmethod
    def create_or_update_from_microsoft_account(user):
        """Crea o actualiza un usuario automáticamente desde la cuenta de Microsoft."""
        social_account = get_object_or_404(SocialAccount, user=user)
        extra_data = social_account.extra_data
        profile, created = UserProfile.objects.update_or_create(
            email=user.email,
            defaults={
                "username": user.username,
                "first_name": extra_data.get("givenName", ""),
                "last_name": extra_data.get("surname", ""),
                "position": extra_data.get("jobTitle", ""),
                "profile_image": extra_data.get("picture", ""),
                "status": "Active"
            }
        )
        return profile

    @staticmethod
    def mark_as_ex_employee(email):
        """Marca un usuario como 'Ex-Empleado'."""
        try:
            user = UserProfile.objects.get(email=email)
            user.status = "Ex-Employee"
            user.save()
            return True
        except UserProfile.DoesNotExist:
            return False


# Modelo de Contactos
class Contact(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="contacts")
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="contacts")
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    company = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name


# Modelo de Reuniones
class Meeting(models.Model):
    title = models.CharField(max_length=255)
    date = models.DateTimeField()
    location = models.CharField(max_length=255, blank=True, null=True)
    attendees = models.ManyToManyField(UserProfile, related_name="meetings")

    def __str__(self):
        return self.title


# Modelo de Logs de Sincronización
class SyncLog(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    added_users = models.IntegerField(default=0)
    updated_users = models.IntegerField(default=0)
    removed_users = models.IntegerField(default=0)

    def __str__(self):
        return f"Sync on {self.timestamp}"