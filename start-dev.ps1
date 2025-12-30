# Script para copiar Prisma y evitar symlinks en Windows
Write-Host "Preparando entorno para desarrollo..."

# Limpiar cache de Next.js
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
}

# Copiar Prisma client manualmente
$prismaSource = "node_modules\@prisma\client"
$prismaEnginesSource = "node_modules\@prisma\engines"

if (Test-Path $prismaSource) {
    Write-Host "✓ Prisma Client encontrado"
} else {
    Write-Host "✗ Error: No se encontró Prisma Client. Ejecuta 'npm install' primero."
    exit 1
}

Write-Host "Iniciando servidor Next.js..."
npm run dev
