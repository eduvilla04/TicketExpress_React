# TicketExpress

TicketExpress es una aplicación web para explorar eventos y comprar entradas de forma simulada. Permite consultar conciertos, exposiciones, obras de teatro, deportes y cine en El Salvador.

La página tiene un diseño sencillo, con colores neutros, y permite recorrer el proceso de compra desde la selección de un evento hasta la confirmación de las entradas.

## Funcionalidades

- Explorar eventos por categoría, ciudad o nombre.
- Consultar fechas, lugares, precios y zonas disponibles.
- Seleccionar entradas y agregarlas al carrito.
- Revisar el total y completar una compra de prueba.
- Consultar las entradas adquiridas en la sección Mis entradas.
- Utilizar las opciones de registro, inicio de sesión y perfil de demostración.
- Acceder al panel de administración para consultar eventos, inventario, usuarios y reportes.

## Tecnologías utilizadas

- React 19
- JavaScript y JSX
- Vite 8
- HTML5 y CSS3
- Git y GitHub

## Instalación y ejecución

Para ejecutar el proyecto es necesario tener instalados Node.js y npm.

Primero se descarga o clona el repositorio y se abre la carpeta en Visual Studio Code.

Desde la terminal se ejecutan los siguientes comandos:

```bash
npm install
npm run dev
```

Después se abre en el navegador la dirección indicada por Vite, normalmente:

`http://localhost:5173/`

En PowerShell de Windows también se pueden utilizar los comandos `npm.cmd install` y `npm.cmd run dev`.

## Componentes principales

El proyecto está dividido en componentes reutilizables para evitar repetir código entre las diferentes pantallas.

| Componente | Función |
|---|---|
| Header y Footer | Navegación y estructura general de la página. |
| EventCard | Muestra la información resumida de cada evento. |
| Poster | Presenta los afiches de los eventos. |
| PageTitle | Muestra los títulos de las secciones. |
| FilterTabs | Permite filtrar eventos por categoría. |
| QtyStepper | Controla la cantidad de entradas. |
| Summary | Muestra el resumen y total de la compra. |
| Stepper | Indica el progreso del proceso de compra. |
| FormField | Campos reutilizables para formularios. |
| StateMessage | Muestra mensajes informativos y errores. |
| Loading y EmptyState | Muestran estados de carga y resultados vacíos. |
| TicketQR | Representación visual del código QR de una entrada. |
| Panel, AdminNav y MetricCard | Organizan la información del administrador. |
| BarChart | Muestra las estadísticas de ventas de demostración. |

Las pantallas se encuentran en `src/pages/`, mientras que los componentes compartidos están en `src/components/`.

## Manejo de estado y persistencia

Se utiliza `useState` para controlar formularios, filtros y navegación. Para compartir información entre las distintas pantallas se utiliza `TicketContext`, junto con `useReducer`.

El estado principal contiene:

| Estado | Información que maneja |
|---|---|
| `carrito` | Entradas, zonas, precios y cantidades seleccionadas. |
| `ordenes` | Compras simuladas realizadas. |
| `sesion` | Usuario y rol de demostración. |
| `ciudad` | Ciudad seleccionada para explorar eventos. |
| `eventosEstado` | Estados disponibles o pausados de los eventos. |
| `inventarioAjustes` | Cambios de capacidad realizados desde administración. |

Estos datos se guardan mediante `useEffect` en `localStorage`, utilizando la clave `ticketexpress_mvp_v1`. Esto permite conservar el carrito, las compras y los cambios de demostración al recargar la página.

## Datos simulados

La aplicación utiliza un catálogo de ocho eventos ficticios, cada uno con tres zonas de entradas, precios y capacidades diferentes.

También se incluyen usuarios y registros de ventas de ejemplo para mostrar el funcionamiento del panel administrativo.

Los pagos se procesan mediante una simulación que permite mostrar estados de carga, confirmación y error, sin realizar cobros reales.

## Diseño y limitaciones

El diseño está basado en el [prototipo de TicketExpress en Figma](https://www.figma.com/design/ZISWfC6IuI9g4444QfLHuK). Se eligió una apariencia minimalista con colores blanco, negro y gris.

La interfaz utiliza CSS, Flexbox y Grid para adaptarse a dispositivos móviles, tablets y computadoras.

Se utilizaron componentes reutilizables para mantener el código organizado y un contexto de React para compartir la información entre pantallas, sin necesidad de implementar un servidor.

**Limitaciones actuales:**

- No utiliza una base de datos ni un backend real.
- El inicio de sesión y los usuarios son simulados.
- No se procesan pagos reales.
- Los códigos QR son ilustrativos y no funcionan como entradas válidas.
- La información almacenada depende del navegador utilizado.

## Documentación adicional

En la carpeta `docs/` se incluyen:

- `arquitectura.md`: organización de componentes y explicación del flujo de estado.
