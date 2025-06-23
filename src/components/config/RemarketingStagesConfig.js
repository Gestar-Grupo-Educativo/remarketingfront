import React, { useState, useEffect } from 'react';

// Lista de cursos simulada por ahora
const cursosDisponibles = [
  { id: 1, nombre: "Asistente de Farmacia" },
  { id: 2, nombre: "Marketing Digital" },
  { id: 3, nombre: "Diseño UX/UI" },
  { id: 4, nombre: "Programación Web" }
];

export default function RemarketingStagesConfig() {
  const [etapas, setEtapas] = useState(() => {
    const saved = localStorage.getItem("etapas_remarketing");
    return saved ? JSON.parse(saved) : [];
  });

  const [nuevaEtapa, setNuevaEtapa] = useState({
    nombre: "",
    desde_dia: 1,
    hasta_dia: 3,
    prompt_wp: "",
    prompt_email: "",
    cursos: {
      modo: "incluir",
      lista: []
    }
  });

  const handleChange = (field, value) => {
    setNuevaEtapa(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCursosChange = (ids) => {
    setNuevaEtapa(prev => ({
      ...prev,
      cursos: {
        ...prev.cursos,
        lista: ids
      }
    }));
  };

  const handleGuardar = () => {
    const actualizadas = [...etapas, nuevaEtapa];
    setEtapas(actualizadas);
    localStorage.setItem("etapas_remarketing", JSON.stringify(actualizadas));
    setNuevaEtapa({
      nombre: "",
      desde_dia: 1,
      hasta_dia: 3,
      prompt_wp: "",
      prompt_email: "",
      cursos: { modo: "incluir", lista: [] }
    });
  };

  const handleEliminar = (index) => {
    const nuevas = etapas.filter((_, i) => i !== index);
    setEtapas(nuevas);
    localStorage.setItem("etapas_remarketing", JSON.stringify(nuevas));
  };

  return (
    <div>
      <h3>Etapas configuradas</h3>
      <ul>
        {etapas.map((etapa, index) => (
          <li key={index}>
            <strong>{etapa.nombre}</strong> ({etapa.desde_dia}–{etapa.hasta_dia} días)
            <br />
            WhatsApp: {etapa.prompt_wp.slice(0, 60)}...
            <br />
            Email: {etapa.prompt_email.slice(0, 60)}...
            <br />
            {etapa.cursos.modo === "incluir" ? "Solo para cursos: " : "Excluye cursos: "}
            {etapa.cursos.lista.map(id => cursosDisponibles.find(c => c.id === id)?.nombre).join(', ')}
            <br />
            <button onClick={() => handleEliminar(index)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <hr />
      <h3>Crear nueva etapa</h3>
      <input
        type="text"
        placeholder="Nombre"
        value={nuevaEtapa.nombre}
        onChange={e => handleChange("nombre", e.target.value)}
      /><br />

      <label>Días desde: </label>
      <input
        type="number"
        value={nuevaEtapa.desde_dia}
        onChange={e => handleChange("desde_dia", parseInt(e.target.value))}
      />
      <label> hasta: </label>
      <input
        type="number"
        value={nuevaEtapa.hasta_dia}
        onChange={e => handleChange("hasta_dia", parseInt(e.target.value))}
      /><br />

      <label>Prompt WhatsApp:</label><br />
      <textarea
        rows="3"
        value={nuevaEtapa.prompt_wp}
        onChange={e => handleChange("prompt_wp", e.target.value)}
      /><br />

      <label>Prompt Email:</label><br />
      <textarea
        rows="3"
        value={nuevaEtapa.prompt_email}
        onChange={e => handleChange("prompt_email", e.target.value)}
      /><br />

      <label>Aplicar a cursos:</label><br />
      <select
        multiple
        value={nuevaEtapa.cursos.lista}
        onChange={(e) =>
          handleCursosChange(
            Array.from(e.target.selectedOptions, opt => parseInt(opt.value))
          )
        }
      >
        {cursosDisponibles.map(curso => (
          <option key={curso.id} value={curso.id}>{curso.nombre}</option>
        ))}
      </select>
      <br />
      <label>
        <input
          type="radio"
          checked={nuevaEtapa.cursos.modo === "incluir"}
          onChange={() =>
            setNuevaEtapa(prev => ({
              ...prev,
              cursos: { ...prev.cursos, modo: "incluir" }
            }))
          }
        />
        Incluir solo estos cursos
      </label>
      <br />
      <label>
        <input
          type="radio"
          checked={nuevaEtapa.cursos.modo === "excluir"}
          onChange={() =>
            setNuevaEtapa(prev => ({
              ...prev,
              cursos: { ...prev.cursos, modo: "excluir" }
            }))
          }
        />
        Excluir estos cursos
      </label>

      <br /><br />
      <button onClick={handleGuardar}>Guardar etapa</button>
    </div>
  );
}
