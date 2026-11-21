import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { leerLocal } from '../utils/helpers';
import { inicial, reducer } from './ticketReducer';

const TicketContext = createContext(null);
export function TicketProvider({ children }) {
  const [estado, dispatch] = useReducer(reducer, undefined, () => ({ ...inicial, ...leerLocal('ticketexpress_mvp_v1', {}) }));
  useEffect(() => {
    try { localStorage.setItem('ticketexpress_mvp_v1', JSON.stringify(estado)); }
    catch (error) { console.warn('No se pudo guardar la demo:', error); }
  }, [estado]);
  const valor = useMemo(() => ({ estado, dispatch }), [estado]);
  return <TicketContext.Provider value={valor}>{children}</TicketContext.Provider>;
}

export function useTickets() {
  const contexto = useContext(TicketContext);
  if (!contexto) throw new Error('Falta TicketProvider');
  return contexto;
}
