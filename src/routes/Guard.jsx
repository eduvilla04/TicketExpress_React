import { Navigate, Outlet, useLocation } from 'react-router';
import { useTickets } from '../context/TicketContext';
import { PageTitle, StateMessage } from '../components/Common';

export default function Guard({ roles }) {
  const { estado } = useTickets();
  const location = useLocation();
  if (!estado.sesion) return <Navigate to="/login" replace state={{ volver: location.pathname }} />;
  if (roles && !roles.includes(estado.sesion.rol)) {
    return <main className="container inner-page">
      <PageTitle titulo="Acceso restringido" descripcion="Tu sesión de demostración no tiene permisos para esta sección." />
      <StateMessage tipo="error">Esta ruta requiere un rol diferente.</StateMessage>
      <a className="btn btn-dark" href={import.meta.env.BASE_URL}>Volver al inicio</a>
    </main>;
  }
  return <Outlet />;
}
