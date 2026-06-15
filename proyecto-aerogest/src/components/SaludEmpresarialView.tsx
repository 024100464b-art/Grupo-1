import React, { useState } from 'react';
import { ScenarioData } from '../types';
import { Landmark, TrendingUp, ShieldAlert, Sparkles, DollarSign, Wallet } from 'lucide-react';

interface SaludEmpresarialViewProps {
  data: ScenarioData;
}

export default function SaludEmpresarialView({ data }: SaludEmpresarialViewProps) {
  const [selectedYearIdx, setSelectedYearIdx] = useState<number>(3); // Default 2024 proy
  const activeYear = data.historicYears[selectedYearIdx] || data.historicYears[3];

  // SVG Chart sizing
  const width = 600;
  const height = 180;
  const barPadding = 16;
  const maxRev = Math.max(...data.historicYears.map(y => y.revenue)) * 1.1;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Strategic Question */}
      <div className="pb-4 border-b border-white/5">
        <h3 className="font-sans text-xl font-light text-white tracking-wide">
          Salud Financiera & <span className="italic font-serif text-amber-500">Rentabilidad Corporativa</span>
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Rentabilidad integral basada en tarifas aeroportuarias de rampa, tasas TUA consolidadas y márgenes acumulados del área de retail.
        </p>
      </div>

      {/* Strategic KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {data.financialKpis.map((kpi, idx) => (
          <div key={idx} className="glass-card p-5 rounded-xl border border-white/5 bg-[#121214]/60 space-y-2">
            <div className="text-[9px] text-gray-500 uppercase font-mono tracking-widest font-bold">
              {kpi.label}
            </div>
            <div className="text-xl font-black text-white font-mono flex items-baseline gap-1">
              {kpi.value}
            </div>
            <p className="text-[11px] text-gray-450 leading-snug">
              {kpi.detail}
            </p>
            <div className="pt-2 flex items-center justify-between border-t border-white/5 text-[9px] font-mono uppercase">
              <span className="text-gray-500">Estado</span>
              <span className={
                kpi.status === 'favorable' ? 'text-emerald-400' :
                kpi.status === 'estable' ? 'text-yellow-500' :
                'text-red-400 animate-pulse-alert font-bold'
              }>
                ● {kpi.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Historical Track + Interactive details block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Historical bar graph rendered as clean custom vector SVGs */}
        <div className="col-span-1 lg:col-span-2 glass-card p-6 rounded-xl border border-white/5 bg-[#121214]/60 flex flex-col justify-between">
          <div className="space-y-1 mb-4">
            <span className="text-[9px] text-amber-500 font-mono tracking-widest uppercase font-bold">ESTRUCTURA HISTÓRICA</span>
            <h4 className="text-sm font-semibold text-white">Evolución de Ingresos Anuales e EBITDA (Millones USD)</h4>
            <p className="text-xs text-gray-400">Haga clic en un año para evaluar los indicadores estratégicos correspondientes.</p>
          </div>

          {/* SVG Custom Bars */}
          <div className="relative w-full py-4">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
              {/* Baseline */}
              <line x1="0" y1={height - 20} x2={width} y2={height - 20} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

              {data.historicYears.map((yearItem, idx) => {
                const numBars = data.historicYears.length;
                const colWidth = width / numBars;
                const barWidth = 45;
                const innerGap = 8;
                
                // Coordinates
                const x = idx * colWidth + colWidth / 2 - barWidth / 2;
                const revHeight = ((yearItem.revenue) / maxRev) * (height - 50);
                const marginHeight = ((yearItem.margin * yearItem.revenue / 100) / maxRev) * (height - 50);

                const yRev = height - 20 - revHeight;
                const yMargin = height - 20 - marginHeight;

                const isSelected = selectedYearIdx === idx;

                return (
                  <g key={idx} className="cursor-pointer group" onClick={() => setSelectedYearIdx(idx)}>
                    {/* Background glow for selected bar group */}
                    {isSelected && (
                      <rect 
                        x={idx * colWidth + 5} 
                        y={5} 
                        width={colWidth - 10} 
                        height={height - 10} 
                        fill="rgba(255,191,0,0.02)" 
                        stroke="rgba(255,191,0,0.08)" 
                        rx="8"
                      />
                    )}

                    {/* Revenue Bar */}
                    <rect 
                      x={x} 
                      y={yRev} 
                      width={barWidth} 
                      height={revHeight} 
                      fill={isSelected ? 'url(#barGoldSelected)' : 'rgba(255,255,255,0.06)'}
                      stroke={isSelected ? '#f59e0b' : 'rgba(255,255,255,0.15)'}
                      strokeWidth="1"
                      rx="2"
                      className="transition-all duration-300"
                    />

                    {/* EBITDA Margin Highlight Bar */}
                    <rect 
                      x={x + 10} 
                      y={yMargin} 
                      width={barWidth - 20} 
                      height={marginHeight} 
                      fill={isSelected ? '#f59e0b' : '#3b82f6'}
                      opacity={isSelected ? 1 : 0.4}
                      rx="1"
                      className="transition-all duration-300"
                    />

                    {/* Value displays on hovering / selection */}
                    <text 
                      x={x + barWidth / 2} 
                      y={yRev - 8} 
                      fill="#ffffff" 
                      fontSize="9" 
                      fontFamily="monospace"
                      textAnchor="middle" 
                      fontWeight={isSelected ? 'bold' : 'normal'}
                    >
                      ${yearItem.revenue}M
                    </text>

                    {/* Month Label */}
                    <text 
                      x={x + barWidth / 2} 
                      y={height - 5} 
                      fill={isSelected ? '#f59e0b' : 'rgba(255,255,255,0.4)'} 
                      fontSize="10" 
                      fontFamily="monospace"
                      textAnchor="middle"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                    >
                      {yearItem.year} {isSelected && '★'}
                    </text>
                  </g>
                );
              })}

              <defs>
                <linearGradient id="barGoldSelected" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3f2b0f" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono mt-2 border-t border-white/5 pt-3">
            <span className="flex items-center gap-1"><span className="w-2.5 h-1.5 bg-[#3b82f6] inline-block opacity-40" /> Margen EBITDA</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-1.5 bg-[#f59e0b] inline-block opacity-50" /> Ingresos Totales de Concesión</span>
            <span>Unidades: Millones USD</span>
          </div>
        </div>

        {/* Selected Year Strategic Details */}
        <div className="glass-card p-6 rounded-xl border border-white/5 bg-[#121214]/60 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-[9px] text-amber-500 font-mono tracking-widest uppercase font-bold">DETALLE SELECCIONADO</span>
              <h4 className="text-xl font-bold text-white font-mono">{activeYear.year} <span className="text-xs uppercase text-gray-500">Métricas</span></h4>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Ingresos Totales:</span>
                <span className="text-white font-bold">${activeYear.revenue}M USD</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Margen EBITDA Medio:</span>
                <span className="text-amber-500 font-bold">{activeYear.margin}%</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">EBITDA Neto Equivalente:</span>
                <span className="text-white font-bold">${(activeYear.revenue * activeYear.margin / 100).toFixed(1)}M USD</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Flujo de Pasajeros Anual:</span>
                <span className="text-emerald-400 font-bold">{activeYear.passengers.toFixed(2)}M PAX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Regulación DGAC/CORPAC:</span>
                <span className="text-emerald-400 font-bold">100% Conforme</span>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.01] p-3 rounded-lg border border-white/5 text-[10px] text-gray-400 font-mono leading-normal mt-4">
            <strong>Brecha del Año:</strong> {activeYear.year === '2024 (Proy)' ? 
              'Proyección corporativa sujeta al factor de estabilidad cambiaria regional.' : 
              'Datos contables consolidados y auditados de acuerdo a la ley de concesiones del Perú.'
            }
          </div>
        </div>

      </div>

      {/* Cost, Margin & EBITDA breakdown by Quarters */}
      <div className="glass-card p-6 rounded-xl border border-white/5 bg-[#121214]/60">
        <h4 className="text-sm font-semibold text-white mb-4">Análisis Trimestral Consolidado del EBITDA (Año Actual)</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {data.quarterlyRevenue.map((q, idx) => (
            <div key={idx} className="bg-white/[0.01] p-4 rounded-xl border border-white/5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 font-mono">{q.quarter}</span>
                <span className="text-[10px] font-bold text-amber-500 font-mono">{q.margin}% Margin</span>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-gray-500 uppercase font-mono">Facturación bruta</div>
                <div className="text-lg font-black text-white font-mono">${q.revenue}M USD</div>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-300" 
                  style={{ width: `${q.margin}%` }}
                />
              </div>
              <div className="text-[10px] text-gray-450 font-mono flex justify-between">
                <span>EBITDA Directo:</span>
                <span className="text-white font-bold">${(q.revenue * q.margin / 100).toFixed(2)}M</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
