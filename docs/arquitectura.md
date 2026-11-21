# Arquitectura de componentes y flujo de estado

## Vista general

`main.jsx` crea la aplicación y la envuelve en `TicketProvider`. `App.jsx` decide qué pantalla mostrar mediante `ruta.pagina`. `Header` y `Footer` se mantienen visibles en todas las vistas. Las páginas consumen los datos del catálogo y el estado global.

```text
TicketProvider (useReducer + useEffect)
└── App (estado de navegación)
    ├── Header / Footer
    ├── Inicio / Explorar → EventCard → Poster
    ├── Detalle → QtyStepper / Summary / Stepper
    ├── Carrito → QtyStepper / Summary / Stepper
    ├── Pago → FormField / StateMessage / Summary
    ├── Confirmación / Entradas → TicketQR
    ├── Autenticación / Perfil
    └── Administración → Dashboard / Eventos / Inventario / Usuarios / Reportes
```

## Estado global

| Propiedad | Contenido | Dónde cambia |
|---|---|---|
| `carrito` | Eventos, zonas y cantidades | Detalle y Carrito |
| `ordenes` | Compras de prueba completadas | Pago |
| `sesion` | Usuario y rol ficticios | Login, Registro y Perfil |
| `ciudad` | Ciudad seleccionada | Header |
| `eventosEstado` | Evento disponible o pausado | Administración |
| `inventarioAjustes` | Capacidades de las zonas | Administración |

Las acciones se procesan en el `reducer`. El `useEffect` del proveedor serializa el estado en `localStorage` cuando cambia. Los formularios usan `useState` y son controlados. La búsqueda simula carga con un temporizador limpiado por `useEffect`.

## Flujo principal

```text
Inicio / Explorar
  → Detalle y selección
  → Agregar al carrito
  → Carrito y resumen
  → Pago de prueba con validación
  → Confirmación
  → Mis entradas y QR ilustrativo
```

Los pasos visuales del proceso de compra son: **Selección → Carrito → Pago → Confirmación**. La consulta del boleto aparece inmediatamente después del cuarto paso.

## Validaciones principales

- Cantidad de entradas disponible por zona.
- Eventos en estado disponible.
- Nombre y correo de prueba con formato válido.
- Tarjeta ficticia de 16 dígitos, fecha `MM/AA` y código de 3 dígitos.
- Bloqueo del botón mientras se simula el pago, para impedir envíos repetidos.
- Rechazo intencional de tarjetas ficticias terminadas en `0000` para demostrar el estado de error y el reintento.

## Diseño y accesibilidad

HTML semántico (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`), formularios con `label`, mensajes de estado accesibles, indicadores de pasos, botones con foco visible, controles utilizables por teclado y CSS propio con adaptaciones en `1080px`, `800px` y `480px`.

## Limitaciones

No se conecta a servicios externos, no registra pagos reales y la sesión no tiene seguridad de producción. El QR es ilustrativo y está identificado como tal.
