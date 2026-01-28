# 🚀 Inicio Rápido - Configuración de Base de Datos

## Pasos Rápidos para Configurar MongoDB

### 1️⃣ Elige tu opción de MongoDB

**Opción A: MongoDB Atlas (Recomendado - 5 minutos)**
- Ve a [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas/register)
- Crea cuenta gratuita
- Crea un cluster gratuito
- Obtén tu cadena de conexión

**Opción B: MongoDB Local**
- Instala MongoDB desde [mongodb.com/download](https://www.mongodb.com/try/download/community)
- MongoDB se iniciará automáticamente como servicio

### 2️⃣ Configura el archivo .env

Edita `backend/.env` y actualiza:

```env
# Para MongoDB Atlas (reemplaza con tu cadena de conexión):
MONGODB_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority

# Para MongoDB Local (ya está configurado):
# MONGODB_URI=mongodb://localhost:27017/taskmanager

# IMPORTANTE: Cambia este JWT_SECRET por uno seguro (mínimo 32 caracteres)
JWT_SECRET=tu_secret_key_super_segura_minimo_32_caracteres_aqui_123456789
```

### 3️⃣ Prueba la conexión

```powershell
cd backend
npm run test:db
```

Deberías ver: `✅ Conexión exitosa a MongoDB!`

### 4️⃣ Crea datos iniciales (opcional)

```powershell
npm run seed
```

Esto creará usuarios de ejemplo:
- `admin` / `admin`
- `user1` / `user1`
- `user2` / `user2`

### 5️⃣ Inicia el servidor

```powershell
npm run dev
```

Deberías ver:
```
MongoDB Connected: ...
Servidor corriendo en puerto 5000
```

### 6️⃣ Prueba la API

Abre en tu navegador: http://localhost:5000/api/health

---

## 📚 Documentación Completa

Para instrucciones detalladas, consulta: **GUIA_BASE_DE_DATOS.md**

## 🔧 Comandos Útiles

- `npm run test:db` - Probar conexión a MongoDB
- `npm run seed` - Crear datos iniciales
- `npm run dev` - Iniciar servidor en modo desarrollo
- `npm start` - Iniciar servidor en producción

## ❓ Problemas Comunes

**Error de conexión:**
- Verifica que `MONGODB_URI` esté correcta en `.env`
- Si usas Atlas, verifica que tu IP esté en la whitelist
- Si usas local, verifica que MongoDB esté corriendo

**El servidor no inicia:**
- Verifica que el puerto 5000 no esté en uso
- Ejecuta `npm install` para instalar dependencias
