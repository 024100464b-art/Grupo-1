import React, { useState } from 'react';
import { ScenarioData, StrategicRisk } from '../types';
import { ShieldAlert, AlertTriangle, Info, Eye, CheckCircle } from 'lucide-react';

interface RiesgosEstrategicosViewProps {
  data: ScenarioData;
}

export default function RiesgosEstrategicosView({ data }: RiesgosEstrategicosViewProps) {
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  
  // Find currently selected risk details
  const activeRisk = data.risks.find(r => r.id === selectedRiskId) || data.risks[0];

  // Helper colors for Stoplight Levels (Impact & Severity rating)
  const getImpactBadgeStyle = (impact: StrategicRisk['impact']) => {
    switch (impact) {
      case 'Crítico': return 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.2)] font-bold';
      case 'Alto': return 'bg-amber-500/10 text-amber-400 border border-amber-500/25';
      case 'Medio': return 'bg-blue-500/10 text-blue-400 border border-blue-500/25';
      default: return 'bg-gray-500/10 text-gray-400 border border-gray-500/25';
    }
  };

  const getStateBadgeStyle = (state: StrategicRisk['state']) => {
    switch (state) {
      case 'Activo': return 'bg-red-500/5 text-red-400 border border-red-500/15 animate-pulse-live';
      case 'Monitoreado': return 'bg-yellow-500/5 text-yellow-400 border border-yellow-500/15';
      case 'Mitigado': return 'bg-emerald-500/5 text-emerald-400 border border-emerald-500/15';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Strategic Question */}
      <div className="pb-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-sans text-xl font-light text-white tracking-wide">
            Mapa de Riesgos Financieros & <span className="italic font-serif text-amber-500">Sustentabilidad del Aeropuerto</span>
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Análisis preventivo de amenazas a largo plazo para salvaguardar el EBITDA corporativo y optimizar la capacidad operativa física.
          </p>
        </div>
        <div className="bg-white/[0.02] border border-white/5 p-2 rounded text-[10px] text-gray-400 font-mono flex items-center gap-1.5 max-w-sm">
          <Info size={14} className="text-amber-500 flex-shrink-0" />
          <span>No formulamos dictámenes ni simulamos decisiones automáticas: solo se provee visualización clave de riesgos para la evaluación del Directorio Humano.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Heatmap Matrix */}
        <div className="lg:col-span-1 glass-card p-6 rounded-xl border border-white/5 bg-[#121214]/60 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[9px] text-amber-500 font-mono tracking-widest uppercase font-bold">MATRIZ DE RIESGO 3x3</span>
            <h4 className="text-sm font-semibold text-white">Severidad de Amenazas Estratégicas</h4>
            <p className="text-xs text-gray-450 mt-1">Impacto vs Probabilidad de ocurrencia</p>
          </div>

          {/* Matrix Grid mockup styled perfectly */}
          <div className="space-y-2 py-4">
            <div className="grid grid-cols-4 gap-2">
              <div className="text-[10px] text-gray-500 flex items-center justify-center font-mono uppercase font-bold">Imp / Prob</div>
              <div className="text-[9px] text-gray-500 text-center font-mono">PROB. BAJA</div>
              <div className="text-[9px] text-gray-500 text-center font-mono">PROB. MEDIA</div>
              <div className="text-[9px] text-gray-500 text-center font-mono">PROB. ALTA</div>
            </div>

            {/* Row Critical */}
            <div className="grid grid-cols-4 gap-2 h-14">
              <div className="text-[9px] text-red-400 font-bold font-mono flex items-center justify-end pr-2 uppercase">CRÍTICO</div>
              <div className="bg-yellow-500/10 rounded border border-yellow-500/20 flex items-center justify-center text-[10px] font-mono text-yellow-500">
                -
              </div>
              <div className="bg-orange-500/15 rounded border border-orange-500/25 flex items-center justify-center text-[10px] font-mono text-orange-400 font-bold">
                {data.risks.filter(r => r.impact === 'Crítico' && r.probability === 'Media').length}
              </div>
              <div className="bg-red-500/20 rounded border border-red-500/30 flex items-center justify-center text-[10px] font-mono text-red-400 font-bold animate-pulse-alert">
                {data.risks.filter(r => r.impact === 'Crítico' && r.probability === 'Alta').length}
              </div>
            </div>

            {/* Row Alto */}
            <div className="grid grid-cols-4 gap-2 h-14">
              <div className="text-[9px] text-amber-500 font-mono flex items-center justify-end pr-2 uppercase">ALTO</div>
              <div className="bg-emerald-500/10 rounded border border-emerald-500/20 flex items-center justify-center text-[10px] font-mono text-emerald-400">
                -
              </div>
              <div className="bg-yellow-500/15 rounded border border-yellow-500/25 flex items-center justify-center text-[10px] font-mono text-yellow-400 font-bold">
                {data.risks.filter(r => r.impact === 'Alto' && r.probability === 'Media').length}
              </div>
              <div className="bg-orange-500/15 rounded border border-orange-500/25 flex items-center justify-center text-[10px] font-mono text-orange-400 font-bold">
                {data.risks.filter(r => r.impact === 'Alto' && r.probability === 'Alta').length}
              </div>
            </div>

            {/* Row Bajo/Medio */}
            <div className="grid grid-cols-4 gap-2 h-14">
              <div className="text-[9px] text-gray-500 font-mono flex items-center justify-end pr-2 uppercase">MEDIO / B</div>
              <div className="bg-emerald-500/5 rounded border border-emerald-500/15 flex items-center justify-center text-[10px] font-mono text-gray-400">
                {data.risks.filter(r => r.impact === 'Bajo' && r.probability === 'Baja').length}
              </div>
              <div className="bg-emerald-500/10 rounded border border-emerald-500/20 flex items-center justify-center text-[10px] font-mono text-emerald-400">
                {data.risks.filter(r => r.impact === 'Bajo' && r.probability === 'Media').length}
              </div>
              <div className="bg-yellow-500/15 rounded border border-yellow-500/25 flex items-center justify-center text-[10px] font-mono text-yellow-500">
                -
              </div>
            </div>
          </div>

          <div className="p-3 bg-white/[0.01] rounded-lg border border-white/5 text-[9px] text-gray-450 leading-relaxed font-mono">
            <strong>Explicación:</strong> Los cuadrantes superiores derechos concentran los riesgos que exigen un plan inmediato del directorio de Cusco para resguardar la continuidad de slots.
          </div>
        </div>

        {/* List of Risks and active display card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-6 rounded-xl border border-white/5 bg-[#121214]/60 space-y-4">
            <div>
              <span className="text-[9px] text-amber-500 font-mono tracking-widest uppercase font-bold">MAPA INTEGRAL DE ALERTAS</span>
              <h4 className="text-sm font-semibold text-white">Cartera de Riesgos Corporativos Identificados en Sala</h4>
              <p className="text-xs text-gray-400">Haga clic sobre cualquier riesgo para ver el análisis detallado de tendencia e impacto.</p>
            </div>

            <div className="space-y-3">
              {data.risks.map((risk) => {
                const isSelected = selectedRiskId === risk.id || (!selectedRiskId && activeRisk?.id === risk.id);
                return (
                  <div
                    key={risk.id}
                    onClick={() => setSelectedRiskId(risk.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-amber-500/[0.02] border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.06)]' 
                        : 'bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-gray-500 font-mono uppercase tracking-wider">{risk.category}</span>
                        <h5 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                          {isSelected && <span className="text-amber-500 font-bold">▶</span>}
                          {risk.name}
                        </h5>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono uppercase ${getImpactBadgeStyle(risk.impact)}`}>
                          Impacto: {risk.impact}
                        </span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono uppercase ${getStateBadgeStyle(risk.state)}`}>
                          {risk.state}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Selected Risk Deep Analysis (B School Case Style) */}
      {activeRisk && (
        <div className="glass-card p-6 rounded-xl border border-white/5 bg-[#121214]/60 space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <div>
              <span className="text-[9px] text-amber-500 font-mono tracking-widest uppercase font-bold">ZOOM AL VECTOR DE RIESGO SELECCIONADO</span>
              <h4 className="text-base font-bold text-white font-mono">{activeRisk.name}</h4>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded font-bold uppercase font-mono ${getImpactBadgeStyle(activeRisk.impact)}`}>
              Impacto {activeRisk.impact}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 space-y-2">
              <span className="text-[10px] text-gray-500 uppercase font-mono block">Descripción y Contexto y Efecto Financiero</span>
              <p className="text-xs text-gray-300 leading-relaxed">
                {activeRisk.description}
              </p>
            </div>

            <div className="bg-white/[0.01] p-4 rounded-xl border border-white/5 space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Probabilidad:</span>
                <span className="text-white font-bold">{activeRisk.probability}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tendencia:</span>
                <span className={`font-bold ${
                  activeRisk.trend === 'Creciente' ? 'text-red-400' :
                  activeRisk.trend === 'Estable' ? 'text-yellow-500' :
                  'text-emerald-400'
                }`}>{activeRisk.trend}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Monitoreo:</span>
                <span className="text-white font-bold">{activeRisk.state}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
