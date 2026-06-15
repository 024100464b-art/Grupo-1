import React from 'react';
import { ScenarioType } from '../types';

interface HeaderProps {
  currentScenario: ScenarioType;
  setScenario: (scenario: ScenarioType) => void;
  onNotificationsClick: () => void;
  activeAlerts: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchPlaceholder: string;
  onRefreshData: () => void;
  showSearch?: boolean;
}

export default function Header({
  currentScenario,
  setScenario,
  onNotificationsClick,
  activeAlerts,
  searchTerm,
  setSearchTerm,
  searchPlaceholder,
  onRefreshData,
  showSearch = true,
}: HeaderProps) {
  return (
    <header className="h-16 flex justify-between items-center px-8 backdrop-blur-[20px] bg-[#08080a]/60 border-b border-white/5 sticky top-0 z-30 select-none">
      {/* Left: Status + Search */}
      <div className="flex items-center gap-6 flex-1">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[10px] text-emerald-400 tracking-widest font-bold hidden sm:inline">AOCC LIVE</span>
        </div>

        {/* Search Bar — only shown on operational views */}
        {showSearch && (
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-[#161618] border border-white/5 text-gray-300 text-xs font-sans rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-amber-500/30 focus:ring-1 focus:ring-amber-500/10 transition-all placeholder:text-gray-600"
            />
          </div>
        )}
      </div>

      {/* Right: Scenario Switcher + Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" } as React.CSSProperties}>
            monitoring
          </span>
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest hidden md:inline">
            Escenario:
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

        <div className="h-4 w-px bg-white/10" />

        <div className="flex items-center gap-4">
          <button
            onClick={onNotificationsClick}
            className="material-symbols-outlined text-gray-400 hover:text-amber-500 transition-colors relative cursor-pointer"
            title="Alertas Estratégicas"
          >
            notifications_none
            {activeAlerts > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#08080a] animate-pulse-alert"></span>
            )}
          </button>
          <button
            onClick={onRefreshData}
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
