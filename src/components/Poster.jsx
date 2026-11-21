export default function Poster({ evento, grande = false }) {
  const titulo = evento.tituloPoster.split('\n');
  return (
    <figure className={`poster poster--${evento.poster} ${grande ? 'poster--grande' : ''}`} role="img" aria-label={`Afiche de ${evento.nombre}`}>
      <span className="poster-shape shape-a" aria-hidden="true" />
      <span className="poster-shape shape-b" aria-hidden="true" />
      {evento.poster === 'nocturna' && <span className="poster-shape shape-c" aria-hidden="true" />}
      <span className="poster-bar" aria-hidden="true" />
      <span className="poster-title" aria-hidden="true">{titulo.map((linea, indice) => <span key={linea} className={indice > 0 && evento.poster === 'final' ? 'large-number' : indice > 0 && evento.poster === 'sombra' ? 'second-line' : undefined}>{indice > 0 && <br />}{linea}</span>)}</span>
      {evento.poster === 'jazz' && <span className="poster-subtitle" aria-hidden="true">AFTER HOURS</span>}
      <span className="poster-caption" aria-hidden="true">{evento.detallePoster}</span>
    </figure>
  );
}
