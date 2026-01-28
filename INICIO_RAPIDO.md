# 🚀 Inicio Rápido - Frontend y Backend

## Pasos para Iniciar la Aplicación

### 1️⃣ Iniciar el Backend (Terminal 1)

Abre una terminal PowerShell y ejecuta:

```powershell
cd backend
npm run dev
```

Deberías ver:
```
MongoDB Connected: ...
Servidor corriendo en puerto 5000
```

✅ El backend estará disponible en: `http://localhost:5000`

---

### 2️⃣ Iniciar el Frontend (Terminal 2)

Abre **otra** terminal PowerShell y ejecuta:

```powershell
npm run dev
```

Deberías ver:
```
  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
```

✅ El frontend estará disponible en: `http://localhost:3000`

---

### 3️⃣ Probar la Aplicación

1. Abre tu navegador en: `http://localhost:3000`
2. Verás la pantalla de login
3. Usa las credenciales:
   - **Usuario:** `admin`
   - **Contraseña:** `admin`

---

## 📋 Comandos Útiles

### Backend
```powershell
cd backend
npm run dev      # Iniciar en modo desarrollo
npm start        # Iniciar en modo producción
npm run test:db  # Probar conexión a MongoDB
npm run seed     # Crear datos iniciales
```

### Frontend
```powershell
npm run dev      # Iniciar en modo desarrollo
npm run build    # Compilar para producción
npm start        # Iniciar en modo producción
npm run lint     # Verificar código
```

---

## ⚠️ Importante

- **Ambos servidores deben estar corriendo al mismo tiempo**
- El backend debe iniciarse primero (para que MongoDB esté conectado)
- Si cambias algo en el backend, se recarga automáticamente
- Si cambias algo en el frontend, Next.js se recarga automáticamente

---

## 🔧 Solución de Problemas

### Error: "Cannot connect to API"
- Verifica que el backend esté corriendo en el puerto 5000
- Verifica que `.env.local` tenga: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

### Error: "MongoDB connection failed"
- Verifica que MongoDB Atlas esté configurado correctamente en `backend/.env`
- Ejecuta: `cd backend && npm run test:db`

### Puerto 3000 o 5000 ya en uso
- Cierra otras aplicaciones que usen esos puertos
- O cambia los puertos en los archivos de configuración

---

## ✅ Checklist de Inicio

- [ ] Backend corriendo en puerto 5000
- [ ] Frontend corriendo en puerto 3000
- [ ] MongoDB conectado correctamente
- [ ] Puedes hacer login con `admin` / `admin`

¡Listo para desarrollar! 🎉
