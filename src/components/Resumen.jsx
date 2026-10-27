import { COLORES_GRUPOS } from '../data';

export default function Resumen() {
  return (
    <div className="resumen">
      <h2 className="panel-title">Resumen</h2>
      <p className="panel-sub">Modelado de la dinámica del aprendizaje con EDO y Machine Learning sobre el dataset OULAD (presentación 2013J, semanas 0–32).</p>

      <div className="fila-tarjetas">
        <article className="tarjeta">
          <p className="eyebrow">Pregunta de investigación</p>
          <p>¿Cómo modelar la dinámica del aprendizaje de estudiantes en línea usando EDOs y Machine Learning, considerando diferentes patrones de actividad (bajo, constante, concentrado)?</p>
        </article>
        <article className="tarjeta">
          <p className="eyebrow">Objetivo general</p>
          <p>Desarrollar un modelo matemático basado en ecuaciones diferenciales ordinarias (EDO) que capture la evolución del desempeño académico (K) en función de la intensidad de actividad (S), validado con datos reales del dataset OULAD.</p>
        </article>
      </div>

      <div className="metricas">
        <div className="metrica">
          <span className="metrica-label">Registros</span>
          <span className="metrica-val">99</span>
        </div>
        <div className="metrica">
          <span className="metrica-label">Grupos</span>
          <span className="metrica-val">3</span>
        </div>
        <div className="metrica">
          <span className="metrica-label">Semanas</span>
          <span className="metrica-val">33</span>
        </div>
      </div>

      <article className="tarjeta">
        <p className="eyebrow">Modelo EDO</p>
        <p className="formula">dK/dt = a·S(t)·(M − K) − b·K, &nbsp;M = 1</p>
        <ul className="variables">
          <li><strong>K</strong> nota media semanal / 100 (proxy de desempeño)</li>
          <li><strong>S</strong> intensidad de actividad normalizada (clics / (7·115))</li>
          <li><strong>a</strong> tasa de aprendizaje (por semana)</li>
          <li><strong>b</strong> tasa de olvido (por semana)</li>
        </ul>
        <div className="leyenda-grupos">
          <span className="chip-grupo"><span className="punto" style={{ background: COLORES_GRUPOS.bajo }}></span>bajo</span>
          <span className="chip-grupo"><span className="punto" style={{ background: COLORES_GRUPOS.constante }}></span>constante</span>
          <span className="chip-grupo"><span className="punto" style={{ background: COLORES_GRUPOS.concentrado }}></span>concentrado</span>
        </div>
      </article>
    </div>
  );
}
