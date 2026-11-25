# Arquitectura de TicketExpress — tercera entrega

## Capas

```text
main.jsx
├── TicketProvider (Context + useReducer + localStorage)
├── EventProvider (API falsa, errores, carga y refresco)
└── RouterProvider (createBrowserRouter)
    └── App (Header, Outlet, PwaStatus, Footer)
        ├── Inicio / Explorar / Detalle
        ├── Carrito / Checkout / Confirmación
        ├── Guard autenticado → Boletos / Perfil
        └── Guard por rol → Admin / Eventos / Inventario / Usuarios / Reportes
```

Las rutas se declaran en `src/router.jsx`; `src/routes/Guard.jsx` comprueba roles. `RouteView` conecta componentes con parámetros y navegación real. El listado y detalle usan loaders que aceptan `request.signal` y leen la API falsa.

## API falsa

`src/api/events.js` consulta `public/data/events.json` y combina los datos originales con un registro local de eventos creados, editados y eliminados. Las operaciones son asíncronas y validan datos. `src/api/users.js` lee usuarios ficticios y resuelve los roles; `src/api/orders.js` simula validaciones y confirma pagos de prueba. `src/api/base.js` maneja la lectura y las demoras con soporte para cancelación.

No existe ningún servidor de aplicación. GitHub Pages sirve los JSON estáticos y el navegador persiste las escrituras.

## Estado compartido

| Propiedad del reducer | Uso | Persistencia |
| --- | --- | --- |
| `carrito` | Entradas, zona, precio y cantidad | `ticketexpress_mvp_v1` |
| `ordenes` | Órdenes confirmadas | `ticketexpress_mvp_v1` |
| `sesion` | Nombre, correo ficticio y rol | `ticketexpress_mvp_v1` |
| `ciudad` | Preferencia de búsqueda | `ticketexpress_mvp_v1` |

El estado del catálogo vive en `EventProvider` y se obtiene de la API. Las mutaciones se guardan en `ticketexpress_api_eventos_v3`. No se almacena ninguna información de tarjeta.

## Flujo de compra

1. Catálogo desde API → detalle de `/eventos/:id`.
2. Zona y cantidad → reducer `AGREGAR_CARRITO`.
3. Carrito → validación de disponibilidad → pago simulado.
4. El API de pagos confirma o rechaza de forma ficticia; `COMPRAR` crea la orden.
5. Confirmación → `/boletos` (requiere sesión) → QR escaneable por unidad.

Si compra un visitante, se crea automáticamente una sesión ficticia de cliente para permitirle ver los boletos. Las órdenes se guardan solo en ese navegador.

## Administración

El panel admite eventos creados y modificados en tiempo de ejecución. El inventario y los precios se editan por zona. El dashboard y los reportes se calculan a partir de órdenes de ejemplo más compras nuevas; se pueden filtrar por periodo. `Guard` permite al organizador acceder a eventos e inventario, mientras los reportes y usuarios quedan disponibles solo al administrador.

## QR

`src/components/TicketQR.jsx` codifica `TE|<id_orden>|<id_evento>|<zona>|<número>` con corrección de errores M. Se genera una matriz QR por boleto, escaneable con lectores estándar. No existe un servidor que valide entradas para espectáculos reales.

## PWA y despliegue

`vite-plugin-pwa` genera el service worker. Workbox usa precache para app shell, **NetworkFirst** para JSON de la API y **CacheFirst** para imágenes. El fallback de navegación apunta a `index.html`. La configuración usa `VITE_BASE` y el router toma `import.meta.env.BASE_URL` como `basename`. GitHub Actions compila la rama `main` y publica `dist/`, que incluye `404.html` como copia de `index.html` y `.nojekyll`.

La navegación profunda depende de GitHub Pages y su página 404 personalizada. Si no hay conexión, el navegador solo puede usar datos ya visitados y almacenados.

## Limitaciones y seguridad

La sesión y los permisos son simulados, no tienen protección real en un servidor. Las mutaciones, los correos, los pagos y los QR son solo para demostración. No se guardan contraseñas, números de tarjeta ni CVV. El proyecto conserva el diseño blanco/negro/gris y usa HTML semántico, etiquetas de formularios, avisos accesibles y estilos para 375, 768 y 1440 px.

## Verificación local del QR

`codigoBoleto` genera un texto diferente por entrada y `verificarBoleto` lo compara contra las órdenes locales. El panel `/admin/verificar` permite pegar el texto obtenido al escanear el QR. No se usa servidor ni firma criptográfica; la validación es una demostración.
