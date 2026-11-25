import { useLoaderData, useLocation, useParams } from 'react-router';
import { usePageNav } from './navegacion';

export default function RouteView({ Page, ...props }) {
  const navegar = usePageNav();
  const params = useParams();
  const { search } = useLocation();
  const busquedaInicial = new URLSearchParams(search).get('q') || '';
  const datosRuta = useLoaderData();
  return <Page navegar={navegar} eventoId={params.id} ordenId={params.ordenId} datosRuta={datosRuta} busquedaInicial={busquedaInicial} {...props} />;
}
