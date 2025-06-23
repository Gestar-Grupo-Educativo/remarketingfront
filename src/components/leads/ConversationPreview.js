import React from 'react';

export default function ConversationPreview({ leadId }) {
  return (
    <div>
      <h3>Mensaje simulado para el Lead #{leadId}</h3>
      <p>(Acá se mostrará el mensaje generado por IA en función de la etapa)</p>
    </div>
  );
}
