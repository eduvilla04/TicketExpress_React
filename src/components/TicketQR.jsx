import { useMemo } from 'react';
import QRCode from '../vendor/qr/index.js';
import Nivel from '../vendor/qr/QRErrorCorrectLevel.js';

export default function TicketQR({ codigo }) {
  const qr = useMemo(() => {
    const codigoQR = new QRCode(0, Nivel.M);
    codigoQR.addData(codigo);
    codigoQR.make();
    const lado = codigoQR.getModuleCount();
    const modulos = [];
    for (let fila = 0; fila < lado; fila++) {
      for (let columna = 0; columna < lado; columna++) {
        if (codigoQR.isDark(fila, columna)) modulos.push(`${columna},${fila}`);
      }
    }
    return { lado, modulos };
  }, [codigo]);

  return <div className="qr-wrap">
    <svg role="img" aria-label={`Código QR del boleto ${codigo}`} viewBox={`-4 -4 ${qr.lado + 8} ${qr.lado + 8}`} shapeRendering="crispEdges">
      <rect x="-4" y="-4" width={qr.lado + 8} height={qr.lado + 8} fill="white" />
      <g fill="#1c1d1e">
        {qr.modulos.map(valor => {
          const [x, y] = valor.split(',');
          return <rect key={valor} x={Number(x)} y={Number(y)} width="1" height="1"/>;
        })}
      </g>
    </svg>
    <small>QR de demostración · identificador escaneable</small>
  </div>;
}
