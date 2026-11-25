import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export default function PwaStatus() {
  const [offline, setOffline] = useState(typeof navigator !== 'undefined' && !navigator.onLine);
  const [lista, setLista] = useState(false);
  const [actualizacion, setActualizacion] = useState(false);
  const [actualizar, setActualizar] = useState(null);

  useEffect(() => {
    const update = registerSW({
      onOfflineReady: () => setLista(true),
      onNeedRefresh: () => setActualizacion(true),
      onRegisterError: error => console.error('Error al registrar la PWA:', error)
    });
    setActualizar(() => update);
    const conectada = () => setOffline(false);
    const desconectada = () => setOffline(true);
    window.addEventListener('online', conectada);
    window.addEventListener('offline', desconectada);
    return () => {
      window.removeEventListener('online', conectada);
      window.removeEventListener('offline', desconectada);
    };
  }, []);

  return <div className="pwa-notices" aria-live="polite">
    {offline && <div className="pwa-notice">Sin conexión. Se muestran los datos guardados anteriormente.</div>}
    {lista && <div className="pwa-notice">TicketExpress ya puede utilizarse sin conexión en las páginas visitadas. <button onClick={() => setLista(false)}>Cerrar</button></div>}
    {actualizacion && <div className="pwa-notice">Hay una actualización disponible.
      <button onClick={() => actualizar?.(true)}>Actualizar</button>
      <button onClick={() => setActualizacion(false)}>Después</button>
    </div>}
  </div>;
}
