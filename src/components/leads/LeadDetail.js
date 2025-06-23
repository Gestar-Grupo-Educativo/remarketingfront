import React from 'react';
import { useParams } from 'react-router-dom';

export default function LeadDetail() {
  const { id } = useParams();

  return (
    <div>
      <h2>Detalle del Lead #{id}</h2>
      <p>(Aquí se mostrarán los datos completos del lead y el mensaje generado)</p>
    </div>
  );
}
