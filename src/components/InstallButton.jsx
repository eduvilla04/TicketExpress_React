import { useEffect, useState } from 'react';

export default function InstallButton() {
  const [solicitud, setSolicitud] = useState(null);
  useEffect(() => {
    const guardar = evento => { evento.preventDefault(); setSolicitud(evento); };
    window.addEventListener('beforeinstallprompt', guardar);
    return () => window.removeEventListener('beforeinstallprompt', guardar);
  }, []);
  if (!solicitud) return null;
  return <button className="pill pill-install" onClick={async () => {
    solicitud.prompt();
    await solicitud.userChoice;
    setSolicitud(null);
  }}>Instalar app</button>;
}
