from django.db import models

class User(models.Model):
    """
    Modelo que representa a un usuario en el sistema.

    Atributos:
        name (str): Nombre completo del usuario
        email (str): Correo electrónico único del usuario
        position (str, optional): Cargo o puesto del usuario dentro de la empresa
        department (str, optional): Departamento al que pertenece el usuario
        office (str, optional): Oficina en la que trabaja el usuario
        extension (str, optional): Extensión telefónica de la oficina
        phone (str, optional): Teléfono de contacto del usuario.
        mobile_phone (str, opcional): Número de teléfono móvil del usuario (por defecto "-").
        profile_image (str, opcional): URL de la imagen de perfil del usuario.
        status (str): Estado del usuario (Activo o Ex-Empleado).
        created_at (datetime): Fecha y hora de creación del usuario.
        updated_at (datetime): Fecha y hora de la última actualización del usuario.
    """

    STATUS_CHOICES = [
        ("Activo", "Activo"),
        ("Ex-Empleado", "Ex-Empleado"),
    ]

    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    position = models.CharField(max_length=255, blank=True, null=True)
    department = models.CharField(max_length=255, blank=True, null=True)
    office = models.CharField(max_length=255, blank=True, null=True)
    extension = models.CharField(max_length=10, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    mobile_phone = models.CharField(max_length=20, blank=True, null=True, default="-")
    profile_image = models.URLField(blank=True, null=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Activo")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        """Retorna una representación en string del usuario"""
        return f"{self.name} ({self.status})"


class SyncLog(models.Model):
    """
    Modelo para registrar las sincronizaciones de usuarios.

    Atributos:
        timestamp (datetime): Fecha y hora de la sincronización.
        new_users (int): Número de usuarios nuevos agregados en la sincronización.
        updated_users (int): Número de usuarios actualizados en la sincronización.
        deactivated_users (int): Número de usuarios desactivados en la sincronización.
    """

    timestamp = models.DateTimeField(auto_now_add=True)
    new_users = models.IntegerField(default=0)
    updated_users = models.IntegerField(default=0)
    deactivated_users = models.IntegerField(default=0)

    def __str__(self):
        """Retorna una representación en string del log de sincronización."""
        return f"Sincronización {self.timestamp}"
