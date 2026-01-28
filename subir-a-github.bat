@echo off
cd /d "%~dp0"
echo === Subiendo al fork Villelita/legacyapp_Villelita ===
echo.
git push -u mi-fork deploy
if errorlevel 1 (
    echo.
    echo Si fallo, prueba: git push -u mi-fork deploy --force
    echo Si pide usuario: Villelita
    echo Si pide password: usa un Personal Access Token de GitHub
    pause
    exit /b 1
)
echo.
echo Listo. Abre: https://github.com/Villelita/legacyapp_Villelita
echo Cambia a la rama "deploy" para ver el proyecto nuevo.
pause
