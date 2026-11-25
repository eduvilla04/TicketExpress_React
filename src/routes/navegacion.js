import { useCallback } from 'react';
import { useNavigate } from 'react-router';

const rutas = {
  inicio: '/', explorar: '/eventos', carrito: '/carrito', pago: '/checkout',
  entradas: '/boletos', perfil: '/perfil', login: '/login', registro: '/registro',
  recuperar: '/recuperar', admin: '/admin', ayuda: '/ayuda',
  privacidad: '/privacidad', terminos: '/terminos',
  adminEventos: '/admin/eventos', adminInventario: '/admin/inventario',
  adminUsuarios: '/admin/usuarios', adminReportes: '/admin/reportes',
  adminVerificar: '/admin/verificar'
};

export function rutaDe(pagina, datos = {}) {
  if (pagina === 'detalle') return `/eventos/${encodeURIComponent(datos.eventoId || '')}`;
  if (pagina === 'confirmacion') return `/confirmacion/${encodeURIComponent(datos.ordenId || '')}`;
  if (pagina === 'explorar' && datos.busqueda) return `/eventos?q=${encodeURIComponent(datos.busqueda)}`;
  return rutas[pagina] || '/';
}

export function usePageNav() {
  const navigate = useNavigate();
  return useCallback((pagina, datos = {}) => navigate(rutaDe(pagina, datos)), [navigate]);
}
