# 🔐 Configurar Autenticación en Render

## ✅ Cambios Realizados

He creado las API routes de Next.js para autenticación:
- `/api/auth/login` - Para iniciar sesión
- `/api/auth/register` - Para registrar usuarios
- `/api/auth/me` - Para obtener usuario actual

El frontend ahora usa rutas relativas (`/api`) en lugar de `http://localhost:5000/api`.

## 🔧 Configuración en Render

### Paso 1: Agregar Variable JWT_SECRET

1. Ve a Render Dashboard → Tu servicio `legacyapp-villelita`
2. Ve a **"Environment"** o **"Environment Variables"**
3. Agrega una nueva variable:
   - **KEY:** `JWT_SECRET`
   - **VALUE:** `legacyapp_jwt_secret_key_super_segura_2026_minimo_32_caracteres_123456789`
   - (O usa cualquier string seguro de al menos 32 caracteres)

4. Haz clic en **"Save"** o **"Save, rebuild, and deploy"**

### Paso 2: Verificar Variables Existentes

Asegúrate de que estas variables estén configuradas:

- ✅ `MONGODB_URI` - Tu cadena de conexión de MongoDB Atlas
- ✅ `JWT_SECRET` - Clave secreta para firmar tokens (agregar ahora)

### Paso 3: Esperar el Rebuild

Render reiniciará automáticamente después de guardar las variables.

## 🧪 Probar la Autenticación

### 1. Probar Login desde Postman

**POST** `https://legacyapp-villelita.onrender.com/api/auth/login`

Body (JSON):
```json
{
  "username": "admin",
  "password": "admin"
}
```

Deberías recibir:
```json
{
  "_id": "...",
  "username": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Probar Login desde la Página

1. Ve a `https://legacyapp-villelita.onrender.com`
2. Intenta hacer login con:
   - Usuario: `admin`
   - Contraseña: `admin`

Debería funcionar correctamente ahora.

## 📋 Resumen de Endpoints Disponibles

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar nuevo usuario
- `GET /api/auth/me` - Obtener usuario actual (requiere token)
- `POST /api/seed` - Inicializar base de datos

## ⚠️ Notas Importantes

1. **JWT_SECRET:** Debe ser una cadena segura de al menos 32 caracteres
2. **MONGODB_URI:** Ya debería estar configurada
3. **Rutas relativas:** El frontend ahora usa `/api` en lugar de URLs absolutas
4. **Seguridad:** En producción, considera usar variables de entorno más seguras

## 🐛 Solución de Problemas

### Error: "Token inválido"
- Verifica que `JWT_SECRET` esté configurada en Render
- Asegúrate de que sea la misma en todas las requests

### Error: "Credenciales inválidas"
- Verifica que los usuarios existan en la base de datos
- Ejecuta `/api/seed` si es necesario

### Error: "MONGODB_URI no está configurada"
- Verifica que la variable esté en Render Dashboard
- Asegúrate de que el nombre sea exactamente `MONGODB_URI`

---

¡Con estos cambios, la autenticación debería funcionar correctamente! 🎉
