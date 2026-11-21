# TicketExpress

TicketExpress es una página web para descubrir eventos y reservar entradas de forma sencilla. Permite explorar conciertos, exposiciones, teatro, deportes y cine en El Salvador.

El diseño utiliza colores neutros y una interfaz simple para encontrar eventos, revisar sus detalles y seguir el proceso de compra.

## ¿Qué se puede hacer?

- Explorar eventos por categoría, ciudad o nombre.
- Consultar fechas, lugares, precios y zonas disponibles.
- Agregar entradas al carrito y revisar el total.
- Realizar una compra de prueba y consultar las entradas en **Mis entradas**.
- Iniciar una sesión de demostración y acceder al panel de administración.
- Consultar eventos, inventario, usuarios de ejemplo y reportes desde el panel.

## Tecnologías

React, JavaScript (JSX), Vite y CSS.

## Cómo ejecutar el proyecto

Necesitás tener instalados Node.js y npm.

1. Descargá el repositorio y abrilo en VS Code.
2. Abrí una terminal en la carpeta del proyecto.
3. Ejecutá:

```bash
npm install
npm run dev
```

4. Abrí la dirección que aparezca en la terminal, normalmente `http://localhost:5173/`.

En PowerShell también podés usar `npm.cmd install` y `npm.cmd run dev`.

## Cómo probar la página

Desde **Inicio** o **Explorar**, elegí un evento, seleccioná una zona y agregá entradas al carrito. Después seguí al pago para completar la compra de prueba.

Para entrar al panel administrativo, abrí **Iniciar sesión** y seleccioná **Entrar como administrador demo**.

**Importante:** los eventos, usuarios y pagos son simulados. No usés datos bancarios reales. El QR de las entradas es ilustrativo y no sirve para ingresar a un evento.

La información de prueba se guarda en `localStorage`, por lo que permanece en ese navegador hasta que se borren sus datos.

## Organización

- `src/components/`: componentes compartidos de la interfaz.
- `src/pages/`: pantallas del sitio.
- `src/context/`: estado del carrito, compras y sesión.
- `src/data/`: catálogo y datos de ejemplo.
- `src/styles/`: estilos y diseño responsive.
- `docs/`: explicación técnica y guía de presentación.

El diseño original se puede consultar en [Figma](https://www.figma.com/design/ZISWfC6IuI9g4444QfLHuK).
