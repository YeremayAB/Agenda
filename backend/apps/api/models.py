from django.db import models

class User(models.Model):
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
        return f"{self.name} ({self.status})"


class SyncLog(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    new_users = models.IntegerField(default=0)
    updated_users = models.IntegerField(default=0)
    deactivated_users = models.IntegerField(default=0)

    def __str__(self):
        return f"Sincronización {self.timestamp}"