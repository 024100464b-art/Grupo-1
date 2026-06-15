import React from 'react';
import { ScenarioData } from '../types';
import { TrendingUp, Users, DollarSign, AlertTriangle, ShieldCheck, PieChart, Landmark } from 'lucide-react';
import Charts from './Charts';

interface PrincipalDashboardViewProps {
  data: ScenarioData;
  onNavigateTab: (tab: string) => void;
}

export default function PrincipalDashboardView({ data, onNavigateTab }: PrincipalDashboardViewProps) {
  // Simple circular calculation for the Runway Capacity occupancy metric (simulated based on scenario context)
  const isHighDemand = data.id === 'alta_demanda';
  const isMalClima = data.id === 'mal_clima';
  
  // High demand: 88% capacity used, Mal clima: 65% capacity used, Mantenimiento: 92% capacity used
  const capacityPct = isHighDemand ? 88 : isMalClima ? 65 : 92;
  const radius = 38;
  const strokeDashoffset = 2 * Math.PI * radius * (1 - capacityPct / 100);

  // EBITDA margins
  const ebitdaMargin = isHighDemand ? 48.8 : isMalClima ? 42.1 : 44.3;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Dynamic strategic warning or corporate focus flag */}
      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] text-amber-500 font-mono uppercase tracking-widest font-bold">Declaración del Directorio</span>
          <p className="text-xs text-gray-400">
            "AeroGest Cusco es una plataforma estrictamente estratégica de monitoreo comercial para la Gerencia General, orientada a la toma de decisiones corporativas del negocio aeroportuario."
          </p>
        </div>
        <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1.5 rounded-lg font-mono whitespace-nowrap">
          Soporte de Decisión Humana
        </span>
      </div>

      {/* Top Level Strategic Corporate KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Ingresos Anuales */}
        <div 
          onClick={() => onNavigateTab('salud_empresarial')}
          className="glass-card p-6 rounded-xl space-y-4 border border-white/5 bg-[#121214]/60 hover:border-amber-500/20 hover:bg-white/[0.01] transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-[10px] font-mono tracking-wider uppercase font-bold text-gray-400">INGRESOS DE TERMINAL</span>
            <span className="p-1.5 rounded bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform">
              <DollarSign size={14} />
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-white">{data.ingresosAnuales}</h3>
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp size={12} /> {data.ingresosAnualesTrend}
            </p>
          </div>
          <div className="pt-2 border-t border-white/5 text-[10px] text-gray-400 flex justify-between items-center">
            <span>Ver breakdown financiero</span>
            <span className="material-symbols-outlined text-[12px] text-amber-500">arrow_right_alt</span>
          </div>
        </div>

        {/* KPI 2: Pasajeros Anuales */}
        <div 
          onClick={() => onNavigateTab('mercado_crecimiento')}
          className="glass-card p-6 rounded-xl space-y-4 border border-white/5 bg-[#121214]/60 hover:border-amber-500/20 hover:bg-white/[0.01] transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-[10px] font-mono tracking-wider uppercase font-bold text-gray-400">PASAJEROS ANUALES</span>
            <span className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
              <Users size={14} />
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-white">{data.pasajerosAnuales} <span className="text-xs font-normal text-gray-500">PAX</span></h3>
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp size={12} /> {data.pasajerosAnualesTrend}
            </p>
          </div>
          <div className="pt-2 border-t border-white/5 text-[10px] text-gray-400 flex justify-between items-center">
            <span>Ver análisis de rutas</span>
            <span className="material-symbols-outlined text-[12px] text-amber-500">arrow_right_alt</span>
          </div>
        </div>

        {/* KPI 3: Crecimiento Real */}
        <div className="glass-card p-6 rounded-xl space-y-4 border border-white/5 bg-[#121214]/60 group">
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-[10px] font-mono tracking-wider uppercase font-bold text-gray-400">DESVIACIÓN DE MARGEN</span>
            <span className="p-1.5 rounded bg-blue-500/10 text-blue-400">
              <TrendingUp size={14} />
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-white">{data.crecimientoAnual}</h3>
            <p className="text-[10px] text-gray-400 leading-tight">
              {data.crecimientoAnualTrend}
            </p>
          </div>
          <div className="pt-2 border-t border-white/5 text-[9px] text-gray-500">
            Refleja el cumplimiento del plan corporativo anual.
          </div>
        </div>

        {/* KPI 4: Riesgos Estratégicos */}
        <div 
          onClick={() => onNavigateTab('riesgos_estrategicos')}
          className="glass-card p-6 rounded-xl space-y-4 border border-white/5 bg-[#121214]/60 hover:border-amber-500/20 hover:bg-white/[0.01] transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-[10px] font-mono tracking-wider uppercase font-bold text-gray-400">RIESGOS DE NEGOCIO</span>
            <span className={`p-1.5 rounded ${data.activeRiesgosCount > 1 ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'} group-hover:scale-105 transition-transform`}>
              <AlertTriangle size={14} />
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white">{data.riesgosSummary}</h3>
            <p className="text-xs text-amber-400 font-medium">
              Activos bajo monitoreo del directorio
            </p>
          </div>
          <div className="pt-2 border-t border-white/5 text-[10px] text-gray-400 flex justify-between items-center">
            <span>Inspeccionar matriz de riesgos</span>
            <span className="material-symbols-outlined text-[12px] text-amber-500">arrow_right_alt</span>
          </div>
        </div>

      </div>

      {/* Main Core Passenger Demand and Airline Shares Charts */}
      <Charts passengers={data.passengersList} airlineShares={data.airlineShares} />

      {/* Lower Strategic Section: Capacity Utilization, Financial Contribution, Strategic Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card A: Runway & Airspace Capacity Usage */}
        <div className="glass-card p-6 rounded-xl border border-white/5 bg-[#121214]/60 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[9px] text-amber-500 font-mono tracking-widest uppercase font-bold">CAPACIDAD DE INFRAESTRUCTURA</span>
            <h4 className="text-sm text-gray-300 font-light mt-0.5">Saturación en Horas Pico (Decolajes/Slots)</h4>
          </div>

          <div className="flex items-center justify-around py-2">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r={radius} 
                  fill="transparent" 
                  stroke="rgba(255,255,255,0.03)" 
                  strokeWidth="8"
                />
                <circle 
                  cx="50" cy="50" r={radius} 
                  fill="transparent" 
                  stroke={capacityPct > 85 ? '#ef4444' : '#f59e0b'} 
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * radius}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-white font-mono">{capacityPct}%</span>
                <span className="text-[8px] text-gray-500 font-mono">OCUPADO</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-300">
                <span className={`w-2.5 h-2.5 rounded-full ${capacityPct > 85 ? 'bg-red-500' : 'bg-amber-500'}`} />
                <span>Nivel de Servicio</span>
              </div>
              <p className="text-[11px] text-gray-400 max-w-[130px] leading-relaxed">
                {capacityPct > 85 
                  ? 'Sobresaturación física severa de slots comerciales de la pista.' 
                  : 'Tráfico fluido dentro de los parámetros recomendados.'}
              </p>
            </div>
          </div>

          <p className="text-[10px] text-gray-500 italic font-mono leading-relaxed border-t border-white/5 pt-3">
            El EBITDA marginal decae temporalmente debido al congestionamiento de aeronaves comerciales.
          </p>
        </div>

        {/* Card B: EBITDA Contribution */}
        <div className="glass-card p-6 rounded-xl border border-white/5 bg-[#121214]/60 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[9px] text-amber-500 font-mono tracking-widest uppercase font-bold">SALUD EMPRESARIAL - EBITDA</span>
            <h4 className="text-sm text-gray-300 font-light mt-0.5">Margen Operativo de Concesión</h4>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[10px] text-gray-500 font-mono uppercase block">MARGEN EBITDA</span>
                <span className="text-2xl font-black text-white font-mono">{ebitdaMargin}%</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono uppercase bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                SOSTENIBLE
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>Eficiencia Comercial</span>
                <span>Objetivo: 45.0%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500" 
                  style={{ width: `${(ebitdaMargin / 55) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-[10px] text-gray-500 italic font-mono leading-relaxed border-t border-white/5 pt-3">
            Ingresos de Retail y Duty Free compensan contingencias operacionales del terminal.
          </p>
        </div>

        {/* Card C: Director Board Strategic Briefing */}
        <div className="glass-card p-6 rounded-xl border border-white/5 bg-[#121214]/60 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[9px] text-amber-500 font-mono tracking-widest uppercase font-bold">ESTADO DE DIRECTÓRIO</span>
            <h4 className="text-sm text-gray-300 font-light mt-0.5">Resumen del Plan de Vuelo Actual</h4>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-white uppercase font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Detección Estratégica
              </div>
              <p className="text-[11px] text-gray-400 leading-normal">
                {data.estadoGeneralDesc}
              </p>
            </div>
          </div>

          <div className="border-t border-white/5 pt-3 flex justify-between items-center">
            <span className="text-[10px] text-gray-500 font-mono">ESTADO GENERAL DE PLAZA</span>
            <span className={`text-[10px] font-bold font-mono uppercase ${
              data.estadoGeneral === 'Favorable' ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              ● {data.estadoGeneral}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
