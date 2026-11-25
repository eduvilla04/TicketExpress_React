import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Header, Footer } from './components/Layout';
import PwaStatus from './components/PwaStatus';
import { usePageNav } from './routes/navegacion';

export default function App() {
  const navegar = usePageNav();
  const { pathname } = useLocation();
  useEffect(() => {
    const titulo = pathname === '/' ? 'Inicio' : pathname.split('/').filter(Boolean).slice(-1)[0];
    document.title = `${titulo.charAt(0).toUpperCase() + titulo.slice(1)} | TicketExpress`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return <div className="app-shell">
    <a href="#contenido" className="skip-link">Saltar al contenido</a>
    <Header pagina={pathname} navegar={navegar}/>
    <PwaStatus />
    <div id="contenido" className="page-root"><Outlet /></div>
    <Footer navegar={navegar}/>
  </div>;
}
