import { createContext, useContext, useEffect, useCallback, useMemo, useState } from 'react';
import { listarEventos, crearEvento, editarEvento, eliminarEvento, actualizarZona } from '../api/events';

const EventContext = createContext(null);

export function EventProvider({ children }) {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const recargar = useCallback(async (signal) => {
    setCargando(true);
    setError('');
    try {
      const datos = await listarEventos({ signal });
      if (!signal?.aborted) setEventos(datos);
    } catch (fallo) {
      if (fallo.name !== 'AbortError' && !signal?.aborted) setError(fallo.message || 'No fue posible cargar los eventos.');
    } finally {
      if (!signal?.aborted) setCargando(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    recargar(controller.signal);
    return () => controller.abort();
  }, [recargar]);

  const mutar = useCallback(async (accion, ...args) => {
    const resultado = await accion(...args);
    await recargar();
    return resultado;
  }, [recargar]);

  const valor = useMemo(() => ({
    eventos, cargando, error, recargar,
    crear: datos => mutar(crearEvento, datos),
    editar: (id, datos) => mutar(editarEvento, id, datos),
    eliminar: id => mutar(eliminarEvento, id),
    editarZona: (id, zonaId, datos) => mutar(actualizarZona, id, zonaId, datos)
  }), [eventos, cargando, error, recargar, mutar]);

  return <EventContext.Provider value={valor}>{children}</EventContext.Provider>;
}

export function useCatalogo() {
  const contexto = useContext(EventContext);
  if (!contexto) throw new Error('Falta EventProvider');
  return contexto;
}
