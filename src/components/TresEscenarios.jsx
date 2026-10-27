import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { simularK, equilibrio } from '../model';

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

export default function TresEscenarios() {
  const [K0, setK0] = useState(0.85);
  const [a, setA] = useState(1.0);
  const [b, setB] = useState(0.03);
  const [S_const, setSConst] = useState(0.15);
  const [Salto, setSalto] = useState(0.4);
  const [Sbajo, setSbajo] = useState(0.08);
  const [t1, setT1] = useState(8);
  const [t2, setT2] = useState(20);

  const semanas = Array.from({ length: 33 }, (_, i) => i);

  const K_nulo = useMemo(() => {
    return semanas.map(t => K0 * Math.exp(-b * t));
  }, [K0, b, semanas]);

  const K_constante = useMemo(() => {
    const K_star = equilibrio(a, S_const, b);
    return semanas.map(t => K_star + (K0 - K_star) * Math.exp(-(a * S_const + b) * t));
  }, [K0, a, b, S_const, semanas]);

  const K_intensivo = useMemo(() => {
    const S_array = semanas.map(t => {
      if (t < t1) return Salto;
      if (t < t2) return Sbajo;
      return 0;
    });
    return simularK(a, b, K0, S_array);
  }, [a, b, K0, Salto, Sbajo, t1, t2, semanas]);

  const K_star = equilibrio(a, S_const, b);

  const datosGrafica = useMemo(() => {
    return semanas.map((t, i) => ({
      semana: t,
      nulo: K_nulo[i],
      constante: K_constante[i],
      intensivo: K_intensivo[i]
    }));
  }, [semanas, K_nulo, K_constante, K_intensivo]);

  return (
    <div className="tres-escenarios">
      <div className="controles">
        <label>
          <span className="control-nombre">K0 (nota inicial)</span>
          <span className="valor-slider">{K0.toFixed(2)}</span>
          <input type="range" aria-label="K0, nota inicial" min="0" max="1" step="0.01" value={K0} style={rellenoSlider(K0, 0, 1)} onChange={e => setK0(+e.target.value)} />
        </label>
        <label>
          <span className="control-nombre">a (tasa aprendizaje)</span>
          <span className="valor-slider">{a.toFixed(2)}</span>
          <input type="range" aria-label="a, tasa de aprendizaje" min="0" max="5" step="0.01" value={a} style={rellenoSlider(a, 0, 5)} onChange={e => setA(+e.target.value)} />
        </label>
        <label>
          <span className="control-nombre">b (tasa olvido)</span>
          <span className="valor-slider">{b.toFixed(3)}</span>
          <input type="range" aria-label="b, tasa de olvido" min="0" max="0.2" step="0.001" value={b} style={rellenoSlider(b, 0, 0.2)} onChange={e => setB(+e.target.value)} />
        </label>
        <label>
          <span className="control-nombre">S constante</span>
          <span className="valor-slider">{S_const.toFixed(2)}</span>
          <input type="range" aria-label="S del escenario de estudio constante" min="0" max="0.5" step="0.01" value={S_const} style={rellenoSlider(S_const, 0, 0.5)} onChange={e => setSConst(+e.target.value)} />
        </label>
        <label>
          <span className="control-nombre">Salto</span>
          <span className="valor-slider">{Salto.toFixed(2)}</span>
          <input type="range" aria-label="Salto de intensidad del escenario intensivo" min="0" max="0.5" step="0.01" value={Salto} style={rellenoSlider(Salto, 0, 0.5)} onChange={e => setSalto(+e.target.value)} />
        </label>
        <label>
          <span className="control-nombre">Sbajo</span>
          <span className="valor-slider">{Sbajo.toFixed(2)}</span>
          <input type="range" aria-label="S bajo del escenario intensivo" min="0" max="0.5" step="0.01" value={Sbajo} style={rellenoSlider(Sbajo, 0, 0.5)} onChange={e => setSbajo(+e.target.value)} />
        </label>
        <label>
          <span className="control-nombre">t1 (fin salto)</span>
          <span className="valor-slider">{t1}</span>
          <input type="range" aria-label="Semana t1, fin del salto de intensidad" min="0" max="32" step="1" value={t1} style={rellenoSlider(t1, 0, 32)} onChange={e => setT1(+e.target.value)} />
        </label>
        <label>
          <span className="control-nombre">t2 (fin estudio)</span>
          <span className="valor-slider">{t2}</span>
          <input type="range" aria-label="Semana t2, fin del estudio" min="0" max="32" step="1" value={t2} style={rellenoSlider(t2, 0, 32)} onChange={e => setT2(+e.target.value)} />
        </label>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={datosGrafica} margin={{ top: 16, right: 16, bottom: 8, left: 0 }}>
          <defs>
            <filter id="glow-linea-escenario" x="-20%" y="-20%" width="140%" height="140%">
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
          <Legend iconType="plainline" />
          <Line name="Estudio nulo" type="monotone" dataKey="nulo" stroke="#5c6f87" strokeWidth={1.5} strokeDasharray="6 4" dot={false} />
          <Line name="Estudio constante" type="monotone" dataKey="constante" stroke="#00cfe0" strokeWidth={2} dot={false} filter="url(#glow-linea-escenario)" />
          <Line name="Estudio intensivo" type="monotone" dataKey="intensivo" stroke="#ffb020" strokeWidth={2} dot={false} filter="url(#glow-linea-escenario)" />
          <ReferenceLine y={K_star} stroke="#8fa3bd" strokeDasharray="4 4" label={`K* = ${K_star.toFixed(2)}`} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
