import { useEffect, useState } from 'react';
import { Header, Footer } from './components/Layout';
import { PageTitle } from './components/Common';
import Inicio from './pages/Inicio';
import Explorar from './pages/Explorar';
import Detalle from './pages/Detalle';
import Carrito from './pages/Carrito';
import Pago from './pages/Pago';
import Entradas, { Confirmacion } from './pages/Entradas';
import Autenticacion, { Perfil } from './pages/Autenticacion';
import Administracion from './pages/Administracion';

export default function App() {
  const [ruta, setRuta] = useState({ pagina: 'inicio' });

  function navegar(pagina, datos = {}) {
    setRuta({ pagina, ...datos });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  useEffect(() => {
    const titulo = ruta.pagina === 'inicio'
      ? 'Inicio'
      : ruta.pagina.charAt(0).toUpperCase() + ruta.pagina.slice(1);

    document.title = `${titulo} | TicketExpress`;
  }, [ruta.pagina]);

  let vista;

  switch (ruta.pagina) {
    case 'inicio':
      vista = <Inicio navegar={navegar} />;
      break;
    case 'explorar':
      vista = (
        <Explorar
          key={ruta.busqueda || 'catalogo'}
          navegar={navegar}
          busquedaInicial={ruta.busqueda || ''}
        />
      );
      break;
    case 'detalle':
      vista = <Detalle key={ruta.eventoId} eventoId={ruta.eventoId} navegar={navegar} />;
      break;
    case 'carrito':
      vista = <Carrito navegar={navegar} />;
      break;
    case 'pago':
      vista = <Pago navegar={navegar} />;
      break;
    case 'confirmacion':
      vista = <Confirmacion ordenId={ruta.ordenId} navegar={navegar} />;
      break;
    case 'entradas':
      vista = <Entradas navegar={navegar} />;
      break;
    case 'login':
    case 'registro':
    case 'recuperar':
      vista = <Autenticacion key={ruta.pagina} modo={ruta.pagina} navegar={navegar} />;
      break;
    case 'perfil':
      vista = <Perfil navegar={navegar} />;
      break;
    case 'admin':
      vista = <Administracion navegar={navegar} />;
      break;
    default:
      vista = (
        <main className="container inner-page">
          <PageTitle titulo="Información" descripcion="Esta sección es parte de la demostración." />
          <button className="btn btn-dark" onClick={() => navegar('inicio')}>
            Volver al inicio
          </button>
        </main>
      );
  }

  return (
    <div className="app-shell">
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <Header pagina={ruta.pagina} navegar={navegar} />
      <div id="contenido" className="page-root">{vista}</div>
      <Footer navegar={navegar} />
    </div>
  );
}
