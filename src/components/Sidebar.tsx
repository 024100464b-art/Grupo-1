/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  PlaneTakeoff, 
  Users, 
  Ticket, 
  Luggage, 
  HelpCircle, 
  LogOut,
  Plane,
  AlertTriangle
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ activeView, setActiveView, onLogout }: SidebarProps) {
  // Lista de items del menú principal
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vuelos', label: 'Vuelos', icon: PlaneTakeoff },
    { id: 'pasajeros', label: 'Pasajeros', icon: Users },
    { id: 'boletos', label: 'Boletos', icon: Ticket },
    { id: 'equipajes', label: 'Equipajes', icon: Luggage },
    { id: 'incidencias', label: 'Incidencias', icon: AlertTriangle },
  ];

  return (
    <nav className="bg-[#000c24] border-r border-[#00214a] text-white w-64 fixed left-0 top-0 h-screen py-8 flex flex-col justify-between shadow-2xl z-50 transition-all font-sans">
      <div>
        {/* Brand Header */}
        <div className="px-6 mb-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#0ea5e9] to-[#000c24] p-1.5 rounded-2xl flex items-center justify-center mb-4 border border-[#0ea5e9]/30 shadow-lg shadow-sky-500/10">
            <div className="w-full h-full bg-[#000c24] rounded-xl flex items-center justify-center">
              <Plane className="text-[#38bdf8] w-7 h-7" />
            </div>
          </div>
          <h1 className="text-xl font-display font-medium tracking-tight text-white mb-0.5">AeroGest Cusco</h1>
          <p className="text-[10px] text-sky-400 uppercase tracking-widest font-mono font-medium">Terminal Velasco Astete</p>
        </div>

        {/* Separator */}
        <div className="px-6 mb-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#00214a] to-transparent"></div>
        </div>

        {/* Menú de Navegación Principal */}
        <div className="px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer relative ${
                  isActive
                    ? 'bg-sky-500/10 text-sky-400 font-semibold border-l-4 border-sky-400 pl-3.5'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menú Inferior de Soporte y Control */}
      <div className="px-4 border-t border-[#00214a] pt-6 space-y-2">
        <button
          onClick={() => alert('Soporte AeroGest Cusco:\nIntendencia de TI Velasco Astete: +51 (084) 221144\nEmail: soporte@aerogest.com.pe')}
          className="w-full flex items-center gap-3.5 px-4.5 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <HelpCircle className="w-5 h-5 text-slate-500" />
          <span>Ayuda / Soporte</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-4.5 py-3 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </nav>
  );
}
