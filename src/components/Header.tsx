/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Bell, Settings, Terminal, RefreshCw, Disc } from 'lucide-react';
import { resetLocalDatabase } from '../supabase';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchPlaceholder?: string;
  onRefreshData?: () => void;
}

export default function Header({ 
  searchTerm, 
  setSearchTerm, 
  searchPlaceholder = "Buscar vuelos, pasajeros, boletos...",
  onRefreshData
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Notificaciones simuladas para dar interactividad ejecutiva
  const notifications = [
    { id: 1, text: 'Vuelo AV839 desde Bogotá reporta retraso de salida.', time: 'Hace 5 min', unread: true },
    { id: 2, text: 'Equipaje ARE-5510-C registrado como extraviado.', time: 'Hace 15 min', unread: true },
    { id: 3, text: 'Confirmación exitosa del boleto TKT-9205 para Ana Paz.', time: 'Hace 1 hr', unread: false },
  ];

  const handleResetData = () => {
    if (confirm('¿Desea restablecer todos los datos del sistema a sus valores predeterminados de Cusco?')) {
      resetLocalDatabase();
      if (onRefreshData) onRefreshData();
      alert('Base de datos local restablecida correctamente.');
      setShowSettings(false);
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/85 fixed top-0 right-0 w-[calc(100%-16rem)] h-16 flex items-center justify-between px-6 z-40 shadow-[0_1px_3px_rgba(0,10,30,0.03)] transition-all">
      {/* Caja de Búsqueda */}
      <div className="flex-grow max-w-md relative group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5 group-focus-within:text-sky-600 transition-colors" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all shadow-inner"
        />
      </div>

      {/* Panel de Acciones y Usuario */}
      <div className="flex items-center gap-4">
        {/* Notificaciones */}
        <div className="relative">
          <button 
            id="btn-notifications"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowSettings(false);
            }}
            className="p-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 text-slate-600 transition-all relative cursor-pointer"
          >
            <Bell className="w-5 h-5 text-slate-650" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 shadow-xl rounded-2xl py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="font-semibold text-xs text-slate-800 uppercase tracking-wider">Centro de Mensajes</span>
                <span className="bg-rose-50 text-rose-600 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">2 NUEVOS</span>
              </div>
              <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-3 text-xs leading-relaxed transition-colors hover:bg-gray-50 ${n.unread ? 'bg-blue-50/20' : ''}`}>
                    <div className="flex justify-between items-start mb-1 text-gray-800">
                      <span>{n.text}</span>
                      {n.unread && <span className="w-1.5 h-1.5 bg-sky-500 rounded-full shrink-0 mt-1.5 font-medium"></span>}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono font-medium">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Configuración */}
        <div className="relative">
          <button 
            id="btn-settings"
            onClick={() => {
              setShowSettings(!showSettings);
              setShowNotifications(false);
            }}
            className="p-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 text-slate-600 transition-colors cursor-pointer"
          >
            <Settings className="w-5 h-5" />
          </button>

          {showSettings && (
            <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 shadow-xl rounded-2xl p-4.5 z-50">
              <h4 className="font-semibold text-xs text-slate-900 uppercase tracking-widest mb-2 border-b pb-1.5 border-slate-100">
                AeroGest Cusco Configs
              </h4>
              <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                Configure y administre de forma rápida los datos operativos en caché.
              </p>
              <button
                onClick={handleResetData}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 hover:text-sky-850 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-sky-100/30 font-sans"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" />
                <span>Restablecer Datos Cusco</span>
              </button>
            </div>
          )}
        </div>

        {/* Separador */}
        <div className="h-6 w-px bg-slate-200"></div>

        {/* Información del Administrador */}
        <div className="flex items-center gap-2.5 cursor-pointer pl-1 py-1 pr-3 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
          <div className="w-8.5 h-8.5 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shadow-sm flex items-center justify-center">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSQ4GJlK8F1tclDZ3S72AkjUbRuiwPIL9sTRFTjo5hmrtGqiQz_wUcHY_FC0rcTT-OX1k7c0wj_ZuQtUyHxPULm9CH-aVg33VF3dS0l-STdBZ7F9uQNVMW_VTwtBgVnMvzkXRwOGTrn_v7IntBWF343pjfRWM7mA_6PKHMd7H5fRxOX_CYEOZdarzWQEZ3pKokq0NQazLIR7ff0Ri5dggg1Joo0L-Vq2XsJB94hGkKTUpUkBn1j1C0a1RZlCbfyzSsmMj6KDk25DjU" 
              alt="Avatar de Usuario Administrador" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-xs font-bold text-slate-800 leading-none">Admin User</span>
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mt-1">Operador Base</span>
          </div>
        </div>
      </div>
    </header>
  );
}
