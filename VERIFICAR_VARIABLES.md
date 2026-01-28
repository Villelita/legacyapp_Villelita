# 🔍 Verificar Variables de Entorno en Render

## Problema: "MONGODB_URI no está configurada"

Si recibes este error, significa que la variable de entorno no está siendo leída correctamente por Next.js.

## ✅ Pasos para Solucionar

### Paso 1: Verificar en Render Dashboard

1. Ve a tu servicio en Render: `legacyapp-villelita`
2. Haz clic en **"Environment"** en el menú lateral
3. Verifica que la variable `MONGODB_URI` esté presente:
   - **KEY:** `MONGODB_URI`
   - **VALUE:** `mongodb+srv://Villela:4xmBvjLpkn1o7Tdz@cluster.o72gocw.mongodb.net/taskmanager?retryWrites=true&w=majority`

### Paso 2: Verificar que Esté Guardada Correctamente

1. Si la variable **NO existe**, agrégala:
   - Haz clic en **"Add Environment Variable"** o **"Edit"**
   - KEY: `MONGODB_URI`
   - VALUE: Tu cadena de conexión completa
   - Haz clic en **"Save"**

2. Si la variable **YA existe**, verifica:
   - Que el nombre sea exactamente `MONGODB_URI` (sin espacios, mayúsculas correctas)
   - Que el valor sea correcto (debe incluir `/taskmanager` antes del `?`)

### Paso 3: Forzar Rebuild

Después de agregar o modificar la variable:

1. Haz clic en **"Save, rebuild, and deploy"** (si aparece el botón)
2. O ve a **"Manual Deploy"** → **"Deploy latest commit"**
3. Espera a que termine el build y deploy

### Paso 4: Verificar en los Logs

1. Ve a la sección **"Logs"** de tu servicio
2. Busca mensajes relacionados con MongoDB
3. Si ves errores de conexión, verifica que:
   - La URI sea correcta
   - MongoDB Atlas permita conexiones desde Render (whitelist IP)

---

## 🔧 Solución Alternativa: Verificar Variables Disponibles

Si quieres ver qué variables están disponibles, puedes crear un endpoint temporal de debug:

**Crear:** `app/api/debug-env/route.ts`

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  const mongoVars = Object.keys(process.env)
    .filter(key => key.includes('MONGO') || key.includes('DATABASE'))
    .reduce((obj, key) => {
      obj[key] = process.env[key] ? '***CONFIGURADA***' : 'NO CONFIGURADA';
      return obj;
    }, {} as Record<string, string>);

  return NextResponse.json({
    message: 'Variables de entorno relacionadas con MongoDB',
    variables: mongoVars,
    todasLasVariables: Object.keys(process.env).length
  });
}
```

Luego visita: `https://legacyapp-villelita.onrender.com/api/debug-env`

---

## ⚠️ Problemas Comunes

### 1. Variable no se guardó
- **Solución:** Asegúrate de hacer clic en "Save" después de agregar la variable
- Verifica que aparezca en la lista de variables

### 2. Render no reinició
- **Solución:** Haz un deploy manual después de agregar la variable
- Ve a "Manual Deploy" → "Deploy latest commit"

### 3. Nombre incorrecto
- **Solución:** El nombre debe ser exactamente `MONGODB_URI` (sin espacios, mayúsculas exactas)

### 4. Valor incorrecto
- **Solución:** Verifica que la URI incluya:
  - Usuario y contraseña correctos
  - `/taskmanager` antes del `?`
  - Parámetros de conexión: `?retryWrites=true&w=majority`

---

## ✅ Checklist

- [ ] Variable `MONGODB_URI` existe en Render Dashboard
- [ ] El nombre es exactamente `MONGODB_URI` (sin espacios)
- [ ] El valor incluye `/taskmanager` antes del `?`
- [ ] Hiciste clic en "Save" después de agregar/modificar
- [ ] Render hizo rebuild después de guardar
- [ ] Los logs no muestran errores de conexión a MongoDB

---

## 🚀 Después de Configurar Correctamente

Una vez que la variable esté configurada:

1. Ejecuta el endpoint de seed:
   ```
   POST https://legacyapp-villelita.onrender.com/api/seed
   ```

2. Deberías recibir:
   ```json
   {
     "success": true,
     "message": "Datos iniciales creados exitosamente",
     "data": {
       "users": 5,
       "projects": 5
     }
   }
   ```

3. Prueba el login con `admin` / `admin`

---

¡Con estos pasos deberías poder solucionar el problema! 🎉
