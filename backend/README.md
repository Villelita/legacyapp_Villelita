# Task Manager Backend API

Backend RESTful API para el sistema de gestión de tareas, construido con Node.js, Express.js y MongoDB.

## 🚀 Características

- **Express.js** - Framework web rápido y minimalista
- **MongoDB + Mongoose** - Base de datos NoSQL con ODM
- **JWT Authentication** - Autenticación basada en tokens
- **RESTful API** - Endpoints bien estructurados
- **CORS** - Configurado para comunicación con frontend
- **Bcrypt** - Encriptación de contraseñas

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- MongoDB (local o MongoDB Atlas)
- npm o yarn

## 🛠️ Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=tu_secret_key_super_segura_aqui
CORS_ORIGINS=http://localhost:3000
```

3. Iniciar MongoDB:
   - **Local**: Asegúrate de que MongoDB esté corriendo en tu máquina
   - **MongoDB Atlas**: Usa la connection string de tu cluster

4. Crear datos iniciales (opcional):
```bash
node backend/scripts/seedData.js
```

5. Iniciar el servidor:
```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

## 📡 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual (requiere token)

### Tareas
- `GET /api/tasks` - Obtener todas las tareas
- `GET /api/tasks/:id` - Obtener una tarea
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

### Proyectos
- `GET /api/projects` - Obtener todos los proyectos
- `GET /api/projects/:id` - Obtener un proyecto
- `POST /api/projects` - Crear nuevo proyecto
- `PUT /api/projects/:id` - Actualizar proyecto
- `DELETE /api/projects/:id` - Eliminar proyecto

### Comentarios
- `GET /api/comments/task/:taskId` - Obtener comentarios de una tarea
- `POST /api/comments` - Crear nuevo comentario

### Historial
- `GET /api/history/task/:taskId` - Obtener historial de una tarea
- `GET /api/history` - Obtener todo el historial (últimos 100)

### Notificaciones
- `GET /api/notifications` - Obtener notificaciones del usuario
- `PUT /api/notifications/mark-read` - Marcar notificaciones como leídas

### Búsqueda
- `POST /api/search` - Búsqueda avanzada de tareas

### Reportes
- `GET /api/reports/tasks` - Reporte de tareas por estado
- `GET /api/reports/projects` - Reporte de proyectos
- `GET /api/reports/users` - Reporte de usuarios
- `GET /api/reports/export` - Exportar tareas a CSV

## 🔐 Autenticación

La mayoría de los endpoints requieren autenticación. Para autenticarte:

1. Haz login en `/api/auth/login` para obtener un token JWT
2. Incluye el token en el header de las peticiones:
```
Authorization: Bearer <tu_token>
```

## 📝 Ejemplo de Uso

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

### Crear Tarea (con token)
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{
    "title": "Nueva tarea",
    "description": "Descripción de la tarea",
    "status": "Pendiente",
    "priority": "Alta"
  }'
```

## 🗄️ Estructura de la Base de Datos

### Colecciones:
- **users** - Usuarios del sistema
- **projects** - Proyectos
- **tasks** - Tareas
- **comments** - Comentarios en tareas
- **history** - Historial de cambios
- **notifications** - Notificaciones

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo (con nodemon)
- `npm start` - Inicia el servidor en modo producción
- `node scripts/seedData.js` - Crea datos iniciales

## 🌐 Deployment

### Opción 1: Vercel
1. Instala Vercel CLI: `npm i -g vercel`
2. Desde la carpeta backend: `vercel`

### Opción 2: Heroku
1. Crea una app en Heroku
2. Configura las variables de entorno
3. Conecta con MongoDB Atlas
4. Deploy: `git push heroku main`

### Opción 3: Railway / Render
Similar a Heroku, configura las variables de entorno y conecta con MongoDB Atlas.

## 📦 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| PORT | Puerto del servidor | 5000 |
| MONGODB_URI | Connection string de MongoDB | mongodb://localhost:27017/taskmanager |
| JWT_SECRET | Secret key para JWT | tu_secret_key_super_segura |
| CORS_ORIGINS | Orígenes permitidos (separados por coma) | http://localhost:3000 |

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
- Verifica que MongoDB esté corriendo
- Revisa la connection string en `.env`
- Para MongoDB Atlas, asegúrate de que tu IP esté en la whitelist

### Error de CORS
- Verifica que `CORS_ORIGINS` incluya la URL de tu frontend
- Asegúrate de que el frontend esté haciendo peticiones al puerto correcto

### Error de autenticación
- Verifica que el token JWT esté incluido en el header
- Asegúrate de que `JWT_SECRET` esté configurado

## 📄 Licencia

Este proyecto es de código abierto.
