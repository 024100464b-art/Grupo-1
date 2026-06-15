import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeAlerts: number;
  directorName: string;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, activeAlerts, directorName, onLogout }: SidebarProps) {
  const estrategicoItems = [
    { id: 'dashboard', label: 'Dashboard Principal', icon: 'dashboard' },
    { id: 'salud_empresarial', label: 'Salud Empresarial', icon: 'account_balance' },
    { id: 'mercado_crecimiento', label: 'Mercado y Crecimiento', icon: 'trending_up' },
    { id: 'riesgos_estrategicos', label: 'Riesgos Estratégicos', icon: 'shield_alert' },
    { id: 'reporte', label: 'Reporte Ejecutivo', icon: 'description' },
  ];

  const operativoItems = [
    { id: 'vuelos', label: 'Vuelos', icon: 'flight' },
    { id: 'pasajeros', label: 'Pasajeros', icon: 'groups' },
    { id: 'boletos', label: 'Boletos', icon: 'confirmation_number' },
    { id: 'equipajes', label: 'Equipajes', icon: 'luggage' },
    { id: 'incidencias', label: 'Incidencias', icon: 'warning' },
    { id: 'monitoreo', label: 'Monitoreo', icon: 'monitoring' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-[#121214] border-r border-white/5 flex flex-col py-6 z-40">
      {/* Brand Header */}
      <div className="px-6 mb-8 select-none">
        <h1 className="text-xl font-light tracking-[0.12em] text-white uppercase flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" } as React.CSSProperties}>
            flight_takeoff
          </span>
          AeroGest <span className="font-bold text-amber-500">Cusco</span>
        </h1>
        <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">
          AOCC Strategic Terminal
        </p>
      </div>

      {/* Centro de Mando */}
      <div className="px-4 mb-2">
        <p className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.2em] px-4 mb-1">Centro de Mando</p>
        <nav className="space-y-0.5">
          {estrategicoItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? 'bg-white/5 border-white/10 text-white font-medium'
                    : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${isActive ? 'text-amber-500' : 'text-gray-400'}`}
                >
                  {item.icon}
                </span>
                <span className="text-sm font-sans tracking-wide truncate">{item.label}</span>
                {item.id === 'riesgos_estrategicos' && activeAlerts > 0 && (
                  <span className="ml-auto shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse-alert">
                    {activeAlerts}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Separator */}
      <div className="px-8 my-4">
        <div className="h-px bg-white/5" />
      </div>

      {/* Operaciones */}
      <div className="px-4 mb-2 flex-1 overflow-y-auto">
        <p className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.2em] px-4 mb-1">Operaciones</p>
        <nav className="space-y-0.5">
          {operativoItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? 'bg-white/5 border-white/10 text-white font-medium'
                    : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${isActive ? 'text-amber-500' : 'text-gray-400'}`}
                >
                  {item.icon}
                </span>
                <span className="text-sm font-sans tracking-wide truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Director Profile */}
      <div className="px-4 mb-3">
        <div className="flex items-center gap-4 p-3 bg-gradient-to-br from-[#1a1a1e] to-[#121214] border border-white/5 rounded-xl">
          <img
            alt="Director"
            className="w-10 h-10 rounded-full border border-white/10 object-cover shrink-0"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaf1b1WVAHtrkCfprINLSzh06FhsJ9UCoxjqygIXZ_e9NmU4oXh-f2oDEJklDuKEGQrHYB-rX8S3vbXb_JdykvC3UFWrfYGQb65CKKrr8OxsbqJMaA5Q0N2TC2faSVKEPMfnwb3Dwh5KGhOPY49vWp_sNYiezRz83Cxr9pmPDMzZjGBFK0EWPEn8_9jktwgnemNbkWms7cH3_Ay5R249A2XIvqXjyLDFWdyjwTclFebp_KvUSinReBMyvrSax6m-Tn6tqem4V7XA"
          />
          <div className="overflow-hidden min-w-0">
            <p className="font-semibold text-white text-xs truncate">{directorName}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Director Regional</p>
          </div>
        </div>
      </div>

      {/* Bottom Actions: Config / Support / Logout */}
      <div className="px-4 pt-3 border-t border-white/5 space-y-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('config')}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 cursor-pointer text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            Ajustes
          </button>
          <button
            onClick={() => alert('Servidor de Inteligencia Corporativa: Sincronización activa. Conexión segura con el Directorio.')}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 cursor-pointer text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">contact_support</span>
            Soporte
          </button>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 rounded-lg transition-all cursor-pointer text-xs font-semibold tracking-wide"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
