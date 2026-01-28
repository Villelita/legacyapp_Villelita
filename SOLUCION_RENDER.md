# 🔧 Solución: Error de Credenciales en Render

## 🔍 Problema

Estás viendo "Credenciales inválidas" al intentar hacer login en Render.

## ✅ Solución Rápida

### Paso 1: Inicializar la Base de Datos

La base de datos en Render probablemente está vacía. Necesitas ejecutar el script de seed.

**Opción A: Usando el endpoint de seed (Recomendado)**

1. Ve a tu backend en Render y copia la URL (ej: `https://legacyapp-backend.onrender.com`)
2. Abre Postman, Insomnia, o simplemente tu navegador y haz una petición POST a:
   ```
   https://tu-backend.onrender.com/api/seed/init
   ```
   
   **Desde PowerShell:**
   ```powershell
   Invoke-WebRequest -Uri "https://tu-backend.onrender.com/api/seed/init" -Method POST
   ```
   
   **Desde el navegador (usando una extensión como REST Client):**
   - Método: POST
   - URL: `https://tu-backend.onrender.com/api/seed/init`

3. Deberías recibir una respuesta como:
   ```json
   {
     "success": true,
     "message": "Datos iniciales creados exitosamente",
     "data": {
       "users": 5,
       "projects": 5,
       "tasks": 2
     }
   }
   ```

**Opción B: Ejecutar seed manualmente desde Render**

1. Ve a tu servicio backend en Render Dashboard
2. Ve a la sección **"Shell"** o **"Logs"**
3. Ejecuta:
   ```bash
   cd backend
   node scripts/seedData.js
   ```

### Paso 2: Verificar que Funcionó

1. Intenta hacer login nuevamente con:
   - Usuario: `admin`
   - Contraseña: `admin`

2. Si aún no funciona, verifica los logs del backend en Render para ver qué está pasando.

---

## 🔍 Verificación de Problemas Comunes

### 1. Verificar Conexión a MongoDB

Ve a los logs de tu backend en Render y busca:
```
MongoDB Connected: ...
```

Si ves un error de conexión, verifica:
- ✅ Variable `MONGODB_URI` está configurada correctamente
- ✅ La IP de Render está en la whitelist de MongoDB Atlas (o usa `0.0.0.0/0`)

### 2. Verificar Variables de Entorno

En Render Dashboard, verifica que estas variables estén configuradas:

**Backend:**
```
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=tu_secret_key_super_segura_minimo_32_caracteres_123456789
CORS_ORIGINS=https://tu-frontend.onrender.com
PORT=10000
```

**Frontend:**
```
NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com/api
```

### 3. Verificar que los Usuarios se Crearon

Puedes verificar consultando directamente la base de datos en MongoDB Atlas:
1. Ve a MongoDB Atlas
2. Usa Compass o el shell
3. Conecta a tu cluster
4. Ve a la base de datos `taskmanager`
5. Verifica que la colección `users` tenga documentos

---

## 🛠️ Solución Alternativa: Crear Usuario Manualmente

Si el seed no funciona, puedes crear un usuario manualmente usando el endpoint de registro:

**POST** a `https://tu-backend.onrender.com/api/auth/register`

Body (JSON):
```json
{
  "username": "admin",
  "password": "admin"
}
```

Luego intenta hacer login con esas credenciales.

---

## 📋 Checklist de Verificación

- [ ] Backend está corriendo en Render
- [ ] MongoDB está conectado (ver logs)
- [ ] Variables de entorno configuradas correctamente
- [ ] Endpoint `/api/seed/init` ejecutado exitosamente
- [ ] Usuarios creados en la base de datos
- [ ] CORS configurado con la URL correcta del frontend
- [ ] Frontend apunta a la URL correcta del backend

---

## 🐛 Si Aún No Funciona

1. **Revisa los logs del backend en Render:**
   - Ve a tu servicio backend
   - Haz clic en "Logs"
   - Busca errores relacionados con MongoDB o autenticación

2. **Prueba el endpoint de health:**
   ```
   GET https://tu-backend.onrender.com/api/health
   ```
   Deberías ver: `{"message":"API funcionando correctamente","status":"OK"}`

3. **Verifica la conexión desde el frontend:**
   - Abre la consola del navegador (F12)
   - Ve a la pestaña "Network"
   - Intenta hacer login y revisa la petición
   - Verifica que la URL sea correcta y que no haya errores CORS

4. **Prueba crear un usuario nuevo:**
   - Usa el endpoint `/api/auth/register`
   - Luego intenta hacer login con ese usuario

---

## ✅ Después de Solucionar

Una vez que funcione:
1. **Protege el endpoint de seed** (agrega autenticación o elimínalo)
2. **Verifica que todos los usuarios funcionen:**
   - admin / admin
   - user1 / user1
   - user2 / user2

---

¡Con estos pasos deberías poder solucionar el problema! 🚀
