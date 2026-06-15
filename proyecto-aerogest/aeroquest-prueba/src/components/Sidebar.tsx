import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeAlerts: number;
  directorName: string;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, activeAlerts, directorName, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Principal', icon: 'dashboard', fill: true },
    { id: 'salud_empresarial', label: 'Salud Empresarial', icon: 'account_balance', fill: false },
    { id: 'mercado_crecimiento', label: 'Mercado y Crecimiento', icon: 'trending_up', fill: false },
    { 
      id: 'riesgos_estrategicos', 
      label: 'Riesgos Estratégicos', 
      icon: 'shield_alert', 
      fill: false, 
      badge: activeAlerts > 0 ? activeAlerts : undefined,
      badgeColor: 'bg-red-500/10 text-red-405'
    },
    { id: 'reporte', label: 'Reporte Ejecutivo', icon: 'description', fill: false }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-[#121214] border-r border-white/5 flex flex-col py-6 z-40">
      {/* Brand Header */}
      <div className="px-6 mb-8 select-none">
        <h1 className="text-xl font-light tracking-[0.12em] text-white uppercase flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            flight_takeoff
          </span>
          AeroGest <span className="font-bold text-amber-500">Cusco</span>
        </h1>
        <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">
          AOCC Strategic Terminal
        </p>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-4 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200 border cursor-pointer ${
                isActive
                  ? 'bg-white/5 border-white/10 text-white font-medium'
                  : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span 
                  className={`material-symbols-outlined text-[20px] ${isActive ? 'text-amber-500' : 'text-gray-400'}`}
                  style={item.fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="text-sm font-sans tracking-wide">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse-alert`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Tools & Director Profile */}
      <div className="px-4 pt-6 border-t border-white/5 mt-auto space-y-4">
        {/* Quick Tools */}
        <div className="flex justify-between items-center px-2">
          <button 
            onClick={() => setActiveTab('config')} 
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
            title="Ajustes de Sistema"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
          <button 
            onClick={() => alert('Servidor de Inteligencia Corporativa: Sincronización en la nube activa. Conexión segura con el Directório de AeroGest.')} 
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
            title="Soporte Técnico"
          >
            <span className="material-symbols-outlined text-[20px]">contact_support</span>
          </button>
          <button 
            onClick={onLogout} 
            className="p-2 text-red-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/5 cursor-pointer"
            title="Cerrar Sesión Ejecutiva"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>

        {/* Director Profile */}
        <div className="flex items-center gap-4 p-3 bg-gradient-to-br from-[#1a1a1e] to-[#121214] border border-white/5 rounded-xl">
          <img 
            alt="Director Alejandro Valdivia Headshot" 
            className="w-10 h-10 rounded border border-white/10 object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaf1b1WVAHtrkCfprINLSzh06FhsJ9UCoxjqygIXZ_e9NmU4oXh-f2oDEJklDuKEGQrHYB-rX8S3vbXb_JdykvC3UFWrfYGQb65CKKrr8OxsbqJMaA5Q0N2TC2faSVKEPMfnwb3Dwh5KGhOPY49vWp_sNYiezRz83Cxr9pmPDMzZjGBFK0EWPEn8_9jktwgnemNbkWms7cH3_Ay5R249A2XIvqXjyLDFWdyjwTclFebp_KvUSinReBMyvrSax6m-Tn6tqem4V7XA"
          />
          <div className="overflow-hidden">
            <p className="font-semibold text-white text-xs truncate">{directorName}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Director Regional</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
