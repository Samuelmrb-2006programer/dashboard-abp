export default function Limitaciones() {
  return (
    <div className="limitaciones">
      <h2 className="panel-title">Limitaciones</h2>
      <p className="panel-sub">Lectura crítica del modelo y de los datos agregados.</p>
      <ul className="lista-limitaciones">
        <li><strong>K solo existe en semanas con entrega:</strong> la nota media semanal solo se observa cuando hay entregas, lo que introduce sesgo de selección y datos faltantes.</li>
        <li><strong>Clics ≠ estudio efectivo:</strong> la intensidad de actividad (S) se mide como clics normalizados, pero no todos los clics representan estudio genuino (pueden ser navegación superficial o accidental).</li>
        <li><strong>Agregación oculta diferencias individuales:</strong> los parámetros (a, b) se ajustan por grupo, pero dentro de cada grupo hay variabilidad individual que el modelo no captura.</li>
        <li><strong>Asociación no es causalidad:</strong> el modelo describe correlaciones entre actividad y desempeño, pero no establece relaciones causales (factores no observados como motivación o contexto pueden influir en ambos).</li>
        <li><strong>R² del grupo concentrado &lt; 0:</strong> el modelo tiene peor desempeño predictivo que usar la media, lo que sugiere que la dinámica de este grupo no sigue el patrón supuesto por la EDO.</li>
      </ul>
    </div>
  );
}
