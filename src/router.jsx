import { createBrowserRouter, useRouteError, Link } from 'react-router';
import App from './App';
import Guard from './routes/Guard';
import RouteView from './routes/RouteView';
import { listarEventos, buscarEvento } from './api/events';
import { PageTitle, StateMessage } from './components/Common';
import Inicio from './pages/Inicio';
import Explorar from './pages/Explorar';
import Detalle from './pages/Detalle';
import Carrito from './pages/Carrito';
import Pago from './pages/Pago';
import Entradas, { Confirmacion } from './pages/Entradas';
import Autenticacion, { Perfil } from './pages/Autenticacion';
import Administracion from './pages/Administracion';

function Ruta404() {
  return <main className="container inner-page"><PageTitle titulo="Página no encontrada" descripcion="No existe una sección en esta dirección."/><Link className="btn btn-dark" to="/">Volver a Inicio</Link></main>;
}

function Informacion({ titulo }) {
  return <main className="container inner-page"><PageTitle titulo={titulo} descripcion="Este apartado es informativo en la versión de demostración."/><Link className="btn btn-dark" to="/">Volver a Inicio</Link></main>;
}

function ErrorRuta() {
  const error = useRouteError();
  return <main className="container inner-page"><PageTitle titulo="No pudimos cargar esta sección"/><StateMessage tipo="error">{error?.message || 'Ocurrió un error al consultar los datos.'}</StateMessage><Link className="btn btn-dark" to="/">Ir al inicio</Link></main>;
}

const ver = (Page, props) => <RouteView Page={Page} {...props}/>;
const base = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export const router = createBrowserRouter([{
  path: '/', element: <App />, errorElement: <ErrorRuta />,
  children: [
    { index: true, element: ver(Inicio) },
    { path: 'eventos', element: ver(Explorar), loader: ({ request }) => listarEventos({ signal: request.signal }) },
    { path: 'eventos/:id', element: ver(Detalle), loader: ({ request, params }) => buscarEvento(params.id, { signal: request.signal }) },
    { path: 'carrito', element: ver(Carrito) },
    { path: 'checkout', element: ver(Pago) },
    { path: 'confirmacion/:ordenId', element: ver(Confirmacion) },
    { path: 'login', element: ver(Autenticacion, { modo: 'login' }) },
    { path: 'registro', element: ver(Autenticacion, { modo: 'registro' }) },
    { path: 'recuperar', element: ver(Autenticacion, { modo: 'recuperar' }) },
    { element: <Guard />, children: [
      { path: 'boletos', element: ver(Entradas) },
      { path: 'perfil', element: ver(Perfil) }
    ] },
    { element: <Guard roles={['administrador','organizador']} />, children: [
      { path: 'admin', element: ver(Administracion, { seccion: 'resumen' }) },
      { path: 'admin/eventos', element: ver(Administracion, { seccion: 'eventos' }) },
      { path: 'admin/inventario', element: ver(Administracion, { seccion: 'inventario' }) },
      { path: 'admin/verificar', element: ver(Administracion, { seccion: 'verificar' }) }
    ] },
    { element: <Guard roles={['administrador']} />, children: [
      { path: 'admin/reportes', element: ver(Administracion, { seccion: 'reportes' }) },
      { path: 'admin/usuarios', element: ver(Administracion, { seccion: 'usuarios' }) }
    ] },
    { path: 'ayuda', element: <Informacion titulo="Ayuda" /> },
    { path: 'privacidad', element: <Informacion titulo="Privacidad" /> },
    { path: 'terminos', element: <Informacion titulo="Términos" /> },
    { path: '*', element: <Ruta404 /> }
  ]
}], { basename: base });
