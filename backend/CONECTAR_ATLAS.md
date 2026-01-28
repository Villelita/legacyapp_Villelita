# 🔌 Cómo Conectar MongoDB Atlas a tu Aplicación

## ⚠️ Diferencia Importante

- **Compass**: Es una herramienta GUI para ver/editar datos manualmente (ya lo hiciste ✅)
- **Drivers**: Es lo que necesitas para conectar tu **aplicación Node.js** al cluster (esto es lo que falta)

## 📋 Pasos para Obtener la Cadena de Conexión

### Paso 1: En la pantalla de MongoDB Atlas

En la pantalla que estás viendo ("Connect to Cluster"), haz clic en:

**"Drivers"** (debajo de "Connect to your application")

### Paso 2: Seleccionar Node.js

1. Selecciona **"Node.js"** como driver
2. Selecciona la versión más reciente (probablemente 5.5 o superior)
3. Haz clic en **"Copy"** para copiar la cadena de conexión

La cadena se verá algo así:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Paso 3: Personalizar la Cadena de Conexión

**IMPORTANTE**: Necesitas hacer 3 cambios:

1. **Reemplaza `<username>`** con tu usuario de MongoDB Atlas
2. **Reemplaza `<password>`** con tu contraseña de MongoDB Atlas
3. **Agrega `/taskmanager`** antes del `?` para especificar el nombre de la base de datos

**Ejemplo:**

Si tu cadena original es:
```
mongodb+srv://miUsuario:miPassword123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

La cadena final debe ser:
```
mongodb+srv://miUsuario:miPassword123@cluster0.abc123.mongodb.net/taskmanager?retryWrites=true&w=majority
```

Nota el `/taskmanager` agregado antes del `?`.

### Paso 4: Actualizar el archivo .env

1. Abre el archivo `backend/.env`
2. Encuentra la línea `MONGODB_URI=`
3. Reemplaza el valor con tu cadena de conexión personalizada

```env
MONGODB_URI=mongodb+srv://tu_usuario:tu_password@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority
```

### Paso 5: Verificar la Conexión

Abre PowerShell en la carpeta `backend` y ejecuta:

```powershell
npm run test:db
```

Deberías ver:
```
✅ Conexión exitosa a MongoDB!
```

## 🎯 Resumen Visual

```
Atlas → Connect → Drivers → Node.js → Copiar cadena
  ↓
Reemplazar <username> y <password>
  ↓
Agregar /taskmanager antes del ?
  ↓
Pegar en backend/.env como MONGODB_URI
  ↓
Ejecutar: npm run test:db
```

## ❓ Preguntas Frecuentes

**P: ¿Por qué necesito hacer esto si ya conecté con Compass?**
R: Compass es solo para ver datos manualmente. Tu aplicación Node.js necesita la cadena de conexión para conectarse automáticamente.

**P: ¿Dónde encuentro mi usuario y contraseña?**
R: Son los mismos que creaste cuando configuraste el "Database Access" en Atlas. Si no los recuerdas, ve a "Database Access" en Atlas y crea un nuevo usuario.

**P: ¿Qué pasa si olvido agregar `/taskmanager`?**
R: MongoDB creará una base de datos por defecto, pero es mejor especificarla explícitamente.

## ✅ Una vez conectado

Después de verificar la conexión, puedes:

1. Crear datos iniciales: `npm run seed`
2. Iniciar el servidor: `npm run dev`
3. Probar el login con: `admin` / `admin`
