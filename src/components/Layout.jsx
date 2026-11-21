import { useState } from 'react';
import { useTickets } from '../context/TicketContext';

export function Header({ pagina, navegar }) {
  const { estado, dispatch } = useTickets();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busquedaAbierta, setBusquedaAbierta] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const cantidadCarrito = estado.carrito.reduce((total, item) => total + item.cantidad, 0);

  const ir = (paginaNueva, extras = {}) => {
    setMenuAbierto(false);
    setBusquedaAbierta(false);
    navegar(paginaNueva, extras);
  };

  const enlaces = [
    ['inicio', 'Inicio'],
    ['explorar', 'Explorar eventos'],
    ['carrito', `Carrito (${cantidadCarrito})`],
    ['entradas', 'Mis entradas'],
    ['perfil', 'Mi perfil'],
    ['admin', 'Administración']
  ];

  function buscar(e) {
    e.preventDefault();
    ir('explorar', { busqueda });
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-brand">
          <button
            type="button"
            className="menu-icon"
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            ☰
          </button>
          <button
            type="button"
            className="brand"
            onClick={() => ir('inicio')}
            aria-label="TicketExpress, inicio"
          >
            ticket.
          </button>
        </div>

        <nav className="header-actions" aria-label="Navegación principal">
          <label className="sr-only" htmlFor="ciudad">Ciudad</label>
          <select
            id="ciudad"
            className="pill pill-select"
            value={estado.ciudad}
            onChange={e => dispatch({ type: 'CIUDAD', ciudad: e.target.value })}
          >
            <option>San Salvador</option>
            <option>Santa Tecla</option>
            <option>Todo El Salvador</option>
          </select>
          <button
            className="pill icon-pill"
            type="button"
            aria-label="Buscar eventos"
            aria-expanded={busquedaAbierta}
            onClick={() => setBusquedaAbierta(!busquedaAbierta)}
          >
            ⌕
          </button>
          <button className="pill pill-dark" type="button" onClick={() => ir('entradas')}>
            ▤ <span>Mis entradas</span>
          </button>
          <button className="pill" type="button" onClick={() => ir(estado.sesion ? 'perfil' : 'login')}>
            {estado.sesion ? 'Mi perfil' : 'Iniciar sesión'}
          </button>
        </nav>
      </div>

      {menuAbierto && (
        <nav className="drop-menu" aria-label="Secciones del sitio">
          {enlaces.map(([vista, nombre]) => (
            <button
              type="button"
              key={vista}
              onClick={() => ir(vista)}
              aria-current={pagina === vista ? 'page' : undefined}
            >
              {nombre}
            </button>
          ))}
        </nav>
      )}

      {busquedaAbierta && (
        <form className="header-search" role="search" onSubmit={buscar}>
          <label htmlFor="busqueda-menu" className="sr-only">Buscar evento</label>
          <input
            id="busqueda-menu"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar artistas, eventos o lugares..."
            autoFocus
          />
          <button type="submit" className="btn btn-dark">Buscar</button>
        </form>
      )}
    </header>
  );
}

export function Footer({ navegar }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <span><strong>ticket.</strong> © {new Date().getFullYear()}</span>
        <nav aria-label="Información">
          <button type="button" onClick={() => navegar('ayuda')}>Ayuda</button>
          <button type="button" onClick={() => navegar('privacidad')}>Privacidad</button>
          <button type="button" onClick={() => navegar('terminos')}>Términos</button>
        </nav>
      </div>
    </footer>
  );
}
