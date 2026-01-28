# 🚀 Configuración para Render.com

Esta guía te ayudará a desplegar tu aplicación en Render.com

## 📋 Requisitos Previos

1. Cuenta en [Render.com](https://render.com) (gratis)
2. MongoDB Atlas configurado (ya lo tienes ✅)
3. Repositorio en GitHub

---

## 🔧 Configuración del Backend en Render

### Paso 1: Crear Web Service para Backend

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Haz clic en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub
4. Configura el servicio:
   - **Name:** `legacyapp-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Plan:** `Free`

### Paso 2: Configurar Variables de Entorno del Backend

En la sección **"Environment Variables"** del servicio backend, agrega:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://Villela:4xmBvjLpkn1o7Tdz@cluster.o72gocw.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=legacyapp_jwt_secret_key_super_segura_2026_minimo_32_caracteres_123456789
CORS_ORIGINS=https://legacyapp-frontend.onrender.com
```

⚠️ **IMPORTANTE:** Reemplaza `CORS_ORIGINS` con la URL real de tu frontend después de crearlo.

---

## 🎨 Configuración del Frontend en Render

### Paso 1: Crear Web Service para Frontend

1. En Render Dashboard, haz clic en **"New +"** → **"Web Service"**
2. Conecta el mismo repositorio
3. Configura el servicio:
   - **Name:** `legacyapp-frontend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** `Free`

### Paso 2: Configurar Variables de Entorno del Frontend

En la sección **"Environment Variables"**, agrega:

```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://legacyapp-backend.onrender.com/api
```

⚠️ **IMPORTANTE:** Reemplaza `legacyapp-backend.onrender.com` con la URL real de tu backend.

---

## 🔄 Actualizar CORS después del Deploy

Una vez que ambos servicios estén desplegados:

1. Ve al servicio **backend** en Render
2. Edita la variable `CORS_ORIGINS` con la URL completa del frontend:
   ```
   CORS_ORIGINS=https://legacyapp-frontend.onrender.com
   ```
3. Guarda los cambios (Render reiniciará automáticamente)

---

## 📝 Notas Importantes

### Backend
- Render usa el puerto `10000` por defecto para servicios gratuitos
- El backend debe escuchar en `process.env.PORT` (ya está configurado ✅)
- MongoDB Atlas ya está configurado ✅

### Frontend
- Next.js necesita `npm run build` antes de `npm start`
- La variable `NEXT_PUBLIC_API_URL` debe apuntar al backend desplegado

### Variables Sensibles
- **NO** subas el archivo `.env` a GitHub
- Configura todas las variables en Render Dashboard
- El archivo `.env` está en `.gitignore` ✅

---

## ✅ Checklist de Deploy

- [ ] Backend creado en Render
- [ ] Variables de entorno del backend configuradas
- [ ] Frontend creado en Render
- [ ] Variables de entorno del frontend configuradas
- [ ] CORS actualizado con la URL del frontend
- [ ] Ambos servicios desplegados correctamente
- [ ] Probar login en la aplicación desplegada

---

## 🔍 Verificar el Deploy

1. **Backend:** Visita `https://legacyapp-backend.onrender.com/api/health`
   - Deberías ver: `{"message":"API funcionando correctamente","status":"OK"}`

2. **Frontend:** Visita `https://legacyapp-frontend.onrender.com`
   - Deberías ver la pantalla de login

3. **Probar Login:**
   - Usuario: `admin`
   - Contraseña: `admin`

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to MongoDB"
- Verifica que `MONGODB_URI` esté correcta en Render
- Verifica que tu IP esté en la whitelist de MongoDB Atlas (o usa `0.0.0.0/0`)

### Error: "CORS error"
- Verifica que `CORS_ORIGINS` tenga la URL correcta del frontend
- Asegúrate de incluir `https://` en la URL

### Error: "Build failed"
- Verifica que todos los archivos estén en el repositorio
- Revisa los logs de build en Render

---

## 🎉 ¡Listo!

Una vez completados estos pasos, tu aplicación estará desplegada en Render y accesible desde cualquier lugar.
