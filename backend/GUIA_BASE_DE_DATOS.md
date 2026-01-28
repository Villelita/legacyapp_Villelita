# Guía de Configuración de Base de Datos MongoDB

Esta guía te ayudará a configurar MongoDB para tu aplicación Legacy App.

## 📋 Opciones de MongoDB

Tienes dos opciones para usar MongoDB:

### Opción 1: MongoDB Atlas (Recomendado - Gratis y en la nube)
- ✅ No requiere instalación local
- ✅ Accesible desde cualquier lugar
- ✅ Plan gratuito disponible (512MB)
- ✅ Fácil de configurar

### Opción 2: MongoDB Local
- Requiere instalar MongoDB en tu computadora
- Más control sobre los datos
- Requiere más configuración

---

## 🚀 Opción 1: MongoDB Atlas (Recomendado)

### Paso 1: Crear cuenta en MongoDB Atlas

1. Ve a [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Crea una cuenta gratuita (si no tienes una)
3. Completa el registro

### Paso 2: Crear un Cluster

1. Una vez dentro de Atlas, haz clic en **"Build a Database"**
2. Selecciona el plan **FREE (M0)** - es completamente gratuito
3. Elige una región cercana a ti (por ejemplo: `us-east-1` para Estados Unidos)
4. Deja el nombre del cluster como está (ej: `Cluster0`)
5. Haz clic en **"Create"** y espera 3-5 minutos mientras se crea el cluster

### Paso 3: Configurar Acceso a la Base de Datos

#### 3.1 Crear Usuario de Base de Datos

1. En el panel de Atlas, ve a **"Database Access"** (en el menú lateral izquierdo)
2. Haz clic en **"Add New Database User"**
3. Selecciona **"Password"** como método de autenticación
4. Ingresa un **username** (ej: `legacyapp_user`)
5. Genera una contraseña segura o crea una propia
6. **IMPORTANTE**: Guarda esta contraseña, la necesitarás después
7. En "Database User Privileges", selecciona **"Atlas admin"** o **"Read and write to any database"**
8. Haz clic en **"Add User"**

#### 3.2 Configurar Acceso de Red (Whitelist)

1. Ve a **"Network Access"** (en el menú lateral izquierdo)
2. Haz clic en **"Add IP Address"**
3. Para desarrollo local, haz clic en **"Add Current IP Address"**
4. O puedes usar **"Allow Access from Anywhere"** (0.0.0.0/0) - solo para desarrollo
5. Haz clic en **"Confirm"**

### Paso 4: Obtener la Cadena de Conexión

1. Ve a **"Database"** (en el menú lateral izquierdo)
2. Haz clic en **"Connect"** en tu cluster
3. Selecciona **"Connect your application"**
4. Copia la cadena de conexión que aparece (algo como):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Reemplaza `<username>` con tu usuario de base de datos
6. Reemplaza `<password>` con tu contraseña de base de datos
7. Al final, antes del `?`, agrega el nombre de tu base de datos: `/taskmanager`
   
   Ejemplo final:
   ```
   mongodb+srv://legacyapp_user:miPassword123@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority
   ```

### Paso 5: Configurar el archivo .env

1. Abre el archivo `backend/.env`
2. Reemplaza la línea `MONGODB_URI` con tu cadena de conexión de Atlas:

```env
MONGODB_URI=mongodb+srv://tu_usuario:tu_password@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority
```

3. Asegúrate de que `JWT_SECRET` tenga al menos 32 caracteres (cambia el valor por uno seguro):

```env
JWT_SECRET=tu_secret_key_super_segura_minimo_32_caracteres_aqui_123456789
```

---

## 💻 Opción 2: MongoDB Local

### Paso 1: Instalar MongoDB

#### Windows:
1. Descarga MongoDB Community Server desde: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Ejecuta el instalador
3. Durante la instalación:
   - Selecciona "Complete" installation
   - Marca "Install MongoDB as a Service"
   - Deja la configuración por defecto
4. MongoDB se instalará y se iniciará automáticamente como servicio

#### Verificar instalación:
Abre PowerShell y ejecuta:
```powershell
mongod --version
```

### Paso 2: Verificar que MongoDB está corriendo

1. MongoDB debería estar corriendo automáticamente como servicio
2. Puedes verificar abriendo el "Services" de Windows y buscando "MongoDB"

### Paso 3: Configurar el archivo .env

El archivo `.env` ya está configurado para MongoDB local:
```env
MONGODB_URI=mongodb://localhost:27017/taskmanager
```

Si MongoDB está corriendo en un puerto diferente, ajusta el puerto en la URI.

---

## 🗄️ Estructura de la Base de Datos

Tu aplicación usa las siguientes colecciones (tablas):

### 1. **users** - Usuarios del sistema
- `username`: Nombre de usuario (único)
- `password`: Contraseña (hasheada)
- `createdAt`, `updatedAt`: Fechas automáticas

### 2. **tasks** - Tareas
- `title`: Título de la tarea
- `description`: Descripción
- `status`: Estado (Pendiente, En Progreso, Completada, Bloqueada, Cancelada)
- `priority`: Prioridad (Baja, Media, Alta, Crítica)
- `projectId`: Referencia al proyecto
- `assignedTo`: Usuario asignado
- `dueDate`: Fecha límite
- `estimatedHours`: Horas estimadas
- `actualHours`: Horas reales
- `createdBy`: Usuario que creó la tarea

### 3. **projects** - Proyectos
- `name`: Nombre del proyecto
- `description`: Descripción

### 4. **comments** - Comentarios en tareas
- `taskId`: Referencia a la tarea
- `userId`: Usuario que comentó
- `commentText`: Texto del comentario

### 5. **histories** - Historial de cambios
- `taskId`: Referencia a la tarea
- `userId`: Usuario que hizo el cambio
- `action`: Acción realizada
- `oldValue`: Valor anterior
- `newValue`: Valor nuevo

### 6. **notifications** - Notificaciones
- `userId`: Usuario destinatario
- `message`: Mensaje
- `type`: Tipo de notificación
- `read`: Si fue leída o no

---

## 🌱 Poblar la Base de Datos con Datos Iniciales

Una vez que MongoDB esté configurado, puedes crear usuarios y proyectos de ejemplo:

### Paso 1: Navegar a la carpeta backend

```powershell
cd backend
```

### Paso 2: Ejecutar el script de seed

```powershell
node scripts/seedData.js
```

Esto creará:
- **Usuarios de ejemplo:**
  - `admin` / `admin`
  - `user1` / `user1`
  - `user2` / `user2`

- **Proyectos de ejemplo:**
  - Proyecto Demo
  - Proyecto Alpha
  - Proyecto Beta

⚠️ **IMPORTANTE**: Cambia estas contraseñas después en producción.

---

## ✅ Verificar que Todo Funciona

### Paso 1: Iniciar el servidor backend

```powershell
cd backend
npm run dev
```

Deberías ver un mensaje como:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
Servidor corriendo en puerto 5000
```

### Paso 2: Probar la conexión

Abre tu navegador y ve a:
```
http://localhost:5000/api/health
```

Deberías ver:
```json
{
  "message": "API funcionando correctamente",
  "status": "OK"
}
```

### Paso 3: Probar el login

Usa las credenciales de ejemplo:
- Usuario: `admin`
- Contraseña: `admin`

---

## 🔧 Solución de Problemas

### Error: "MongoServerError: Authentication failed"
- Verifica que el usuario y contraseña en `MONGODB_URI` sean correctos
- Asegúrate de que el usuario tenga permisos en Atlas

### Error: "MongooseServerSelectionError"
- Verifica que tu IP esté en la whitelist de Atlas
- Verifica que MongoDB local esté corriendo (si usas local)

### Error: "Cannot connect to MongoDB"
- Verifica que la cadena de conexión en `.env` sea correcta
- Asegúrate de que no haya espacios extra en `MONGODB_URI`
- Verifica que el archivo `.env` esté en la carpeta `backend/`

### El servidor no inicia
- Verifica que el puerto 5000 no esté en uso
- Asegúrate de tener todas las dependencias instaladas: `npm install`

---

## 📝 Resumen de Archivos Importantes

- `backend/.env` - Configuración de la base de datos y variables de entorno
- `backend/config/database.js` - Configuración de conexión a MongoDB
- `backend/models/` - Modelos de datos (User, Task, Project, etc.)
- `backend/scripts/seedData.js` - Script para crear datos iniciales

---

## 🎉 ¡Listo!

Una vez completados estos pasos, tu base de datos estará configurada y lista para usar. Puedes empezar a crear usuarios, proyectos y tareas desde tu aplicación.
