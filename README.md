# Rehearsal Rooms

Rehearsal Rooms es una aplicación para gestionar reservas de salas de ensayo musicales. Los usuarios pueden registrarse, iniciar sesión, reservar salas y administrar sus reservas, mientras que los administradores tienen control total sobre las salas. El proyecto consta de un backend desarrollado con Node.js, Express y MySQL, y un frontend (en desarrollo) para una experiencia de usuario completa.

Este repositorio contiene el proyecto completo, con el backend en la carpeta `backend/` y espacio reservado para el frontend.

## Tabla de contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Prerrequisitos](#prerrequisitos)
- [Instalación](#instalación)
  - [Backend](#backend)
  - [Base de datos](#base-de-datos)
  - [Frontend](#frontend)
- [Configuración](#configuración)
  - [Configurar el token JWT](#configurar-el-token-jwt)
- [Uso](#uso)
  - [Backend](#uso-del-backend)
  - [Pruebas con Postman](#pruebas-con-postman)
  - [Frontend](#uso-del-frontend)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

## Características

- **Autenticación**:
  - Registro e inicio de sesión para usuarios y administradores.
  - Tokens JWT para autenticación segura.
- **Gestión de salas** (solo administradores):
  - Crear, actualizar, eliminar y listar salas.
- **Gestión de reservas**:
  - Crear, actualizar, cancelar y listar reservas.
  - Los usuarios solo pueden modificar sus propias reservas.
  - Validación de disponibilidad para evitar conflictos.
- **API RESTful**:
  - Endpoints para usuarios, salas y reservas.
- **Frontend** (en desarrollo):
  - Interfaz gráfica para interactuar con la API.

## Tecnologías

- **Backend**:
  - Node.js
  - Express.js
  - MySQL
  - JWT (JSON Web Tokens)
  - bcryptjs (hash de contraseñas)
- **Base de datos**:
  - MySQL
- **Herramientas**:
  - Nodemon (desarrollo)
  - Postman (pruebas de API)
- **Frontend** (en desarrollo):
  - [Por definir: React, Angular, etc.]

## Prerrequisitos

- **Node.js** (v16 o superior)
- **MySQL** (v8 o superior)
- **Git** (para clonar el repositorio)
- **Postman** (para probar la API)
- Un editor de código (por ejemplo, VS Code)

## Instalación

### Backend

1. **Clona el repositorio**:

   ```bash
   git clone https://github.com/<tu-usuario>/rehearsal-rooms.git
   cd Rehearsal-rooms/backend

   ```

2. **Instala las dependencias**:

   ```bash
   npm install

   ```

3. **Crea el archivo de entorno (ver .env.example)**

   - Genera un JWT_SECRET seguro

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

   ```

   - Pega la salida para JWT_SECRET

4. **Ejecuta el script de BBDD**:
   ```bash
       mysql -u root -p rehearsal_rooms < create_database.sql
   ```
