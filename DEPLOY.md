# 🚀 Guía de Deploy a Vercel

## ✅ Pre-requisitos

- [x] Código funcionando en local
- [x] Repositorio Git sincronizado con GitHub
- [ ] Credenciales de Redsys de producción
- [ ] Cuenta en Vercel

---

## 📦 Paso 1: Subir cambios a GitHub

```bash
git push origin main
```

---

## 🌐 Paso 2: Deploy en Vercel

### Opción A: Desde Vercel Dashboard (Recomendado)

1. Ve a [https://vercel.com](https://vercel.com)
2. Inicia sesión con tu cuenta de GitHub
3. Click en **"Add New..."** → **"Project"**
4. Busca y selecciona el repositorio **`MyWebColchones`**
5. Configura el proyecto:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (dejar por defecto)
   - **Build Command**: `npm run build` (dejar por defecto)
   - **Output Directory**: `.next` (dejar por defecto)
6. Click en **"Deploy"**

### Opción B: Desde la CLI de Vercel

```bash
npm i -g vercel
vercel login
vercel
```

---

## 🗄️ Paso 3: Configurar Base de Datos (Vercel Postgres)

1. En el dashboard de Vercel → Tu proyecto
2. Ve a la pestaña **"Storage"**
3. Click en **"Create Database"** → **"Postgres"**
4. Sigue el wizard de configuración
5. Vercel automáticamente añade las siguientes variables:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL` (esta se mapea a `DATABASE_URL`)
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

---

## 🔐 Paso 4: Configurar Variables de Entorno

1. Ve a **Settings** → **Environment Variables**
2. Añade las siguientes variables **una por una**:

### Variables obligatorias:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `REDSYS_MERCHANT_CODE` | `tu_fuc_real` | Tu código FUC de Redsys producción |
| `REDSYS_TERMINAL` | `1` | Terminal (normalmente 1) |
| `REDSYS_SECRET_KEY` | `tu_clave_base64_real` | Clave secreta de Redsys en base64 |
| `REDSYS_CURRENCY` | `978` | Código de moneda (978 = EUR) |
| `REDSYS_TRANSACTION_TYPE` | `0` | Tipo de transacción (0 = autorización) |
| `REDSYS_ENVIRONMENT` | `production` | ⚠️ IMPORTANTE: usar "production" |
| `REDSYS_MERCHANT_NAME` | `Tu Mejor Sueño` | Nombre del comercio |
| `APP_BASE_URL` | `https://tu-dominio.vercel.app` | URL de tu aplicación en Vercel |

**⚠️ IMPORTANTE**: 
- Las credenciales de TEST (`999008881`) NO funcionarán en producción
- Debes solicitar las credenciales reales a tu banco/Redsys
- `APP_BASE_URL` debe ser la URL real de Vercel (sin trailing slash)

3. Asegúrate de seleccionar **Production**, **Preview**, y **Development** para cada variable

---

## 🗃️ Paso 5: Ejecutar Migraciones de Prisma

Después del primer deploy, ejecuta las migraciones de base de datos:

### Opción A: Desde Vercel CLI
```bash
vercel env pull .env.production
npx prisma migrate deploy
npx prisma generate
```

### Opción B: Configurar en Build Settings

1. Ve a **Settings** → **General** → **Build & Development Settings**
2. En **Install Command**, añade:
   ```bash
   npm install && npx prisma generate
   ```
3. En **Build Command**, cambia a:
   ```bash
   npx prisma migrate deploy && npm run build
   ```

---

## ✅ Paso 6: Verificar el Deploy

1. Espera a que termine el deploy (2-3 minutos)
2. Vercel te dará una URL: `https://tu-proyecto.vercel.app`
3. Abre la URL en tu navegador
4. Prueba el flujo completo:
   - ✅ Ver catálogo
   - ✅ Añadir productos al carrito
   - ✅ Proceder al checkout
   - ✅ Completar pago (usa una tarjeta de prueba primero)

---

## 🔧 Configuración de Dominio Personalizado (Opcional)

1. Ve a **Settings** → **Domains**
2. Click en **"Add"**
3. Ingresa tu dominio (ej: `tumejorsueno.com`)
4. Sigue las instrucciones para configurar los registros DNS
5. **IMPORTANTE**: Actualiza la variable `APP_BASE_URL` con tu nuevo dominio

---

## 📊 Monitoreo y Logs

- **Logs en tiempo real**: Ve a tu proyecto → **"Deployments"** → Click en el deployment → **"Logs"**
- **Errores**: Vercel → **"Runtime Logs"**
- **Analytics**: Vercel → **"Analytics"**

---

## 🐛 Troubleshooting

### Error: "PrismaClient is unable to run in the browser"
**Solución**: Asegúrate de que las rutas de API tienen `export const runtime = 'nodejs'`

### Error: "Environment variable not found"
**Solución**: Verifica que todas las variables estén en Settings → Environment Variables

### Error 500 en producción
**Solución**: 
1. Ve a Runtime Logs
2. Busca el stack trace completo
3. Verifica que las migraciones de Prisma se ejecutaron correctamente

### El pago no funciona
**Solución**:
1. Verifica que `REDSYS_ENVIRONMENT="production"`
2. Confirma que usas credenciales de producción, no de TEST
3. Verifica que `APP_BASE_URL` sea la URL correcta de Vercel

---

## 🔄 Redeploys Automáticos

Cada vez que hagas `git push` a `main`, Vercel automáticamente:
1. Detecta el cambio
2. Ejecuta el build
3. Despliega la nueva versión
4. Te notifica por email

---

## 📝 Checklist Final

- [ ] Código subido a GitHub
- [ ] Deploy exitoso en Vercel
- [ ] Base de datos PostgreSQL creada
- [ ] Variables de entorno configuradas
- [ ] Migraciones de Prisma ejecutadas
- [ ] Pago de prueba funcionando
- [ ] Dominio personalizado (opcional)
- [ ] SSL habilitado (automático en Vercel)

---

## 📞 Soporte

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Redsys Docs**: Contacta con tu banco

---

¡Listo! Tu tienda de colchones está en producción 🎉
