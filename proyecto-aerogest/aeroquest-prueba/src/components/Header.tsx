import React from 'react';
import { ScenarioType } from '../types';

interface HeaderProps {
  currentScenario: ScenarioType;
  setScenario: (scenario: ScenarioType) => void;
  onNotificationsClick: () => void;
  activeAlerts: number;
}

export default function Header({ currentScenario, setScenario, onNotificationsClick, activeAlerts }: HeaderProps) {
  return (
    <header className="h-16 flex justify-between items-center px-8 backdrop-blur-[20px] bg-[#08080a]/60 border-b border-white/5 sticky top-0 z-30 select-none">
      {/* Page Title & Status */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[10px] text-emerald-400 tracking-widest font-bold hidden sm:inline">AOCC STRATEGIC LIVE</span>
        </div>
        <div className="h-4 w-px bg-white/10 hidden sm:inline" />
        <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
          Terminal de Monitoreo de Negocio
        </h2>
      </div>

      {/* Active Operational Scenario Switcher */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            monitoring
          </span>
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest hidden md:inline">
            Clima de Negocios:
          </label>
        </div>
        <select
          value={currentScenario}
          onChange={(e) => setScenario(e.target.value as ScenarioType)}
          className="bg-[#161618] border border-white/10 text-amber-500 hover:border-amber-500 font-sans text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer transition-all uppercase tracking-wider font-mono"
        >
          <option value="alta_demanda">📈 Alta Demanda e Inti Raymi</option>
          <option value="mal_clima">⛈️ Estacionalidad de Lluvias</option>
          <option value="mantenimiento_pista">🚧 Reinversión Pista (CAPEX)</option>
        </select>
        
        {/* Right Actions */}
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-4">
          <button 
            onClick={onNotificationsClick}
            className="material-symbols-outlined text-gray-400 hover:text-amber-500 transition-colors relative cursor-pointer"
            title="Saturación de Alertas Estratégicas"
          >
            notifications_none
            {activeAlerts > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#08080a] animate-pulse-alert"></span>
            )}
          </button>
          <button 
            onClick={() => alert('Sincronizando base de estadísticas comerciales de AeroGest. Conexión establecida con éxito.')}
            className="material-symbols-outlined text-gray-400 hover:text-amber-500 transition-colors cursor-pointer"
            title="Sincronizar Datos"
          >
            sync
          </button>
        </div>
      </div>
    </header>
  );
}
