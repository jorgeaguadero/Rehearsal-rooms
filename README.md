# Rehearsal Rooms

Rehearsal Rooms es una aplicación web profesional para la gestión de reservas de salas de ensayo musicales. Permite a usuarios registrarse, reservar salas, gestionar sus reservas y editar su perfil, mientras que los administradores pueden gestionar usuarios y salas con control total. El sistema es seguro, responsive y fácil de usar.

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
  - [Frontend](#uso-del-frontend)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

## Características

- **Autenticación y seguridad**:
  - Registro e inicio de sesión con validación avanzada.
  - Tokens JWT para autenticación segura.
  - Hash de contraseñas con bcryptjs.
- **Gestión de usuarios**:
  - Edición de perfil y teléfono internacional.
  - Validación en tiempo real de nombre de usuario único.
  - Panel de administración con paginación, buscador y edición avanzada.
- **Gestión de salas**:
  - Crear, editar, eliminar y listar salas (solo admin).
  - Subida de imágenes, fallback visual y grid responsive.
- **Gestión de reservas**:
  - Crear, editar, cancelar y listar reservas.
  - Validación de disponibilidad en tiempo real.
  - Visualización de historial y reservas futuras.
- **Frontend profesional**:
  - Interfaz moderna y responsive (React + TailwindCSS).
  - Navbar, footer, cards y tablas adaptadas a móvil y escritorio.
  - Feedback visual en formularios, modales de confirmación y éxito.
  - Iconos FontAwesome en toda la UI.
  - Accesibilidad y experiencia de usuario cuidada.

## Tecnologías

- **Backend**:
  - Node.js, Express.js, MySQL
  - JWT, bcryptjs
- **Frontend**:
  - React, Vite, TailwindCSS
  - Axios, React Router, FontAwesome
- **Herramientas**:
  - Nodemon, ESLint, Postman

## Prerrequisitos

- Node.js (v16 o superior)
- MySQL (v8 o superior)
- Git
- Postman (opcional, para pruebas de API)
- Un editor de código (VS Code recomendado)

## Instalación

### Backend

1. Clona el repositorio:
   ```bash
   git clone https://github.com/<tu-usuario>/rehearsal-rooms.git
   cd Rehearsal-rooms/backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea el archivo de entorno (ver .env.example) y genera un JWT_SECRET seguro:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copia el valor generado en tu archivo `.env`.
4. Ejecuta los scripts de base de datos:
   ```bash
   mysql -u root -p < backend/database/create_database.sql
   mysql -u root -p rehearsal_rooms < backend/database/add_admin_user.sql
   mysql -u root -p rehearsal_rooms < backend/database/seed_test_data.sql
   ```
5. Inicia el backend:
   ```bash
   npm run dev
   # o
   npm start
   ```

### Frontend

1. Abre una nueva terminal y navega a la carpeta frontend:
   ```bash
   cd ../frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el frontend:
   ```bash
   npm run dev
   ```
   Accede a la app en [http://localhost:5173](http://localhost:5173)

## Configuración

- El backend escucha por defecto en el puerto 3000 y el frontend en el 5173.
- Puedes modificar los puertos y la URL del frontend en el archivo `.env` del backend.

## Uso

### Backend

- El backend expone una API RESTful en `/api`.
- Documentación Swagger disponible en `/api-docs` (si está habilitado).

### Frontend

- Accede a la web y regístrate como usuario o inicia sesión como admin (ver datos en seed_test_data.sql).
- Los administradores pueden gestionar usuarios y salas desde el panel de administración.
- Los usuarios pueden reservar, editar y cancelar reservas, así como editar su perfil.

## Estructura del proyecto

- `backend/` — Código del backend (Express, rutas, controladores, repositorios, BBDD)
- `frontend/` — Código del frontend (React, componentes, páginas, estilos)
- `database/` — Scripts SQL para crear y poblar la base de datos

## Contribuciones

¡Las contribuciones son bienvenidas! Abre un issue o pull request para sugerir mejoras o reportar problemas.

## Licencia

MIT
