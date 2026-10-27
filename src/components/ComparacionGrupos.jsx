import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { GRUPOS } from '../data';

const PALETA = {
  bajo: '#ffb020',
  constante: '#00cfe0',
  concentrado: '#e843d0'
};

const NEGATIVO = '#ff5c5c';

const estiloTooltip = {
  backgroundColor: 'rgba(8, 13, 24, 0.88)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 229, 255, 0.45)',
  borderRadius: 4,
  boxShadow: '0 0 20px rgba(0, 229, 255, 0.12), 0 12px 32px rgba(0, 0, 0, 0.5)',
  padding: '10px 14px'
};

const etiquetaTooltip = {
  color: 'var(--texto-sec)',
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  marginBottom: 6
};

const itemTooltip = {
  color: 'var(--texto)',
  fontFamily: 'var(--font-mono)',
  fontSize: 12.5,
  padding: '3px 0'
};

export default function ComparacionGrupos() {
  const datos = Object.entries(GRUPOS).map(([nombre, params]) => ({
    nombre,
    ...params
  }));

  const datosBarras = datos.map(d => ({
    grupo: d.nombre,
    R2: d.R2,
    fill: d.R2 < 0 ? NEGATIVO : PALETA[d.nombre]
  }));

  return (
    <div className="comparacion-grupos">
      <h3>Parámetros por grupo</h3>
      <div className="tabla-scroll">
        <table className="tabla-parametros">
          <thead>
            <tr>
              <th>Grupo</th>
              <th className="num">S</th>
              <th className="num">K</th>
              <th className="num">K0</th>
              <th className="num">a</th>
              <th className="num">b</th>
              <th className="num">RMSE</th>
              <th className="num">R²</th>
            </tr>
          </thead>
          <tbody>
            {datos.map(d => (
              <tr key={d.nombre}>
                <td><span className="color-indicator" style={{ background: PALETA[d.nombre], color: PALETA[d.nombre] }}></span>{d.nombre}</td>
                <td className="num">{d.S.toFixed(2)}</td>
                <td className="num">{d.K.toFixed(2)}</td>
                <td className="num">{d.K0.toFixed(2)}</td>
                <td className="num">{d.a.toFixed(2)}</td>
                <td className="num">{d.b.toFixed(2)}</td>
                <td className="num">{d.RMSE.toFixed(2)}</td>
                <td className={`num${d.R2 < 0 ? ' r2-negativo' : ''}`}>
                  {d.R2 < 0 && <span className="icono-alerta" role="img" aria-label="alerta">⚠</span>}
                  {d.R2.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3>Coeficiente de determinación (R²)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datosBarras} margin={{ top: 16, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="2 6" vertical={false} />
          <XAxis dataKey="grupo" tickLine={false} tickFormatter={g => g.charAt(0).toUpperCase() + g.slice(1)} label={{ value: 'Grupo', position: 'insideBottom', offset: -5 }} />
          <YAxis tickLine={false} label={{ value: 'R²', angle: -90, position: 'insideLeft' }} />
          <Tooltip contentStyle={estiloTooltip} labelStyle={etiquetaTooltip} itemStyle={itemTooltip} />
          <Legend iconType="square" />
          <Bar dataKey="R2" name="R²" radius={[3, 3, 0, 0]}>
            {datosBarras.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
