# Guía de Deployment - Task Manager

Esta guía te ayudará a desplegar tanto el frontend (Next.js) como el backend (Express.js + MongoDB) en producción.

## 📋 Requisitos Previos

1. **MongoDB Atlas** (recomendado) o MongoDB local
2. **Cuenta en Vercel** (para frontend)
3. **Cuenta en Railway/Render/Heroku** (para backend)

## 🗄️ Configuración de MongoDB

### Opción 1: MongoDB Atlas (Recomendado)

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta gratuita
3. Crea un nuevo cluster (gratis)
4. Crea un usuario de base de datos
5. Agrega tu IP a la whitelist (0.0.0.0/0 para permitir todas)
6. Obtén la connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/taskmanager
   ```

### Opción 2: MongoDB Local

Si prefieres usar MongoDB local, asegúrate de que esté corriendo:
```bash
mongod
```

## 🚀 Deployment del Backend

### Opción 1: Railway (Recomendado)

1. Ve a [Railway](https://railway.app)
2. Crea una cuenta
3. "New Project" → "Deploy from GitHub repo"
4. Selecciona tu repositorio
5. Configura las variables de entorno:
   - `PORT` = 5000 (o el que Railway asigne)
   - `MONGODB_URI` = tu connection string de MongoDB Atlas
   - `JWT_SECRET` = una clave secreta aleatoria
   - `CORS_ORIGINS` = URL de tu frontend (ej: https://tu-app.vercel.app)
6. Railway detectará automáticamente Node.js y ejecutará `npm start`

### Opción 2: Render

1. Ve a [Render](https://render.com)
2. Crea una cuenta
3. "New" → "Web Service"
4. Conecta tu repositorio
5. Configura:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**: igual que Railway
6. Deploy

### Opción 3: Heroku

1. Instala Heroku CLI
2. Login: `heroku login`
3. Crea app: `heroku create tu-app-backend`
4. Configura variables:
   ```bash
   heroku config:set MONGODB_URI=tu_connection_string
   heroku config:set JWT_SECRET=tu_secret
   heroku config:set CORS_ORIGINS=https://tu-frontend.vercel.app
   ```
5. Deploy: `git push heroku main`

## 🌐 Deployment del Frontend

### Vercel (Recomendado)

1. Ve a [Vercel](https://vercel.com)
2. Importa tu repositorio de GitHub
3. Configura:
   - **Framework Preset**: Next.js
   - **Root Directory**: `/` (raíz del proyecto)
   - **Environment Variables**:
     - `NEXT_PUBLIC_API_URL` = URL de tu backend (ej: https://tu-backend.railway.app/api)
4. Deploy automático

### Alternativa: Netlify

1. Ve a [Netlify](https://netlify.com)
2. "New site from Git"
3. Conecta tu repositorio
4. Configura:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Environment Variables**: igual que Vercel

## 📝 Checklist de Deployment

### Backend
- [ ] MongoDB configurado (Atlas o local)
- [ ] Variables de entorno configuradas
- [ ] Backend desplegado y funcionando
- [ ] Endpoint `/api/health` responde correctamente
- [ ] CORS configurado con la URL del frontend

### Frontend
- [ ] Variable `NEXT_PUBLIC_API_URL` configurada
- [ ] Frontend desplegado
- [ ] Puede conectarse al backend
- [ ] Login funciona correctamente

## 🔧 Configuración de Variables de Entorno

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/taskmanager
JWT_SECRET=tu_secret_key_super_segura_minimo_32_caracteres
CORS_ORIGINS=https://tu-frontend.vercel.app
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://tu-backend.railway.app/api
```

## 🧪 Pruebas Post-Deployment

1. **Backend**:
   ```bash
   curl https://tu-backend.railway.app/api/health
   ```
   Debe responder: `{"message":"API funcionando correctamente","status":"OK"}`

2. **Frontend**:
   - Abre tu app en el navegador
   - Intenta hacer login
   - Crea una tarea
   - Verifica que todo funcione

## 🐛 Solución de Problemas

### Error: "Cannot connect to MongoDB"
- Verifica la connection string
- Asegúrate de que tu IP esté en la whitelist de MongoDB Atlas
- Verifica que las credenciales sean correctas

### Error: "CORS policy"
- Verifica que `CORS_ORIGINS` incluya la URL exacta de tu frontend
- Asegúrate de que no haya espacios en la variable

### Error: "JWT Secret required"
- Asegúrate de que `JWT_SECRET` esté configurado
- Debe ser una cadena de al menos 32 caracteres

### Frontend no se conecta al backend
- Verifica que `NEXT_PUBLIC_API_URL` esté configurado
- Asegúrate de que la URL del backend sea accesible
- Revisa la consola del navegador para errores

## 📚 Recursos Adicionales

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## 🎉 ¡Listo!

Una vez completado el deployment, tu aplicación estará disponible en:
- **Frontend**: https://tu-app.vercel.app
- **Backend**: https://tu-backend.railway.app

¡Felicidades! Tu Task Manager está en producción. 🚀
