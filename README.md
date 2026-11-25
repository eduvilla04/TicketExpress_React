# TicketExpress

TicketExpress es una aplicación para explorar eventos en El Salvador y simular la compra de boletos. Incluye conciertos, arte, cine, teatro y deportes, con un diseño minimalista basado en nuestro [prototipo de Figma](https://www.figma.com/design/ZISWfC6IuI9g4444QfLHuK).

Esta versión es una **PWA**: se puede instalar en el navegador y permite volver a consultar páginas y datos visitados cuando no hay conexión. Es una demostración académica; no realiza pagos, envíos de correo ni autenticaciones reales.

## Funcionalidades

- Buscar y filtrar eventos por categoría o ciudad; ver fechas, lugares, zonas y precios.
- Seleccionar entradas, usar el carrito y completar un pago simulado en cuatro pasos.
- Consultar boletos con un **QR escaneable distinto por entrada** y verificarlos desde el panel.
- Iniciar sesión de prueba con los roles de cliente, administrador y organizador.
- Administrar eventos (crear, editar, publicar, pausar o eliminar), inventario y precios.
- Consultar usuarios ficticios y reportes por evento y período, calculados desde órdenes de prueba.
- Instalar la PWA, consultar datos almacenados sin conexión y recibir avisos de actualización.

## Tecnologías

React 19, React Router 8 (modo datos), Vite 8, JavaScript/JSX, Context + `useReducer`, CSS, `vite-plugin-pwa`, Workbox y GitHub Actions.

## Instalación

Se necesita Node.js **22.22 o superior** (recomendado Node.js 24), debido a los requisitos de React Router 8.

```bash
npm install
npm run dev
```

Abrí la URL que aparece en la consola, normalmente `http://localhost:5173/`.

En PowerShell de Windows podés usar `npm.cmd install` y `npm.cmd run dev` si se bloquean scripts `.ps1`.

Otros comandos:

```bash
npm test
npm run build
npm run preview
```

Para comprobar la instalación y el modo offline usá **`npm run build` + `npm run preview`**. El service worker no se activa en el modo de desarrollo normal.

## Cuentas de prueba

Las tres usan la contraseña ficticia **`Demo123!`**.

| Rol | Correo |
| --- | --- |
| Cliente | `cliente@ticketexpress.test` |
| Administrador | `admin@ticketexpress.test` |
| Organizador | `organizador@ticketexpress.test` |

También hay botones de acceso rápido en Iniciar sesión. El administrador puede acceder a todos los apartados; el organizador puede gestionar eventos e inventario, pero no reportes ni usuarios. El cliente puede consultar su perfil y sus boletos. El registro y la recuperación son simulados. No ingresés contraseñas o datos bancarios reales.

## Rutas

| Ruta | Pantalla | Acceso |
| --- | --- | --- |
| `/` | Inicio | Público |
| `/eventos` | Catálogo | Público |
| `/eventos/:id` | Detalle | Público |
| `/carrito` | Carrito | Público |
| `/checkout` | Pago de prueba | Público |
| `/confirmacion/:ordenId` | Confirmación | Público |
| `/boletos`, `/perfil` | Entradas y perfil | Autenticado |
| `/admin` | Dashboard | Administrador y organizador |
| `/admin/eventos` | CRUD de eventos | Administrador y organizador |
| `/admin/inventario` | Precios y capacidades | Administrador y organizador |
| `/admin/usuarios`, `/admin/reportes` | Usuarios y reportes | Administrador |
| `/admin/verificar` | Verificación local de boletos | Administrador y organizador |
| `*` | Página 404 | Público |

La navegación usa `createBrowserRouter`, `RouterProvider` y `Outlet`. Las rutas privadas comprueban la sesión y el rol.

## Organización y estado

- `src/pages/`: inicio, catálogo, detalle, carrito, pago, boletos, cuenta y administración.
- `src/components/`: elementos compartidos como `Header`, `EventCard`, `Poster`, `Stepper`, `Summary`, `FormField`, `TicketQR` y avisos PWA.
- `src/routes/`, `src/router.jsx`: rutas, navegación y protección por roles.
- `src/context/`: carrito, órdenes, sesión y preferencias con Context y `useReducer`.
- `src/providers/EventProvider.jsx`: datos asíncronos del catálogo y operaciones administrativas.
- `src/api/`: acceso a eventos, usuarios y pago simulado.
- `public/data/`: JSON de eventos y usuarios ficticios.
- `src/styles/`: estilos CSS y adaptación móvil (375 px), tablet (768 px) y escritorio (1440 px).

El carrito, las compras y la sesión se guardan en `localStorage` con la clave `ticketexpress_mvp_v1`. Los cambios de eventos se guardan por separado en `ticketexpress_api_eventos_v3`, y los estados de usuarios demo en `ticketexpress_api_usuarios_v3`. Los formularios usan `useState`.

## API falsa y datos

La **API falsa local** lee `public/data/events.json` y `public/data/users.json` mediante `fetch`, simula latencia y expone funciones de lectura y escritura. Crear, editar o eliminar eventos y actualizar precios o capacidades conserva las modificaciones en `localStorage` sin modificar los archivos JSON.

Hay ocho eventos iniciales, con tres zonas por evento, cuatro usuarios ficticios y cinco órdenes de ejemplo para los reportes. El catálogo muestra estados de carga, error y vacío y utiliza `AbortController` para cancelar solicitudes. Los reportes incorporan también las compras que hagás en el navegador.

Los pagos son ficticios. Si comprás sin iniciar sesión, se activa automáticamente la sesión de cliente de demostración para poder consultar los boletos. Para probarlos usá `4242 4242 4242 4242`, vencimiento `12/29` y CVV `123`; un número terminado en `0000` genera un rechazo de ejemplo. Ningún dato de tarjeta se guarda en las órdenes.

## PWA y caché

La configuración está en `vite.config.js`:

- **Manifest:** nombre, colores, iconos de 192 y 512 px y una variante *maskable*.
- **Precache:** app shell (HTML, JS, CSS, iconos y otros recursos compilados).
- **NetworkFirst:** respuestas de la API local (`data/events.json` y `data/users.json`).
- **CacheFirst:** imágenes, SVG e iconos.
- **Navegación offline:** fallback a `index.html` para rutas SPA.
- **Avisos:** pérdida de conexión, disponibilidad offline y nueva versión instalada.

Después de cargar la página y visitar el catálogo una vez, probá el modo offline en DevTools → Network → Offline y recargá las pantallas visitadas. Para instalarla en Chrome o Edge usá el botón **Instalar app** cuando aparezca o la opción de instalación del navegador.

## Despliegue en GitHub Pages

El proyecto incluye `.github/workflows/deploy.yml`, `.nojekyll` y un script que genera `dist/404.html` para las rutas profundas.

1. Subí los archivos fuente al repositorio `TicketExpress_React` (sin `node_modules` ni `dist`).
2. En GitHub → **Settings → Pages**, seleccioná **GitHub Actions** como origen.
3. En cada `push` a `main`, Actions ejecutará `npm ci`, compilará con `VITE_BASE=/TicketExpress_React/` y publicará `dist/`.
4. Cuando termine el despliegue, verificá `https://eduvilla04.github.io/TicketExpress_React/`, recargá `/eventos/nocturna` y comprobá instalación y modo offline.

La URL anterior es el **destino esperado**, no una confirmación de que ya esté publicada.

## Limitaciones

No se usa backend ni base de datos real. El acceso por roles, los correos, los pagos, las órdenes y el CRUD son simulados; los cambios del navegador no se comparten con otros usuarios. Los QR contienen identificadores legibles que se pueden contrastar con órdenes locales en `/admin/verificar`; no están firmados criptográficamente ni autorizan acceso a eventos reales. Las funciones offline requieren una primera visita y los recursos previamente almacenados.

El código del QR incluye una versión adaptada de *QRCode for JavaScript* (Kazuhiko Arase) bajo licencia abierta; los avisos de licencia se conservan en `src/vendor/qr/`.

Para conocer mejor las decisiones técnicas y comprobar cada funcionalidad, consultá `docs/arquitectura.md` y `docs/pruebas.md`.
