import { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { simularK, rmse, r2 } from '../model';
import { GRUPOS } from '../data';

const PALETA = {
  bajo: '#ffb020',
  constante: '#00cfe0',
  concentrado: '#e843d0'
};

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

const rellenoSlider = (v, min, max) => {
  const pct = ((v - min) / (max - min)) * 100;
  return {
    background: `linear-gradient(to right, var(--acento) 0%, var(--acento) ${pct}%, var(--track) ${pct}%, var(--track) 100%) no-repeat center / 100% 4px`
  };
};

export default function ModeloVsDatos({ datos }) {
  const [grupo, setGrupo] = useState('bajo');
  const params = GRUPOS[grupo];
  
  const [a, setA] = useState(params.a);
  const [b, setB] = useState(params.b);
  const [K0, setK0] = useState(params.K0);

  useEffect(() => {
    setA(params.a);
    setB(params.b);
    setK0(params.K0);
  }, [grupo, params]);

  const datosGrupo = useMemo(() => {
    return datos.filter(d => d.grupo === grupo)
      .sort((x, y) => x.semana - y.semana);
  }, [datos, grupo]);

  const S_array = useMemo(() => {
    return datosGrupo.map(d => d.S);
  }, [datosGrupo]);

  const K_predicho = useMemo(() => {
    return simularK(a, b, K0, S_array);
  }, [a, b, K0, S_array]);

  const K_observado = useMemo(() => {
    return datosGrupo.map(d => d.K);
  }, [datosGrupo]);

  const metricas = useMemo(() => {
    return {
      rmse: rmse(K_observado, K_predicho).toFixed(2),
      r2: r2(K_observado, K_predicho).toFixed(2)
    };
  }, [K_observado, K_predicho]);

  const datosGrafica = useMemo(() => {
    return datosGrupo.map((d, i) => ({
      semana: d.semana,
      K_obs: d.K,
      K_pred: K_predicho[i]
    }));
  }, [datosGrupo, K_predicho]);

  const color = PALETA[grupo];
  const r2Negativo = parseFloat(metricas.r2) < 0;

  return (
    <div className="modelo-vs-datos">
      <div className="controles">
        <label>
          <span className="control-nombre">Grupo</span>
          <select value={grupo} aria-label="Selecciona el grupo a visualizar" onChange={e => setGrupo(e.target.value)}>
            <option value="bajo">Bajo</option>
            <option value="constante">Constante</option>
            <option value="concentrado">Concentrado</option>
          </select>
        </label>
        <label>
          <span className="control-nombre">a (tasa aprendizaje)</span>
          <span className="valor-slider">{a.toFixed(2)}</span>
          <input type="range" aria-label="a, tasa de aprendizaje" min="0" max="5" step="0.01" value={a} style={rellenoSlider(a, 0, 5)} onChange={e => setA(+e.target.value)} />
        </label>
        <label>
          <span className="control-nombre">b (tasa olvido)</span>
          <span className="valor-slider">{b.toFixed(2)}</span>
          <input type="range" aria-label="b, tasa de olvido" min="0" max="0.2" step="0.001" value={b} style={rellenoSlider(b, 0, 0.2)} onChange={e => setB(+e.target.value)} />
        </label>
        <label>
          <span className="control-nombre">K0 (nota inicial)</span>
          <span className="valor-slider">{K0.toFixed(2)}</span>
          <input type="range" aria-label="K0, nota inicial" min="0" max="1" step="0.01" value={K0} style={rellenoSlider(K0, 0, 1)} onChange={e => setK0(+e.target.value)} />
        </label>
        <button onClick={() => { setA(params.a); setB(params.b); setK0(params.K0); }}>
          Restablecer ajuste
        </button>
      </div>
      <div className="metricas">
        <div className="metrica">
          <span className="metrica-label">RMSE</span>
          <strong className="metrica-valor">{metricas.rmse}</strong>
        </div>
        <div className="metrica">
          <span className="metrica-label">R²</span>
          <strong className={`metrica-valor${r2Negativo ? ' es-negativo' : ''}`}>{metricas.r2}</strong>
          {r2Negativo && (
            <span className="badge-alerta">
              <span aria-hidden="true">⚠</span> AJUSTE DÉBIL
            </span>
          )}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={datosGrafica} margin={{ top: 16, right: 16, bottom: 8, left: 0 }}>
          <defs>
            <filter id="glow-linea-modelo" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="2 6" vertical={false} />
          <XAxis dataKey="semana" tickLine={false} label={{ value: 'Semana', position: 'insideBottom', offset: -5 }} />
          <YAxis tickLine={false} label={{ value: 'K', angle: -90, position: 'insideLeft' }} domain={[0, 1]} />
          <Tooltip contentStyle={estiloTooltip} labelStyle={etiquetaTooltip} itemStyle={itemTooltip} />
          <Legend iconType="circle" />
          <Line name="K observado" legendType="circle" type="monotone" dataKey="K_obs" stroke={color} strokeWidth={0} dot={{ r: 4, fill: 'none', stroke: color, strokeWidth: 2 }} activeDot={{ r: 5, fill: 'none', stroke: color, strokeWidth: 2 }} connectNulls={false} />
          <Line name="K modelo" legendType="plainline" type="monotone" dataKey="K_pred" stroke={color} strokeWidth={2} dot={false} filter="url(#glow-linea-modelo)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
