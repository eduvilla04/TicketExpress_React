// QR ilustrativo para la demostracion. No es un boleto de acceso real.
function valorCodigo(texto, x, y) {
  let hash = 2166136261;
  for (let i = 0; i < texto.length; i++) hash = Math.imul(hash ^ texto.charCodeAt(i), 16777619);
  hash ^= x * 374761393 + y * 668265263;
  hash = Math.imul(hash ^ (hash >>> 13), 1274126177);
  return (hash >>> 16) & 1;
}
function finder(x, y, ox, oy) {
  const a = x - ox, b = y - oy;
  if (a < -1 || b < -1 || a > 7 || b > 7) return null;
  if (a < 0 || b < 0 || a > 6 || b > 6) return false;
  return a === 0 || b === 0 || a === 6 || b === 6 || (a >= 2 && a <= 4 && b >= 2 && b <= 4);
}
export default function TicketQR({ codigo }) {
  const celdas = [];
  for (let y = 0; y < 29; y++) for (let x = 0; x < 29; x++) {
    const posibles = [finder(x,y,0,0), finder(x,y,22,0), finder(x,y,0,22)];
    const fijo = posibles.find(valor => valor !== null);
    const negro = fijo === undefined ? valorCodigo(codigo, x, y) : fijo;
    if (negro) celdas.push(<rect x={x} y={y} width="1" height="1" key={`${x}-${y}`} />);
  }
  return <div className="qr-wrap"><svg role="img" aria-label="Código QR ilustrativo de la compra" viewBox="-2 -2 33 33" shapeRendering="crispEdges"><rect x="-2" y="-2" width="33" height="33" fill="white"/><g fill="#1c1d1e">{celdas}</g></svg><small>QR de demostración · no válido para acceso real</small></div>;
}
