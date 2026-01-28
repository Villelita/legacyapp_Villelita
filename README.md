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

Crea un archivo `.env` en la carpeta `backend`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=tu_secret_key_super_segura_aqui
CORS_ORIGINS=http://localhost:3000
```

Para MongoDB Atlas, usa:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
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

## 📡 Estructura del Proyecto

```
legacyapp/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/             # Componentes React
│   ├── Login.tsx
│   ├── Tasks.tsx
│   ├── Projects.tsx
│   ├── Comments.tsx
│   ├── History.tsx
│   ├── Notifications.tsx
│   ├── Search.tsx
│   └── Reports.tsx
├── hooks/                 # React Hooks
│   ├── useAPI.ts          # Hooks para API
│   └── useStorage.ts      # Hooks legacy (no usado)
├── lib/                   # Utilidades
│   ├── api.ts             # Cliente API
│   └── storage.ts         # Storage legacy (no usado)
├── backend/               # Backend Express.js
│   ├── config/            # Configuración
│   ├── models/            # Modelos Mongoose
│   ├── routes/            # Rutas API
│   ├── middleware/        # Middleware
│   ├── utils/             # Utilidades
│   ├── scripts/           # Scripts
│   └── server.js          # Servidor principal
└── package.json
```

## 🔐 Autenticación

La aplicación usa JWT (JSON Web Tokens) para autenticación:

1. El usuario hace login en `/api/auth/login`
2. Recibe un token JWT
3. El token se guarda en `localStorage`
4. Todas las peticiones incluyen el token en el header: `Authorization: Bearer <token>`

## 📝 Endpoints de la API

Ver documentación completa en `backend/README.md`

### Principales:
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/tasks` - Obtener tareas
- `POST /api/tasks` - Crear tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea
- Y muchos más...

## 🌐 Deployment

Ver guía completa en `DEPLOYMENT.md`

### Resumen rápido:

1. **Backend**: Deploy en Railway/Render/Heroku
2. **Frontend**: Deploy en Vercel
3. **MongoDB**: MongoDB Atlas (gratis)

## 🧪 Pruebas

### Probar el Backend

```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

### Probar el Frontend

1. Abre `http://localhost:3000`
2. Login con `admin` / `admin`
3. Crea una tarea
4. Verifica que todo funcione

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

## 🐛 Solución de Problemas

### Error: "Cannot connect to MongoDB"
- Verifica que MongoDB esté corriendo
- Revisa la connection string en `.env`
- Para MongoDB Atlas, verifica la whitelist de IPs

### Error: "CORS policy"
- Verifica que `CORS_ORIGINS` en el backend incluya la URL del frontend
- Asegúrate de que no haya espacios en la variable

### Frontend no se conecta al backend
- Verifica que `NEXT_PUBLIC_API_URL` esté configurado
- Asegúrate de que el backend esté corriendo
- Revisa la consola del navegador

## 📚 Documentación Adicional

- [Backend README](backend/README.md) - Documentación completa del backend
- [DEPLOYMENT.md](DEPLOYMENT.md) - Guía de deployment
- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)

## 🎉 ¡Listo!

Tu aplicación está lista para usar. Puedes:
- Desarrollar localmente
- Desplegar en producción
- Escalar según necesites

## 📄 Licencia

Este proyecto es de código abierto.
