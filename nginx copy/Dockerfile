# Dockerfile para construir el frontend
FROM node:20.11.1 as build

WORKDIR /app

# Copiamos el código, instalamos dependencias y hacemos el build
COPY ./frontend ./
RUN npm install
RUN npm run build

# Nginx para servir los archivos estáticos
FROM nginx:latest

# Copiamos los archivos estáticos desde la etapa de build a la carpeta de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Opcionalmente, puedes copiar una configuración personalizada de Nginx
COPY ./nginx/conf /etc/nginx/conf.d

# Exponemos el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
