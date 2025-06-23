import { useEffect, useState } from 'react';

export default function Stats() {
  const [cursos, setCursos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [fechaHasta, setFechaHasta] = useState(() => new Date().toISOString().split("T")[0]);
  const [fechaDesde, setFechaDesde] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 15);
    return d.toISOString().split("T")[0];
  });
  const [buscar, setBuscar] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [ordenarPor, setOrdenarPor] = useState(null);
  const [ordenDesc, setOrdenDesc] = useState(false);

const handleOrdenar = (columna) => {
  if (ordenarPor === columna) {
    setOrdenDesc(!ordenDesc);
  } else {
    setOrdenarPor(columna);
    setOrdenDesc(false);
  }
};


  useEffect(() => {
    const fetchData = async () => {
      const query = new URLSearchParams();
      if (fechaDesde) query.append('start_date', fechaDesde);
      if (fechaHasta) query.append('end_date', fechaHasta);

      try {
        setCargando(true);
        const response = await fetch(`http://localhost:5000/api/stats/?${query.toString()}`);
        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error("⚠️ El backend no devolvió un array:", data);
          return;
        }

        setCursos(data);
      } catch (error) {
        console.error("❌ Error al cargar stats:", error);
      } finally {
        setBuscar(false);
        setCargando(false);
      }
    };

    if (buscar) fetchData();
  }, [buscar, fechaDesde, fechaHasta]);

  const cursosFiltrados = [...cursos]
  .filter(c => (c?.NombreCurso || '').toLowerCase().includes(busqueda.toLowerCase()))
  .sort((a, b) => {
    if (!ordenarPor) return 0;

    const aVal = a[ordenarPor] ?? 0;
    const bVal = b[ordenarPor] ?? 0;

    if (typeof aVal === 'string') {
      return ordenDesc
        ? bVal.localeCompare(aVal)
        : aVal.localeCompare(bVal);
    }

    return ordenDesc ? bVal - aVal : aVal - bVal;
  });


  return (
    <div>
      <h2>📊 Estadísticas de Conversión</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Buscar curso..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ marginRight: "10px", padding: "0.5rem" }}
        />
        <label>
          Desde:
          <input
            type="date"
            value={fechaDesde}
            onChange={e => setFechaDesde(e.target.value)}
            style={{ marginLeft: "5px", marginRight: "10px" }}
          />
        </label>
        <label>
          Hasta:
          <input
            type="date"
            value={fechaHasta}
            onChange={e => setFechaHasta(e.target.value)}
            style={{ marginLeft: "5px", marginRight: "10px" }}
          />
        </label>
        <button
          onClick={() => setBuscar(true)}
          style={{ marginLeft: "10px", padding: "0.5rem 1rem" }}
        >
          Aplicar filtro
        </button>
      </div>

      {cargando ? (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <div className="spinner" style={{
            width: "40px",
            height: "40px",
            border: "4px solid #ccc",
            borderTop: "4px solid #333",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto"
          }} />
          <p style={{ marginTop: "1rem" }}>Cargando datos...</p>
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid gray" }}>
              <th onClick={() => handleOrdenar("NombreCurso")}>Curso</th>
              <th onClick={() => handleOrdenar("CERRADO")}>Ventas</th>
              <th onClick={() => handleOrdenar("PENDIENTE")}>Pendientes</th>
              <th onClick={() => handleOrdenar("RECHAZADA")}>Rechazados</th>
              <th onClick={() => handleOrdenar("Tasa_de_venta")}>Tasa de venta</th>
              <th onClick={() => handleOrdenar("Precio_promedio")}>Precio promedio</th>
              <th onClick={() => handleOrdenar("costoAds")}>Costo Ads</th>
              <th onClick={() => handleOrdenar("Costo_por_Lead")}>Costo por lead</th>
              <th onClick={() => handleOrdenar("ROI")}>ROI</th>
            </tr>
          </thead>
          <tbody>
            {cursosFiltrados.map((c, idx) => {
              const cerrados = Number(c.CERRADO || 0);
              const pendientes = Number(c.PENDIENTE || 0);
              const rechazados = Number(c.RECHAZADA || 0);
              const precio = Number(c.Precio_promedio || 0);
              const ads = Number(c.costoAds || 0);
              const leads = cerrados + pendientes + rechazados;
              const costoPorLead = Number(c.Costo_por_Lead || 0);

              const tasa = leads > 0 ? ((cerrados / leads) * 100).toFixed(1) + '%' : '-';
              const ingresos = cerrados * precio;
              const roi = typeof c.ROI === "number" ? (c.ROI * 100).toFixed(1) + "%" : "-";


              return (
                <tr key={idx} style={{ borderBottom: "1px solid #444" }}>
                  <td>{c.NombreCurso}</td>
                  <td>{cerrados}</td>
                  <td>{pendientes}</td>
                  <td>{rechazados}</td>
                  <td>{tasa}</td>
                  <td>${Math.round(precio).toLocaleString()}</td>
                  <td>${Math.round(ads).toLocaleString()}</td>
                  <td>${Math.round(costoPorLead).toLocaleString()}</td>
                  <td>{roi}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
