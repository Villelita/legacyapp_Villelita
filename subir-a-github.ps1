# Script para subir tu proyecto al fork en GitHub
# Ejecuta esto en PowerShell o desde la terminal de Cursor/VSCode

Set-Location $PSScriptRoot

Write-Host "=== Subiendo al fork Villelita/legacyapp_Villelita ===" -ForegroundColor Cyan
Write-Host ""

# 1. Subir rama deploy (tu codigo nuevo)
Write-Host "Subiendo rama 'deploy'..." -ForegroundColor Yellow
git push -u mi-fork deploy

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Si fallo por 'unrelated histories', prueba:" -ForegroundColor Yellow
    Write-Host "  git push -u mi-fork deploy --force" -ForegroundColor White
    Write-Host ""
    Write-Host "Si te pide usuario/contraseña:" -ForegroundColor Yellow
    Write-Host "  - Usuario: Villelita" -ForegroundColor White
    Write-Host "  - Password: usa un Personal Access Token de GitHub (no tu contraseña)" -ForegroundColor White
    Write-Host "    GitHub -> Settings -> Developer settings -> Personal access tokens" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "Listo. Revisa: https://github.com/Villelita/legacyapp_Villelita" -ForegroundColor Green
Write-Host "Cambia a la rama 'deploy' en el dropdown para ver el proyecto nuevo." -ForegroundColor Green
