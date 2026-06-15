import React from 'react';
import { ScenarioData } from '../types';
import { TrendingUp, Award, Map, RefreshCw } from 'lucide-react';

interface MercadoCrecimientoViewProps {
  data: ScenarioData;
}

export default function MercadoCrecimientoView({ data }: MercadoCrecimientoViewProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Strategic Question */}
      <div className="pb-4 border-b border-white/5">
        <h3 className="font-sans text-xl font-light text-white tracking-wide">
          Análisis de Mercado & <span className="italic font-serif text-amber-500">Crecimiento Logístico</span>
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Evolución del factor de ocupación de las aerolíneas, flujos regionales Cusco (CUZ) y madurez de las rutas troncales internacionales directas.
        </p>
      </div>

      {/* Main Stats grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Routes breakdown */}
        <div className="col-span-1 lg:col-span-2 glass-card p-6 rounded-xl border border-white/5 bg-[#121214]/60 space-y-4">
          <div>
            <span className="text-[9px] text-amber-500 font-mono tracking-widest uppercase font-bold">CONECTIVIDAD TRONCAL</span>
            <h4 className="text-sm font-semibold text-white">Rutas de Mayor Tránsito y Factores de Ocupación (Load Factors)</h4>
            <p className="text-xs text-gray-400">Rutas clave que sustentan la tasa de cobro TUA.</p>
          </div>

          <div className="space-y-4">
            {data.mainRoutes.map((route, idx) => (
              <div key={idx} className="bg-white/[0.01] p-4 rounded-lg border border-white/5 space-y-2 group hover:border-amber-500/20 transition-all">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-white group-hover:text-amber-500 transition-colors">{route.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    route.status === 'Alta Rentabilidad' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' :
                    route.status === 'En Crecimiento' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/25' :
                    'bg-gray-500/10 text-gray-400 border border-gray-500/25'
                  }`}>
                    {route.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-xs font-mono pt-1 text-gray-400">
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">PAX/AÑO</span>
                    <strong className="text-white font-bold">{route.passengers}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">CUOTA OPERATIVA</span>
                    <strong className="text-white font-bold">{route.sharePct}%</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">LOAD FACTOR MEDIO</span>
                    <strong className="text-amber-500 font-bold">{route.loadFactor}%</strong>
                  </div>
                </div>

                {/* Visual Load Factor Bar */}
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                    style={{ width: `${route.loadFactor}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Key Commercial Airline Carriers shares */}
        <div className="glass-card p-6 rounded-xl border border-white/5 bg-[#121214]/60 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-[9px] text-amber-500 font-mono tracking-widest uppercase font-bold">OPERADORES DE AEROPUERTO</span>
              <h4 className="text-sm font-semibold text-white">Ranking de Socios Corporativos</h4>
              <p className="text-xs text-gray-400">Salud comercial y aporte EBITDA de aerolíneas.</p>
            </div>

            <div className="divide-y divide-white/5">
              {data.airlineShares.map((airline, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between font-sans">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="text-gray-500 font-mono text-[10px]">{idx + 1}.</span>
                      {airline.name}
                    </div>
                    <p className="text-[10px] text-gray-400 font-mono">
                      {airline.passCount} movilizados
                    </p>
                  </div>

                  <div className="text-right font-mono text-xs">
                    <div className="text-amber-500 font-bold">{airline.share}% cuota</div>
                    <div className="text-gray-500 text-[10px]">EBITDA Contribution: {airline.ebitdaPct}%</div>
                    <span className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase inline-block mt-0.5 ${
                      airline.health === 'Excelente' ? 'bg-emerald-500/10 text-emerald-400' :
                      airline.health === 'Estable' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-red-500/10 text-red-400 animate-pulse-alert'
                    }`}>
                      {airline.health}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.01] p-3 rounded-lg border border-white/5 text-[9px] text-gray-400 font-mono leading-relaxed mt-4">
            Las aerolíneas operando bajo formato Low Cost (LCC) incrementan su protagonismo de cuota regional, empujando los consumos comerciales terrestres del aeropuerto de Cusco.
          </div>
        </div>

      </div>

      {/* Strategic Trend Briefing */}
      <div className="glass-card p-6 rounded-xl border border-white/5 bg-[#121214]/60 space-y-4">
        <h4 className="text-sm font-semibold text-white">Síntesis Geopolítica de Crecimiento & Concesiones de Cusco</h4>
        <p className="text-xs text-gray-300 leading-relaxed">
          El mercado aeroportuario andino se mantiene con un crecimiento compuesto positivo (CAGR), robustecido históricamente por las conexiones troncales con Lima y el mercado regional de Sudamérica. El desarrollo comercial se centra en la captación de marcas comerciales internacionales (retail y salas VIP), lo que ha permitido aumentar los ingresos no aeronáuticos por metro cuadrado un 18% interanual.
        </p>
      </div>
    </div>
  );
}
