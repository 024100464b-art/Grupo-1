import React from 'react';
import { Vuelo } from '../types';
import SimuladorGemini from './SimuladorGemini';
import ProyeccionStaffing from './ProyeccionStaffing';

interface Props {
  vuelos: Vuelo[];
}

export default function MonitoreoView({ vuelos }: Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-2 border-b border-white/5">
        <h2 className="text-xl font-light text-white tracking-wide">Centro de Monitoreo</h2>
        <p className="text-xs text-gray-400 mt-1">
          Simulación predictiva de impacto operativo y proyección de personal de tierra.
        </p>
      </div>

      <SimuladorGemini />
      <ProyeccionStaffing vuelos={vuelos} />
    </div>
  );
}
