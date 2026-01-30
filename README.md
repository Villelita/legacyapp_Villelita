# Task Manager - Full Stack Application

Sistema completo de gestión de tareas y proyectos con **Next.js** (frontend) y **Node.js + Express.js + MongoDB** (backend).

## 🚀 Características

### Frontend (Next.js)
- **Next.js 14** con App Router
- **TypeScript** para type safety
- **React Hooks** para manejo de estado
- **Diseño moderno** y responsive
- **Comunicación con API RESTful**

### Backend (Express.js + MongoDB)
- **Express.js** - Framework web rápido
- **MongoDB + Mongoose** - Base de datos NoSQL
- **JWT Authentication** - Autenticación basada en tokens
- **RESTful API** - Endpoints bien estructurados
- **Bcrypt** - Encriptación de contraseñas

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- MongoDB (local o MongoDB Atlas)
- npm o yarn

## 🛠️ Instalación y Configuración

### 1. Clonar/Descargar el proyecto

```bash
cd legacyapp
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

### 3. Inicializar datos (opcional)

```bash
node scripts/seedData.js
```

Esto creará usuarios por defecto:
- `admin` / `admin`
- `user1` / `user1`
- `user2` / `user2`

### 4. Iniciar el Backend

```bash
npm run dev
```

El backend estará corriendo en `http://localhost:5000`

### 5. Configurar el Frontend

Desde la raíz del proyecto:

```bash
npm install
```

Crea un archivo `.env.local` en la raíz:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 6. Iniciar el Frontend

```bash
npm run dev
```

El frontend estará corriendo en `http://localhost:3000`

## 🔐 Autenticación

La aplicación usa JWT (JSON Web Tokens) para autenticación:

1. El usuario hace login en `/api/auth/login`
2. Recibe un token JWT
3. El token se guarda en `localStorage`
4. Todas las peticiones incluyen el token en el header: `Authorization: Bearer <token>`

### Principales:
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/tasks` - Obtener tareas
- `POST /api/tasks` - Crear tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea
- Y muchos más...

## 📦 Scripts Disponibles

### Frontend
- `npm run dev` - Desarrollo
- `npm run build` - Build para producción
- `npm start` - Producción
- `npm run lint` - Linter

### Backend
- `npm run dev` - Desarrollo (con nodemon)
- `npm start` - Producción
- `node scripts/seedData.js` - Crear datos iniciales

## 📚 Documentación Adicional

- [Backend README](backend/README.md) - Documentación completa del backend
- [DEPLOYMENT.md](DEPLOYMENT.md) - Guía de deployment
- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)




