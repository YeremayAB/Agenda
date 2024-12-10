# Reango

# Proyecto Django con API REST

Este es un proyecto base de Django que incluye una API REST, diseñado para ser utilizado con un frontend en React.

## Estructura del backend

A continuación se detalla la estructura de carpetas del proyecto:

.
├── apps
│ ├── api
│ │ ├── init.py # Inicializa el paquete de la API
│ │ ├── admin.py # Configuración del panel de administración
│ │ ├── apps.py # Configuración de la aplicación
│ │ ├── migrations # Carpeta para las migraciones de la base de datos
│ │ │ └── init.py # Inicializa el paquete de migraciones
│ │ ├── models.py # Modelos de datos de la API
│ │ ├── serializers.py # Serializadores para transformar datos
│ │ ├── tests.py # Pruebas unitarias para la API
│ │ ├── urls.py # Rutas de la API
│ │ └── views.py # Vistas de la API
│ └── core
│ ├── init.py # Inicializa el paquete core
│ ├── admin.py # Configuración del panel de administración para core
│ ├── apps.py # Configuración de la aplicación core
│ ├── migrations # Carpeta para las migraciones del core
│ │ └── init.py # Inicializa el paquete de migraciones del core
│ ├── models.py # Modelos de datos del core
│ ├── tests.py # Pruebas unitarias para core
│ └── views.py # Vistas del core
├── base.txt # Archivo base para dependencias (opcional)
├── config
│ ├── init.py # Inicializa el paquete config
│ ├── asgi.py # Configuración ASGI para despliegue
│ ├── settings.py # Configuración principal del proyecto Django
│ ├── urls.py # Rutas principales del proyecto
│ └── wsgi.py # Configuración WSGI para despliegue
├── manage.py # Script para gestionar el proyecto Django
├── requirements.txt # Lista de dependencias del proyecto
└── venv # Entorno virtual (no subir a control de versiones)
├── bin # Binarios del entorno virtual
│ ├── python -> python3 #
│ ├── python3 -> /usr/bin/python3 #
│ └── python3.10 -> python3 #
├── include #
├── lib #
│ └── python3.10 #
│ └── site-packages #
├── lib64 -> lib #
└── pyvenv.cfg #

## Instalación

1. **Clona el repositorio**:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_REPOSITORIO>
   ```

2. **Crea y activa un entorno virtual**:

   ```bash
   python -m venv venv  # Crea el entorno virtual
   source venv/bin/activate  # Activa el entorno virtual (en Windows: venv\Scripts\activate)
   ```

3. **Instala las dependencias**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Realiza las migraciones**:

   ```bash
   python manage.py migrate
   ```

5. **Inicia el servidor**:
   ```bash
   python manage.py runserver
   ```

## Uso

- La API estará disponible en `http://localhost:8000/api/`.
- Puedes acceder al panel de administración en `http://localhost:8000/admin/`.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-caracteristica`).
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva característica'`).
4. Sube tus cambios (`git push origin feature/nueva-caracteristica`).
5. Abre un Pull Request.
