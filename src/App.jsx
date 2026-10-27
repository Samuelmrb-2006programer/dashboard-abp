import { useState, useEffect, useMemo } from 'react';
import Resumen from './components/Resumen';
import ModeloVsDatos from './components/ModeloVsDatos';
import TresEscenarios from './components/TresEscenarios';
import ComparacionGrupos from './components/ComparacionGrupos';
import Limitaciones from './components/Limitaciones';
import './index.css';

function App() {
  const [pestañaActiva, setPestañaActiva] = useState('resumen');
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/oulad_grupo_semana.json')
      .then(res => {
        if (!res.ok) throw new Error('No se pudo cargar el archivo de datos');
        return res.json();
      })
      .then(data => {
        setDatos(data);
        setCargando(false);
      })
      .catch(err => {
        setError(err.message);
        setCargando(false);
      });
  }, []);

  const generarDatosEjemplo = () => {
    const datosEjemplo = [];
    const grupos = [
      { nombre: 'bajo', S: 0.05, a: 2.2368, b: 0.0382, K0: 0.8303 },
      { nombre: 'constante', S: 0.16, a: 0.7166, b: 0.0291, K0: 0.8701 },
      { nombre: 'concentrado', S: 0.07, a: 1.6776, b: 0.0380, K0: 0.9056 }
    ];
    
    grupos.forEach(grupo => {
      for (let semana = 0; semana < 33; semana++) {
        const K = semana === 0 ? grupo.K0 : grupo.K0 * Math.exp(-grupo.b * semana);
        const clics = Math.round(100 + Math.random() * 80);
        const entregas = semana % 3 === 0 ? 0 : Math.floor(1 + Math.random() * 4);
        datosEjemplo.push({
          grupo: grupo.nombre,
          semana,
          S: grupo.S,
          K: semana % 4 === 0 ? null : +(K + (Math.random() - 0.5) * 0.1).toFixed(2),
          clics,
          entregas
        });
      }
    });
    return datosEjemplo;
  };

  const datosFinales = useMemo(() => {
    if (datos) return datos;
    if (error) return generarDatosEjemplo();
    return null;
  }, [datos, error]);

  if (cargando) return <div className="cargando">Cargando datos...</div>;

  return (
    <div className="dashboard">
      <header>
        <h1>Dashboard ABP: Dinámica del Aprendizaje con EDO</h1>
        <p>Modelado de la dinámica del aprendizaje con Ecuaciones Diferenciales Ordinarias y Machine Learning</p>
        <div className="estado-sistema" role="status">
          <span className="led" aria-hidden="true"></span>SISTEMA ACTIVO · OULAD 2013J
        </div>
      </header>
      
      {error && (
        <div className="aviso-error">
          <p>⚠️ {error}. Mostrando datos de ejemplo.</p>
        </div>
      )}
      
      <nav className="pestañas" role="tablist" aria-label="Secciones del dashboard">
        <button 
          type="button"
          role="tab"
          aria-selected={pestañaActiva === 'resumen'}
          className={pestañaActiva === 'resumen' ? 'activa' : ''}
          onClick={() => setPestañaActiva('resumen')}
        >
          Resumen
        </button>
        <button 
          type="button"
          role="tab"
          aria-selected={pestañaActiva === 'modelo'}
          className={pestañaActiva === 'modelo' ? 'activa' : ''}
          onClick={() => setPestañaActiva('modelo')}
        >
          Modelo vs datos
        </button>
        <button 
          type="button"
          role="tab"
          aria-selected={pestañaActiva === 'escenarios'}
          className={pestañaActiva === 'escenarios' ? 'activa' : ''}
          onClick={() => setPestañaActiva('escenarios')}
        >
          Tres escenarios
        </button>
        <button 
          type="button"
          role="tab"
          aria-selected={pestañaActiva === 'comparacion'}
          className={pestañaActiva === 'comparacion' ? 'activa' : ''}
          onClick={() => setPestañaActiva('comparacion')}
        >
          Comparación de grupos
        </button>
        <button 
          type="button"
          role="tab"
          aria-selected={pestañaActiva === 'limitaciones'}
          className={pestañaActiva === 'limitaciones' ? 'activa' : ''}
          onClick={() => setPestañaActiva('limitaciones')}
        >
          Limitaciones
        </button>
      </nav>
      
      <main className="panel" key={pestañaActiva}>
        {pestañaActiva === 'resumen' && <Resumen />}
        {pestañaActiva === 'modelo' && datosFinales && <ModeloVsDatos datos={datosFinales} />}
        {pestañaActiva === 'escenarios' && <TresEscenarios />}
        {pestañaActiva === 'comparacion' && <ComparacionGrupos />}
        {pestañaActiva === 'limitaciones' && <Limitaciones />}
      </main>
    </div>
  );
}

export default App;
