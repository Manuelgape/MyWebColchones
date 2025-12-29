# Tu Mejor Sueño - Tienda de Colchones

Ecommerce de colchones con entrega propia en Salamanca y Zamora. Pago 100% online con Redsys.

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19)
- **Database:** Prisma + SQLite (local) / PostgreSQL (production)
- **Payment:** Redsys (redirect integration)
- **Styling:** Tailwind CSS 4
- **Typography:** Fraunces + Manrope (Google Fonts)
- **Hosting:** Vercel

## Características

- ✅ Catálogo de productos con imágenes
- ✅ Carrito de compras (localStorage)
- ✅ Validación de código postal (Salamanca y Zamora únicamente)
- ✅ Formulario de checkout
- ✅ Integración Redsys (crear pedido + notificación server-to-server)
- ✅ Páginas de confirmación (OK/KO)
- ✅ Diseño responsive mobile-first
- ✅ Base de datos con auditoría de eventos

## Desarrollo Local

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/Manuelgape/MyWebColchones.git
cd mywebcolchones
npm install
```

### 2. Configurar variables de entorno

Crea `.env.local`:

```bash
# Database (SQLite local)
DATABASE_URL="file:./prisma/dev.db"

# Redsys TEST credentials
REDSYS_MERCHANT_CODE="999008881"
REDSYS_TERMINAL="1"
REDSYS_SECRET_KEY="sq7HjrUOBfKmC576ILgskD5srU870gJ7sqAqu5SsQe8="
REDSYS_CURRENCY="978"
REDSYS_TRANSACTION_TYPE="0"
REDSYS_ENVIRONMENT="testing"
REDSYS_MERCHANT_NAME="Tu Mejor Sueño"

# App
APP_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 3. Crear base de datos

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Ejecutar servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Deploy en Vercel

### Paso 1: Conectar GitHub a Vercel

1. Ve a [https://vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Importa tu repo `MyWebColchones`
4. Click "Deploy"

### Paso 2: Configurar Vercel Postgres

1. En Vercel → tu proyecto → Storage → Create Database → Postgres
2. Copia `POSTGRES_PRISMA_URL` y `POSTGRES_URL_NON_POOLING`
3. Vercel las añade automáticamente como `DATABASE_URL` y `DATABASE_URL_UNPOOLED`

### Paso 3: Variables de entorno en Vercel

Settings → Environment Variables → añade:

```
REDSYS_MERCHANT_CODE=tu_fuc_real
REDSYS_TERMINAL=1
REDSYS_SECRET_KEY=tu_clave_base64_real
REDSYS_CURRENCY=978
REDSYS_TRANSACTION_TYPE=0
REDSYS_ENVIRONMENT=production
REDSYS_MERCHANT_NAME="Tu Mejor Sueño"
APP_BASE_URL=https://tumejorsueno.com
```

### Paso 4: Ejecutar migración en producción

```bash
# Desde tu terminal local con DATABASE_URL de producción
npx prisma migrate deploy
```

O usa el script de Vercel: Settings → General → Build & Development Settings → Build Command:
```
prisma migrate deploy && next build
```

### Paso 5: Configurar dominio

1. Vercel → Settings → Domains
2. Agrega `tumejorsueno.com` (o `xn--tumejorsueo-w4a.com` si tiene ñ)
3. Apunta DNS en Raiolanetworks a los nameservers de Vercel

### Paso 6: Configurar URLs en Redsys TPV

En el panel de administración de Redsys:

- **URL de Notificación (POST):** `https://tumejorsueno.com/api/redsys/notify`
- **URL OK:** `https://tumejorsueno.com/checkout/ok`
- **URL KO:** `https://tumejorsueno.com/checkout/ko`

## Pruebas en modo TEST

Con las credenciales de prueba de Redsys, usa estas tarjetas:

- **Éxito:** `4548812049400004`
- **Fallo:** Cualquier otra

**CVV:** 123  
**Caducidad:** Cualquier fecha futura  
**CIP:** 123456

## Estructura del Proyecto

```
mywebcolchones/
├── app/
│   ├── api/redsys/
│   │   ├── create/route.ts    # Crea pedido y genera firma Redsys
│   │   └── notify/route.ts    # Recibe notificación de Redsys
│   ├── carrito/page.tsx       # Carrito y checkout
│   ├── checkout/
│   │   ├── ok/page.tsx        # Pago exitoso
│   │   └── ko/page.tsx        # Pago fallido
│   ├── catalogo/page.tsx
│   ├── producto/[slug]/page.tsx
│   └── ...
├── components/                # Componentes reutilizables
├── lib/
│   ├── prisma.ts             # Cliente Prisma
│   ├── redsys-utils.ts       # Utilidades Redsys (firma, validación)
│   ├── postal-codes.ts       # Validación CP
│   └── format.ts
├── prisma/
│   ├── schema.prisma         # Modelo de datos
│   └── migrations/
├── data/
│   ├── products.ts           # Catálogo de productos
│   └── postal_codes.json     # Códigos postales permitidos
└── public/                   # Assets estáticos
```

## Modelo de Datos (Prisma)

- **Order:** Pedidos con estado (PENDING/PAID/FAILED/CANCELLED/EXPIRED)
- **OrderItem:** Líneas de pedido
- **Payment:** Registros de pago Redsys con idempotencia
- **AuditLog:** Log de eventos para debugging

## Checklist Pre-Producción

- [ ] Credenciales Redsys reales configuradas
- [ ] URLs Redsys (notify/OK/KO) apuntando a producción
- [ ] Dominio configurado con SSL
- [ ] Migración Prisma ejecutada en producción
- [ ] Variables de entorno en Vercel verificadas
- [ ] Pago de prueba exitoso en modo TEST
- [ ] Email de confirmación configurado (pendiente)

## Soporte

**Email:** hola@tumejorsueno.com  
**Horario:** Lunes a viernes, 9:00 a 18:00

## Licencia

Propietario: Tu Mejor Sueño © 2025
