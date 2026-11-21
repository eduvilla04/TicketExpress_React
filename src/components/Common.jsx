import { dinero } from '../utils/helpers';

export function PageTitle({ etiqueta = 'EL SALVADOR', titulo, descripcion }) {
  return (
    <section className="page-title">
      <p className="eyebrow">{etiqueta}</p>
      <h1>{titulo}</h1>
      {descripcion && <p className="muted">{descripcion}</p>}
    </section>
  );
}

export function FilterTabs({ valor, onChange, opciones }) {
  return (
    <div className="filter-tabs" role="group" aria-label="Filtrar por categoría">
      {opciones.map(opcion => (
        <button
          type="button"
          key={opcion}
          className={valor === opcion ? 'tab active' : 'tab'}
          onClick={() => onChange(opcion)}
          aria-pressed={valor === opcion}
        >
          {opcion}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({
  titulo = 'No hay resultados',
  descripcion = 'Probá con otra búsqueda.',
  accion,
  textoAccion
}) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-symbol" aria-hidden="true">⌕</div>
      <h3>{titulo}</h3>
      <p className="muted">{descripcion}</p>
      {accion && (
        <button className="btn btn-outline" onClick={accion}>
          {textoAccion || 'Volver'}
        </button>
      )}
    </div>
  );
}

export function StateMessage({ tipo = 'info', children }) {
  return (
    <div className={`state-message ${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}

export function Stepper({ actual = 1 }) {
  const pasos = ['Selección', 'Carrito', 'Pago', 'Confirmación'];

  return (
    <nav className="steps" aria-label="Progreso de compra">
      {pasos.map((paso, indice) => (
        <div
          key={paso}
          className={`step ${actual === indice + 1 ? 'current' : ''} ${actual > indice + 1 ? 'done' : ''}`}
          aria-current={actual === indice + 1 ? 'step' : undefined}
        >
          <span className="step-number">{indice + 1}</span>
          <span>{paso}</span>
        </div>
      ))}
    </nav>
  );
}

export function Summary({ lineas, total, titulo = 'Resumen' }) {
  return (
    <aside className="summary-box">
      <h3>{titulo}</h3>
      {lineas.map((linea, i) => (
        <div className="summary-line" key={i}>
          <span>{linea.nombre}</span>
          <strong>{typeof linea.valor === 'number' ? dinero(linea.valor) : linea.valor}</strong>
        </div>
      ))}
      <div className="summary-total">
        <span>Total</span>
        <strong>{dinero(total)}</strong>
      </div>
    </aside>
  );
}

export function QtyStepper({ valor, onChange, min = 1, max = 10 }) {
  return (
    <div className="qty">
      <button
        type="button"
        aria-label="Disminuir cantidad"
        disabled={valor <= min}
        onClick={() => onChange(valor - 1)}
      >
        −
      </button>
      <span aria-live="polite">{valor}</span>
      <button
        type="button"
        aria-label="Aumentar cantidad"
        disabled={valor >= max}
        onClick={() => onChange(valor + 1)}
      >
        +
      </button>
    </div>
  );
}

export function FormField({ label, id, error, ...props }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && <small className="field-error" id={`${id}-error`}>{error}</small>}
    </div>
  );
}

export function Loading({ texto = 'Procesando...' }) {
  return (
    <div className="loading" role="status">
      <span className="spinner" aria-hidden="true" />
      {texto}
    </div>
  );
}

export function Panel({ titulo, children, accion }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>{titulo}</h2>
        {accion}
      </div>
      {children}
    </section>
  );
}
