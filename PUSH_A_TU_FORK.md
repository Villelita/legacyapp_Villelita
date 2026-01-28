# Subir tu proyecto al fork (Villelita/legacyapp_Villelita)

## ¿Qué está hecho?

1. **Remote "mi-fork"** ya apunta a tu fork:
   ```
   https://github.com/Villelita/legacyapp_Villelita.git
   ```

2. **Commit creado** en la rama `deploy` con todo el proyecto (Next.js + backend):
   - Frontend: app/, components/, hooks/, lib/, etc.
   - Backend: backend/ con Express + MongoDB
   - README, DEPLOYMENT.md, configs

## Comando para subir al fork

En la carpeta del proyecto, ejecuta:

```bash
git push -u mi-fork deploy
```

Si tu fork tiene otra historia (por ejemplo, el legacy viejo en `main`) y te pide hacer merge o te rechaza el push, puedes subir tu rama y reemplazar el contenido con:

```bash
git push -u mi-fork deploy --force
```

**Importante:** `--force` sobrescribe la rama `deploy` en tu fork. Úsalo solo si quieres que en el fork quede exactamente tu código nuevo.

## Después del push

1. Entra a: https://github.com/Villelita/legacyapp_Villelita  
2. Verás la rama `deploy` con el proyecto completo.
3. En **Render**: conecta este repo, elige la rama `deploy` y despliega.

## Remotos actuales

- **origin** → repo original (RobertoAguirre/legacyapp) — sin permisos de push
- **mi-fork** → tu fork (Villelita/legacyapp_Villelita) — aquí sí puedes hacer push

Para seguir trayendo cambios del original sin tocar tu trabajo:

```bash
git fetch origin
git merge origin/main   # o la rama que uses
```

Para subir solo a tu fork:

```bash
git push mi-fork deploy
```
