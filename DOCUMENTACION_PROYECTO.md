# Documentación del proyecto Iris 3.0

Este documento describe la estructura, arquitectura y flujos del proyecto **Iris 3.0** de pies a cabeza.

---

## 1. ¿Qué es Iris 3.0?

**Iris** es una aplicación full-stack para gestionar **portales cautivos** (captive portals) de redes WiFi. Permite:

- **Clientes** (empresas) iniciar sesión y administrar sus **organizaciones**, **sitios** (Meraki o Ubiquiti), **APs** (access points) y **vistas** (registros de usuarios que pasan por el portal).
- **Usuarios finales** (invitados) ver un portal cautivo al conectarse a la WiFi, rellenar un formulario (email, datos, términos) y ser autorizados para navegar.

La app está hecha en **Next.js 14**, con **MongoDB** (Mongoose), **JWT**, **MUI**, **React Query** y **Tailwind**.

---

## 2. Estructura del proyecto (raíz y `src`)

### Raíz

| Archivo | Uso |
|--------|-----|
| `package.json` | Scripts: `dev` (puerto 80), `build`, `start`, `lint`. Dependencias: Next, React, MUI, TanStack Query, Mongoose, JWT, Brevo, node-unifi, Chart.js, etc. |
| `tsconfig.json` | TypeScript con alias `@/*` → `./src/*`. |
| `next.config.mjs` | Transpila el paquete `mui-one-time-password-input`. |
| `tailwind.config.ts` | Contenido en `src/pages`, `src/components`, `src/app`. |
| `.env` | Variables de entorno (API, DB, crypto, JWT, Brevo). La config acepta `BREVO_API_KEY` o `REVO_API_KEY` para el envío de emails. |
| `.eslintrc.json` | Extiende `next/core-web-vitals`. |

### `src/` (resumen por carpeta)

```
src/
├── app/                    # Next.js App Router: páginas y API routes
├── configuration/          # Config (env), DB (Mongo), config.client (URI API)
├── controllers/            # Lógica de negocio por recurso (auth, org, site, ap, view, communication, ubiquiti)
├── middlewares/            # JWT, validación de esquema (Joi), ownership (org/site/ap), unicidad (siteId, mac)
├── models/                 # Mongoose: Client, Organization, Site, AP, View
├── schemas/                # Joi: validación de body/query por recurso
├── lib/                    # Capa de dominio + aplicación + infra (repositorios fetch)
├── hooks/                  # useIfAuth, useCautivePortalConnection
├── utils/                  # crypto, getQueries, strings
├── Components/             # Input, SelectInput (reutilizables)
```

---

## 3. Modelo de datos (MongoDB)

Jerarquía:

```
Client (cliente/empresa)
  └── Organization (organización del cliente)
        └── Site (sitio: Meraki o Ubiquiti; credenciales del controlador)
              └── AP (access point; mac, name)
                    └── View (registro de un “pase” por el portal: mac del cliente, isLogin, info[], code)
```

- **Client**: `name`, `email`, `password` (encriptada con AES-256-CBC).
- **Organization**: `idClient`, `name`.
- **Site**: `idOrganization`, `type` (enum: `meraki` | `ubiquiti`), `siteId`, `name`, `host`, `port`, `username`, `password`, `sslverify`.
- **AP**: `idSite`, `mac` (única), `name`.
- **View**: `idAp`, `mac`, `isLogin`, `info` (array de `{ label, value, type }`), `code` (para OTP/verificación).

Todos los modelos tienen `timestamps` (createdAt, updatedAt). Los IDs son `_id` de MongoDB.

---

## 4. Configuración y entorno

- **`configuration/config.ts`** (solo servidor): Lee y valida `URI_DB_MONGO`, `SECRET_KEY`, `SECRET_IV`, `TOKEN_SECRET`, `BREVO_API_KEY` (o `REVO_API_KEY` como fallback), `NEXT_PUBLIC_URI_API`. Si falta algo, devuelve `""` y loguea.
- **`configuration/config.client.ts`** (cliente): Expone `URI_API = process.env.NEXT_PUBLIC_URI_API` (base URL de la API).
- **`configuration/db.ts`**: Conecta a MongoDB con `URI_DB_MONGO`.

En `.env` tienes `NEXT_PUBLIC_URI_API=https://iris-api-plum.vercel.app/`. Los repositorios Fetch (Auth, Site, AP, Organization, View) usan esa base para llamar a la API (login, CRUD de organizaciones, sitios, APs, vistas). Las rutas de este mismo proyecto bajo `app/api/*` son las que hablan con MongoDB (por ejemplo `/api/auth/login`, `/api/view`, `/api/connecting`, etc.). Si la API desplegada en Vercel es esta misma app, entonces esa URL es la base de tu propio backend.

---

## 5. Arquitectura en capas (`lib/`)

- **Domain** (`lib/*/domain/`): Entidades e interfaces (Organization, Site, AP, View, Client, Auth, ViewRepository, ViewSpecification).
- **Application** (`lib/*/application/`): Casos de uso / servicios (createOrganizationService, createSiteService, createAPService, createViewService, LoginUseCase). Reciben un repositorio y exponen `find`, `create`, `update`, `remove` (y en View además `sendEmail`, `verifyCode`).
- **Infrastructure** (`lib/*/infrastructure/`): Implementaciones que llaman a la API HTTP (AuthFetchRepository, OrganizationFetchRepository, SiteFetchRepository, APFetchRepository, ViewFetchRepository). Usan `URI_API`, cookie `token`, y utilidades en `lib/Shared/infrastructure/FetchRepository/` (`handleApiResponse`, `buildQueryString`, `transformToSnakeCase`/`transformToCamelCase`).

Los **controllers** en `controllers/` suelen usar **directamente los modelos Mongoose** y no los use cases de `lib/`; la capa de aplicación se usa sobre todo desde el front con los FetchRepositories.

---

## 6. Autenticación

- **Login**: `POST /api/auth/login` (o la URL que exponga tu API en `NEXT_PUBLIC_URI_API` + `auth/login`). Body: `email`, `password`. La contraseña se compara con la versión encriptada en DB. Si es correcto, se devuelve un JWT (payload: `id`, `name`; expiración 24h).
- **Uso del token**: En rutas protegidas, el middleware `verifyJwt` lee `Authorization: Bearer <token>`. El front guarda el token en cookie `token` (cookies-next) y lo envía en las peticiones a la API.
- **Hook `useIfAuth`**: Comprueba la cookie `token`; si existe redirige a `/AdminDashboard`, si no a `/`.

---

## 7. Rutas de la aplicación (App Router)

### Páginas (flujo usuario)

| Ruta | Descripción |
|------|-------------|
| `/` | Página de login (`app/Login/page.tsx`). Tras login exitoso → `/AdminDashboard`. |
| `/dashboard` | Página de prueba con Redux (Count). |
| `/AdminDashboard` | Dashboard principal: cards (portal, accesos, dispositivos únicos), donuts (sitios, edades), selector de rango de fechas. Layout con NavBar y SideBar. |
| `/AdminDashboard/controllersAdd` | CRUD de organizaciones. |
| `/AdminDashboard/siteAdd` | CRUD de sitios. |
| `/AdminDashboard/apAdd` | CRUD de APs. |
| `/AdminDashboard/viewPage` | Tabla de registros del portal (vistas con `isLogin=true`) y donut de edades si aplica. |
| `/AdminDashboard/portalCautive` | Página del portal cautivo (admin). |
| `/guest/s/[id]` | Portal cautivo para **Ubiquiti**: recibe `id` (site) y query params `id` (client MAC), `ap` (node MAC). Usa `useCautivePortalConnection` y luego `connectUser` + `updateView` (en este proyecto `apiUtils` apunta a `api-iris-0yax.onrender.com` para ubiquiti y a `/api/view` y `/api/connecting` locales; el hook `useCautivePortalConnection` usa `URI_API` para Site/AP/View). |
| `/meraki/[id]` | Portal cautivo **Meraki**: flujo con formulario de bienvenida y verificación por email/OTP; redirección a `base_grant_url` de Meraki. Datos de sitio/AP desde `api-iris-0yax.onrender.com`, vistas con `/api/view`. |
| `/merakiN/[id]` | Variante del portal Meraki (PortalCautiveView con formulario y términos). |
| `/merakiSV/[id]` | Otra variante de portal (Meraki). |
| `/connecting` | Ruta en `app/connecting/route.ts`: es un **Route Handler** POST que autoriza invitados en Unifi (credenciales hardcodeadas en ese archivo). No es una página. |

### API Routes (`app/api/`)

| Método y ruta | Descripción |
|---------------|-------------|
| `POST /api/auth/login` | Login: body `email`, `password`. Devuelve JWT. |
| `GET/POST /api/organization` | Listar / crear organizaciones (JWT + ownership). |
| `PATCH/DELETE /api/organization/[id]` | Actualizar / borrar organización (JWT + clientIsOwnerOfProject). |
| `GET/POST /api/site` | Listar / crear sitios (probablemente en otra ruta; en el código aparece `site/` con id en PATCH/DELETE). |
| `PATCH/DELETE /api/site/[id]` | Actualizar / eliminar sitio (JWT + validateClientIsOwner, uniqueSiteId, updateType). |
| `GET/POST /api/ap` | Listar / crear APs (JWT, validar dueño del sitio, MAC única). |
| `PATCH/DELETE /api/ap/[id]` | Actualizar / eliminar AP (JWT, ownership, MAC única si se cambia). |
| `GET/POST/PUT /api/view` | Obtener vistas (query), crear vista, actualizar vista. POST/PUT sin JWT en algunos flujos (portal). |
| `GET /api/view/unique-devices` | Dispositivos únicos (métricas). |
| `POST /api/view/verify-code` | Verificar código (OTP/email). |
| `POST /api/communication/email-by-view` | Enviar email por vista (Brevo). |
| `POST /api/connecting` | Autorizar invitado en controlador Ubiquiti (body: id, ap, idSite, site). Usa Site en MongoDB y node-unifi. |
| `GET /api/ubiquiti` | Delegado a controlador Ubiquiti según query (SITE / AP). |

---

## 8. Middlewares importantes

- **`verifyJwt`**: Extrae y verifica el JWT del header `Authorization`. Usado en casi todas las rutas de organización, sitio y AP.
- **`validateSchema(body, schema)`**: Valida body o query con Joi; devuelve `NextResponse` 400 si falla.
- **Organization**: `clientIsOwnerOfProject(jwt, organizationId)`.
- **Site**: `validateClientIsOwner(siteId, jwt)`, `validateUniqueSiteId(siteId)`, `validateUpdateType(body, siteId)`.
- **AP**: `validateMacIsUnique(mac)`, `validateClientIsOwnerOfAp(apId, jwt)`.

La propiedad “owner” se deduce del JWT (client id) y de la cadena Client → Organization → Site → AP.

---

## 9. Flujos principales

### 9.1 Login y acceso al dashboard

1. Usuario entra a `/` → ve `Login/page.tsx`.
2. Introduce email y contraseña → `AuthFetchRepository.login` → `POST` a `URI_API + 'auth/login'`.
3. El backend (este proyecto o el desplegado en `NEXT_PUBLIC_URI_API`) valida con Client en MongoDB y devuelve JWT.
4. Front guarda token en cookie y redirige a `/AdminDashboard`.
5. `useIfAuth` (en layout del AdminDashboard) asegura que solo con token se vea el panel.

### 9.2 CRUD de organizaciones, sitios y APs

- El usuario ya tiene token. Las pantallas `controllersAdd`, `siteAdd`, `apAdd` usan los servicios de `lib/` (Organization, Site, AP) con los FetchRepositories, que envían `Authorization: Bearer <token>` y llaman a las rutas de la API (por ejemplo `URI_API + 'site/'`, etc.). Esas rutas en el servidor validan JWT y ownership y usan los controllers que a su vez usan los modelos Mongoose.

### 9.3 Portal cautivo (invitado) – Ubiquiti

1. Usuario se conecta a la WiFi; el controlador Ubiquiti redirige a algo como `/guest/s/[id]?id=<client_mac>&ap=<node_mac>`.
2. `useCautivePortalConnection(siteId, clientMac, nodeMac)` obtiene Site por `siteId`, AP por `idSite` + `nodeMac`, y crea una View con `idAp` y `mac` (clientMac).
3. El usuario rellena el formulario y acepta términos. Al enviar:
   - Se llama a `connectUser` (en `apiUtils` actualmente a `api-iris-0yax.onrender.com/.../connecting`; en este repo también existe `POST /api/connecting` que usa Site en MongoDB y node-unifi).
   - Se actualiza la vista con `updateView` (por ejemplo `PUT /api/view` con `isLogin: true` e `info`).
4. Redirección a Google (o la URL configurada).

### 9.4 Portal cautivo – Meraki

Todos los portales Meraki usan **solo la API de esta app** (sin dependencia de Render):

1. **Rutas**: `/meraki/[id]`, `/merakiN/[id]`, `/merakiSV/[id]`. Meraki redirige con query params: `base_grant_url`, `client_mac`, `node_mac`, `user_continue_url`, etc.
2. **Obtener sitio y AP (sin JWT)**: `GET /api/ubiquiti?type=SITE&siteId=<id>` y `GET /api/ubiquiti?type=AP&idSite=<_id del sitio>&mac=<node_mac>`. Sirve para sitios tipo Meraki y Ubiquiti.
3. **Crear vista**: `POST /api/view` con `{ idAp, mac: client_mac }`.
4. **Flujo con OTP** (ej. `/meraki/[id]`, `/merakiSV/[id]`): usuario ingresa email → `POST /api/communication/email-by-view` (envía código por Brevo) → usuario ingresa código → `POST /api/view/verify-code` → `PUT /api/view` con `isLogin: true` e `info` → redirección a `base_grant_url?continue_url=...`.
5. **Flujo sin OTP** (ej. `/merakiN/[id]`): formulario con validación → `PUT /api/view` con `isLogin: true` e `info` → redirección a `base_grant_url?continue_url=...`.

---

## 10. Meraki – Resumen de archivos y APIs

| Variante | Ruta | Site/AP | View | Email/OTP |
|----------|------|---------|------|-----------|
| meraki   | `/meraki/[id]`   | `/api/ubiquiti` | `/api/view` (POST, PUT) | `/api/communication/email-by-view`, `/api/view/verify-code` |
| merakiN  | `/merakiN/[id]`  | `/api/ubiquiti` | `/api/view` (POST, PUT) | No (formulario directo) |
| merakiSV | `/merakiSV/[id]` | `/api/ubiquiti` | `/api/view` (POST, PUT) | `/api/communication/email-by-view`, `/api/view/verify-code` |

- **Brevo**: Envío de códigos OTP usa `BREVO_API_KEY` o `REVO_API_KEY` en `.env` (config acepta ambos).
- Para que el envío de email funcione, en `.env` debe existir una de esas claves y el template/correo en Brevo configurado.

---

## 11. Detalles útiles

- **Crypto**: Contraseñas y campos sensibles (ej. password del Site) con AES-256-CBC (`utils/crypto/crypto.ts`); `SECRET_KEY` y `SECRET_IV` en hex en `.env`.
- **Brevo**: `config.ts` acepta `BREVO_API_KEY` o `REVO_API_KEY` para el envío de emails (códigos de verificación en portales Meraki).
- **Guest/Ubiquiti**: Sigue usando `apiUtils` con URL a Render para `connecting`; el resto puede unificarse con esta app si se expone el mismo contrato en `/api/ubiquiti` y `/api/connecting`.
- **Redux**: Hay un store con `counter` (`lib/store.ts`, `lib/features/counter/counterSlice.ts`); se usa en `/dashboard` con `Count`. El resto de estado relevante usa React Query y estado local.
- **Providers**: `Providers.tsx` envuelve la app con `QueryClientProvider` (React Query) y `ThemeProvider` (MUI). No incluye `StoreProvider`; ese está solo en la página de dashboard.

Con esto deberías tener el proyecto entendido de pies a cabeza. Si quieres, en el siguiente paso podemos bajar al detalle de un flujo concreto (por ejemplo solo portal Ubiquiti o solo Meraki) o revisar nombres de env y unificación de APIs.
