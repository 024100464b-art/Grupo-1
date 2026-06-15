import React, { useState } from 'react';
import { MonthlyPassengerData, AirlineShare } from '../types';

interface ChartsProps {
  passengers: MonthlyPassengerData[];
  airlineShares: AirlineShare[];
}

export default function Charts({ passengers, airlineShares }: ChartsProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ idx: number; val2024: number; val2023: number; month: string } | null>(null);

  // SVG dimensions for the main chart
  const width = 800;
  const height = 280;
  const padding = 45;

  const maxVal = Math.max(...passengers.map((p) => Math.max(p.year2023, p.year2024)));
  const minVal = Math.min(...passengers.map((p) => Math.min(p.year2023, p.year2024))) * 0.8;

  const getCoordinates = (index: number, val: number) => {
    const x = padding + (index / (passengers.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
    return { x, y };
  };

  // Generate paths
  let path2024 = '';
  let path2023 = '';
  let areaPath2024 = '';

  passengers.forEach((p, idx) => {
    const val23 = p.year2023;
    const val24 = p.year2024;
    const pt23 = getCoordinates(idx, val23);
    const pt24 = getCoordinates(idx, val24);

    if (idx === 0) {
      path2024 = `M ${pt24.x} ${pt24.y}`;
      path2023 = `M ${pt23.x} ${pt23.y}`;
      areaPath2024 = `M ${pt24.x} ${height - padding} L ${pt24.x} ${pt24.y}`;
    } else {
      path2024 += ` L ${pt24.x} ${pt24.y}`;
      path2023 += ` L ${pt23.x} ${pt23.y}`;
      areaPath2024 += ` L ${pt24.x} ${pt24.y}`;
    }

    if (idx === passengers.length - 1) {
      areaPath2024 += ` L ${pt24.x} ${height - padding} Z`;
    }
  });

  // Circular breakdown metrics
  const radius = 35;
  const circWidth = 10;
  const circumference = 2 * Math.PI * radius; // ~219.91

  const segmentColors = [
    '#f59e0b', // LATAM (Amber)
    '#10b981', // Sky (Emerald)
    '#3b82f6', // JetSmart (Blue)
    '#8b5cf6', // Star (Purple)
    '#6b7280', // Others (Slate)
  ];

  let accumulatedPercent = 0;

  // Let's summarize the total share and find the lead contributor
  const highestAirline = airlineShares.reduce((max, item) => item.share > max.share ? item : max, airlineShares[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-card-gap">
      {/* Passenger Demand Vector Chart */}
      <div className="col-span-1 lg:col-span-2 glass-card rounded-xl p-6 relative flex flex-col justify-between border border-white/5 bg-[#121214]/60">
        <header className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-amber-500 font-mono tracking-widest uppercase">MÉTRICA 01 // EVOLUCIÓN HISTÓRICA DE PASAJEROS</span>
            <h4 className="text-base font-light text-white tracking-wide">
              Flujo Mensual de <span className="italic font-serif">Pasajeros (PAX)</span>
            </h4>
            <p className="text-[10px] text-gray-500 font-mono">
              Contraste de Crecimiento de Demanda: Año Previo vs Año Actual
            </p>
          </div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5 text-[10px] text-gray-300 font-mono">
              <span className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" /> Año Actual
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono">
              <span className="w-2 h-2 bg-gray-600 rounded-full" /> Año Previo
            </span>
          </div>
        </header>

        {/* SVG Wrapper */}
        <div className="relative w-full overflow-x-auto">
          <svg className="w-full min-w-[500px] h-[220px]" viewBox={`0 0 ${width} ${height}`}>
            <defs>
              <linearGradient id="chartGoldGradientNew" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(245, 158, 11, 0.20)" />
                <stop offset="100%" stopColor="rgba(18, 18, 20, 0)" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, gridIdx) => {
              const y = padding + ratio * (height - 2 * padding);
              const gridVal = Math.round(maxVal - ratio * (maxVal - minVal));
              return (
                <g key={gridIdx}>
                  <line
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeDasharray="3 4"
                  />
                  <text
                    x={padding - 8}
                    y={y + 3}
                    fill="rgba(255, 255, 255, 0.3)"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="end"
                  >
                    {Math.round(gridVal / 1000)}k pax
                  </text>
                </g>
              );
            })}

            {/* Gradient Area under Year Actual Curve */}
            {areaPath2024 && <path d={areaPath2024} fill="url(#chartGoldGradientNew)" />}

            {/* Year Previo Dotted path */}
            {path2023 && (
              <path
                d={path2023}
                fill="none"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1.5"
                strokeDasharray="4 6"
              />
            )}

            {/* Year Actual Solid Line */}
            {path2024 && (
              <path
                d={path2024}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Nodes and Hover Interactions */}
            {passengers.map((p, idx) => {
              const pt23 = getCoordinates(idx, p.year2023);
              const pt24 = getCoordinates(idx, p.year2024);

              return (
                <g key={idx}>
                  <rect
                    x={pt24.x - 20}
                    y={0}
                    width={40}
                    height={height}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() =>
                      setHoveredPoint({
                        idx,
                        val2024: p.year2024,
                        val2023: p.year2023,
                        month: p.month,
                      })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                  />

                  {hoveredPoint?.idx === idx && (
                    <line
                      x1={pt24.x}
                      y1={padding}
                      x2={pt24.x}
                      y2={height - padding}
                      stroke="rgba(245, 158, 11, 0.3)"
                      strokeWidth="1"
                    />
                  )}

                  {/* Year Actual Nodes */}
                  <circle
                    cx={pt24.x}
                    cy={pt24.y}
                    r={hoveredPoint?.idx === idx ? 6 : 3}
                    fill="#f59e0b"
                    className="transition-all duration-150"
                  />

                  {/* Year Previo Nodes */}
                  <circle
                    cx={pt23.x}
                    cy={pt23.y}
                    r={hoveredPoint?.idx === idx ? 4 : 2}
                    fill="rgba(255, 255, 255, 0.3)"
                    className="transition-all duration-150"
                  />

                  <text
                    x={pt24.x}
                    y={height - 12}
                    fill={hoveredPoint?.idx === idx ? '#f59e0b' : 'rgba(255, 255, 255, 0.4)'}
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="transition-all duration-150"
                  >
                    {p.month}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Floating Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute z-10 p-3 rounded-lg border border-amber-500/20 bg-[#161618] shadow-xl pointer-events-none"
              style={{
                left: `${getCoordinates(hoveredPoint.idx, hoveredPoint.val2024).x - 65}px`,
                top: `${getCoordinates(hoveredPoint.idx, hoveredPoint.val2024).y - 85}px`,
              }}
            >
              <div className="text-[10px] font-bold text-amber-500 tracking-widest uppercase mb-1 font-mono">
                {hoveredPoint.month}
              </div>
              <div className="space-y-0.5 font-mono text-xs">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Año Act:</span>
                  <span className="font-bold text-white">{(hoveredPoint.val2024).toLocaleString()}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Año Prev:</span>
                  <span className="text-gray-400 font-bold">{(hoveredPoint.val2023).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Market Share Breakdown with Circular Donut */}
      <div className="glass-card rounded-xl p-6 flex flex-col justify-between border border-white/5 bg-[#121214]/60">
        <div>
          <span className="text-[9px] font-bold text-amber-500 font-mono tracking-widest uppercase">MÉTRICA 02 // CUOTA DE MERCADO COMERCIAL</span>
          <h4 className="text-base font-light text-white tracking-wide">
            Participación de <span className="italic font-serif">Aerolíneas</span>
          </h4>
          <p className="text-[10px] text-gray-500 font-mono mb-4">
            Distribución estratégica por volumen de pasajeros movilizados
          </p>
        </div>

        {/* Circular Indicator */}
        <div className="flex items-center gap-6 py-2 border-b border-white/5">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth={circWidth}
              />
              {airlineShares.map((item, idx) => {
                const strokeLength = (item.share * circumference) / 100;
                const strokeOffset = circumference - (accumulatedPercent * circumference) / 100;
                accumulatedPercent += item.share;
                return (
                  <circle
                    key={idx}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke={segmentColors[idx % segmentColors.length]}
                    strokeWidth={circWidth}
                    strokeDasharray={`${strokeLength} ${circumference}`}
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[8px] text-gray-400 font-mono uppercase">TOP 1</span>
              <span className="text-xs font-bold text-white font-mono">{highestAirline.share}%</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-amber-500 font-mono">
              ★ Líder de Plaza
            </div>
            <div className="text-xs font-bold text-white">
              {highestAirline.name}
            </div>
            <p className="text-[11px] text-gray-400 leading-normal">
              Domina la conectividad de Cusco concentrando el <strong className="text-white font-mono font-bold">{highestAirline.share}%</strong> de la oferta aeronáutica activa.
            </p>
          </div>
        </div>

        {/* Dynamic Rankings */}
        <div className="space-y-2.5 my-4">
          {airlineShares.slice(0, 4).map((item, idx) => (
            <div key={idx} className="space-y-1 group">
              <div className="flex justify-between text-xs font-sans">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <span className={`w-4.5 h-4.5 rounded text-[9px] font-mono font-bold flex items-center justify-center bg-white/5 border border-white/10 ${
                    idx === 0 ? 'text-amber-400 border-amber-500/30 bg-amber-500/5' : 'text-gray-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="group-hover:text-amber-500 transition-colors truncate max-w-[150px]">
                    {item.name}
                  </span>
                </span>
                <span className="font-mono text-amber-500 font-bold text-[11px]">
                  {item.share}% <span className="text-gray-500 font-normal">({item.passCount})</span>
                </span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${item.share}%`,
                    backgroundColor: segmentColors[idx % segmentColors.length]
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/[0.01] p-2.5 rounded border border-white/5 text-[9px] text-gray-400 leading-relaxed font-mono flex items-center gap-2">
          <span className="material-symbols-outlined text-xs text-amber-500">info</span>
          Riesgo de concentración moderado bajo diversificación regional.
        </div>
      </div>
    </div>
  );
}
