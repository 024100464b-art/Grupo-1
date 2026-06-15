/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plane, 
  Calendar, 
  AlertTriangle, 
  Users, 
  Ticket, 
  Luggage,
  TrendingUp,
  ArrowRight,
  Plus,
  PlaneLanding,
  Settings,
  X
} from 'lucide-react';
import { DashboardStats, Vuelo } from '../types';
import { hasSupabaseConfig, updateEstadoVuelo } from '../supabase';
import SupabaseMissingBanner from './SupabaseMissingBanner';
import SimuladorGemini from './SimuladorGemini';
import ProyeccionStaffing from './ProyeccionStaffing';

interface DashboardViewProps {
  stats: DashboardStats;
  vuelos: Vuelo[];
  onNavigateToView: (view: string, openCreateModal?: boolean) => void;
}

export default function DashboardView({ stats, vuelos, onNavigateToView }: DashboardViewProps) {
  if (!hasSupabaseConfig) {
    return <SupabaseMissingBanner />;
  }

  // Limitar a máximo los primeros 4 o 5 vuelos para el resumen diario
  const premiumFlights = vuelos.slice(0, 5);

  // Formatear números si son altos para que coincidan con la estética
  const formatStat = (num: number, useK = false) => {
    if (useK && num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  // Estado del modal de gestión rápida
  const [gestionarVuelo, setGestionarVuelo] = useState<Vuelo | null>(null);
  const [formEstado, setFormEstado] = useState<Vuelo['estado']>('Programado');
  const [formPuerta, setFormPuerta] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const abrirGestion = (v: Vuelo) => {
    setGestionarVuelo(v);
    setFormEstado(v.estado);
    setFormPuerta(v.puerta);
    setFormError('');
  };

  const handleGuardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gestionarVuelo) return;
    setFormLoading(true);
    setFormError('');

    try {
      await updateEstadoVuelo(gestionarVuelo.id, formEstado, formPuerta || undefined);
      setGestionarVuelo(null);
    } catch {
      setFormError('Error al actualizar el vuelo.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-4">
      {/* SECCIÓN HERO TIPO BANNER DE CONTROL AERONÁUTICO */}
      <div className="bg-gradient-to-r from-[#000c24] via-[#001c4a] to-[#023e8a] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-sky-500/20">
        {/* Fondo decorativo geométrico vector-HUD */}
        <div className="absolute inset-0 opacity-15 pointer-events-none select-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dashgrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#7dd3fc" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dashgrid)" />
            {/* Círculo de compás de navegación */}
            <circle cx="85%" cy="50%" r="120" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3,6" />
            <circle cx="85%" cy="50%" r="70" fill="none" stroke="#0ea5e9" strokeWidth="0.5" />
            <line x1="85%" y1="0" x2="85%" y2="100%" stroke="#0ea5e9" strokeWidth="0.5" opacity="0.3" />
            {/* Trayectoria de vuelo sutil */}
            <path d="M 10% 80% Q 40% 20% 85% 50%" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5,5" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-[11px] font-semibold text-sky-300 font-mono tracking-wider uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping"></div>
              <span>TORRE CUZ EN LÍNEA: 3,310m altitud</span>
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-display">
              Estación Cusco Velasco Astete
            </h2>
            <p className="text-sm text-sky-200/80 max-w-2xl leading-relaxed">
              Consola operativa centralizada de AeroGest Cusco. Aquí supervisará el tráfico aéreo, administrará equipajes pesados y verificará la venta integrada de pasajes para vuelos entrantes y salientes.
            </p>
          </div>

          <button
            onClick={() => onNavigateToView('vuelos', true)}
            className="self-start md:self-auto bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-400 hover:to-blue-500 px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2.5 shadow-lg shadow-sky-500/10 hover:shadow-sky-500/20 transition-all duration-300 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Programar Vuelo</span>
          </button>
        </div>
      </div>

      {/* Grid de Tarjetas de Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {/* Card 1: Total Vuelos */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,10,30,0.06)] hover:border-[#38bdf8]/40 transition-all duration-300">
          <div className="absolute -right-5 -top-5 w-20 h-20 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">TOTAL VUELOS</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shadow-sm border border-blue-150">
              <Plane className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-extrabold text-slate-900 leading-none tracking-tight">{formatStat(stats.total_vuelos)}</span>
            <p className="text-[10px] text-emerald-600 font-medium font-mono mt-1">CUZ Sector</p>
          </div>
        </div>

        {/* Card 2: Programados */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,10,30,0.06)] hover:border-[#10b981]/40 transition-all duration-300">
          <div className="absolute -right-5 -top-5 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">PROGRAMADOS</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shadow-sm border border-emerald-150">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-extrabold text-slate-900 leading-none tracking-tight">{formatStat(stats.vuelos_programados)}</span>
            <p className="text-[10px] text-emerald-600 font-medium font-mono mt-1">&bull; Confirmados</p>
          </div>
        </div>

        {/* Card 3: Retrasados */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,10,30,0.06)] hover:border-[#f97316]/40 transition-all duration-300">
          <div className="absolute -right-5 -top-5 w-20 h-20 bg-orange-500/5 rounded-full blur-xl group-hover:bg-orange-500/10 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">RETRASADOS</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shadow-sm border border-amber-150">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-650 leading-none tracking-tight">{stats.vuelos_retrasados}</span>
            <span className="flex items-center text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded-full border border-rose-100">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              <span>+3</span>
            </span>
          </div>
        </div>

        {/* Card 4: Pasajeros */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,10,30,0.06)] hover:border-[#6366f1]/40 transition-all duration-300">
          <div className="absolute -right-5 -top-5 w-20 h-20 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">PASAJEROS</span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shadow-sm border border-indigo-150">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-extrabold text-slate-900 leading-none tracking-tight">{formatStat(stats.total_pasajeros, true)}</span>
            <p className="text-[10px] text-indigo-600 font-medium font-mono mt-1">Hoy registrados</p>
          </div>
        </div>

        {/* Card 5: Boletos */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,10,30,0.06)] hover:border-[#a855f7]/40 transition-all duration-300">
          <div className="absolute -right-5 -top-5 w-20 h-20 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">BOLETOS</span>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shadow-sm border border-purple-150">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-extrabold text-slate-900 leading-none tracking-tight">{formatStat(stats.total_boletos, true)}</span>
            <p className="text-[10px] text-purple-600 font-medium font-mono mt-1">Emitidos hoy</p>
          </div>
        </div>

        {/* Card 6: Equipajes */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,10,30,0.06)] hover:border-sky-500/40 transition-all duration-300">
          <div className="absolute -right-5 -top-5 w-20 h-20 bg-sky-500/5 rounded-full blur-xl group-hover:bg-sky-500/10 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">EQUIPAJES</span>
            <div className="p-2.5 bg-sky-50 text-[#0284c7] rounded-xl shadow-sm border border-sky-150">
              <Luggage className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-extrabold text-slate-900 leading-none tracking-tight">{formatStat(stats.total_equipajes, true)}</span>
            <p className="text-[10px] text-sky-600 font-medium font-mono mt-1">Bultos en bodega</p>
          </div>
        </div>
      </div>

      {/* Simulador Gerencial Predictivo */}
      <SimuladorGemini />

      {/* Proyección de Staffing */}
      <ProyeccionStaffing vuelos={vuelos} />

      {/* Tabla: Próximos Vuelos de Alta Estética */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,10,30,0.03)] flex flex-col">
        {/* Cabecera de la sección */}
        <div className="px-6 py-5 border-b border-[#e2e8f0] flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-display font-semibold text-lg text-slate-900">Despacho de Próximos Vuelos</h3>
            <p className="text-xs text-slate-400 mt-0.5">Sincronización en tiempo real con sistemas de radar local.</p>
          </div>
          <button
            onClick={() => onNavigateToView('vuelos')}
            className="font-semibold text-xs text-sky-600 hover:text-sky-700 transition-colors flex items-center gap-1.5 cursor-pointer bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100"
          >
            <span>Monitorear Todo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tabla Operacional */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#001c4a] text-xs font-mono font-medium text-slate-200">
                <th className="py-4 px-6 uppercase tracking-wider">Código de Vuelo</th>
                <th className="py-4 px-6 uppercase tracking-wider">Aerolínea</th>
                <th className="py-4 px-6 uppercase tracking-wider">Origen</th>
                <th className="py-4 px-6 uppercase tracking-wider">Destino</th>
                <th className="py-4 px-6 uppercase tracking-wider">Hora Programada</th>
                <th className="py-4 px-6 uppercase tracking-wider text-right">Estado Actual</th>
                <th className="py-4 px-6 uppercase tracking-wider text-center">Acción Rápida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 text-slate-700 text-sm">
              {premiumFlights.map((v, idx) => {
                const airlineCode = (v.aerolina || '').slice(0, 2).toUpperCase();

                // Estilo pulcro según estado pedido
                let badgeClass = 'bg-[#ecf5ff] text-[#0061a5] border border-[#d2e5ff]';
                let stateLabel = v.estado;

                if ((v.estado as string) === 'Retrasado' || (v.estado as string) === 'Retrasados') {
                  badgeClass = 'bg-[#fffbeb] text-[#b45309] border border-[#fef3c7]';
                  stateLabel = 'Retrasado';
                } else if ((v.estado as string) === 'Aterrizado' || (v.estado as string) === 'Completados' || (v.estado as string) === 'Completado' || (v.estado as string) === 'Confirmados') {
                  badgeClass = 'bg-[#ecfdf5] text-[#047857] border border-[#d1fae5]';
                  stateLabel = v.estado === 'Aterrizado' ? 'Aterrizado' : 'Completado';
                } else if (v.estado === 'Cancelado') {
                  badgeClass = 'bg-[#fef2f2] text-[#b91c1c] border border-[#fee2e2]';
                  stateLabel = 'Cancelado';
                } else if (v.estado === 'En Vuelo') {
                  badgeClass = 'bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]';
                  stateLabel = 'En Vuelo';
                }

                return (
                  <tr 
                    key={`${v.id}-${idx}`} 
                    className="hover:bg-slate-50/70 transition-all group even:bg-[#f8fafc]/50"
                  >
                    {/* Código de vuelo */}
                    <td className="py-4.5 px-6 font-mono font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {v.codigo}
                    </td>

                    {/* Aerolínea */}
                    <td className="py-4.5 px-6 text-slate-800">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-mono font-bold text-slate-500 border border-slate-200">
                          {airlineCode}
                        </span>
                        <span className="font-semibold text-slate-800">{v.aerolina}</span>
                      </div>
                    </td>

                    {/* Origen */}
                    <td className="py-4.5 px-6 text-slate-500 font-medium">
                      {v.origen}
                    </td>

                    {/* Destino */}
                    <td className="py-4.5 px-6 text-slate-900 font-semibold">
                      {v.destino}
                    </td>

                    {/* Hora Salida con soporte de retraso */}
                    <td className="py-4.5 px-6 font-mono text-xs">
                      {v.estado === 'Retrasado' || v.estado === 'Retrasados' ? (
                        <div className="flex flex-col">
                          <span className="text-amber-600 font-semibold">{v.salida}</span>
                          {v.hora_salida_real && (
                            <span className="text-[10px] text-slate-400 line-through">{v.hora_salida_real}</span>
                          )}
                        </div>
                      ) : v.estado === 'Cancelado' ? (
                        <span className="text-rose-500 font-semibold">Cancelado</span>
                      ) : (
                        <span className="text-slate-700 font-semibold">{v.salida}</span>
                      )}
                    </td>

                    {/* Estado de salida */}
                    <td className="py-4.5 px-6 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${badgeClass}`}>
                        {(v.estado === 'Retrasado' || v.estado === 'Retrasados') && (
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        )}
                        {v.estado === 'Aterrizado' && (
                          <PlaneLanding className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span>{stateLabel}</span>
                      </span>
                    </td>

                    {/* Acción Rápida */}
                    <td className="py-4.5 px-6 text-center">
                      <button
                        onClick={() => abrirGestion(v)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#000c24] hover:bg-slate-800 text-sky-300 hover:text-sky-200 text-[10px] font-mono font-bold rounded-lg border border-sky-400/20 hover:border-sky-400/40 transition-all cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Gestionar</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: GESTIÓN RÁPIDA DE VUELO */}
      {gestionarVuelo && (
        <div className="fixed inset-0 bg-[#001e40]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 animate-slide-up">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Gestión Rápida: {gestionarVuelo.codigo}
              </h3>
              <button
                onClick={() => setGestionarVuelo(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGuardarCambios} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-xs font-mono border border-red-100">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-semibold text-gray-500 uppercase mb-1.5">
                  Estado del Vuelo
                </label>
                <select
                  value={formEstado}
                  onChange={(e) => setFormEstado(e.target.value as Vuelo['estado'])}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                >
                  <option value="Programado">Programado</option>
                  <option value="En Vuelo">En Vuelo</option>
                  <option value="Aterrizado">Aterrizado</option>
                  <option value="Retrasado">Retrasado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-gray-500 uppercase mb-1.5">
                  Puerta de Embarque
                </label>
                <select
                  value={formPuerta}
                  onChange={(e) => setFormPuerta(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                >
                  <option value="G1">G1</option>
                  <option value="G2">G2</option>
                  <option value="G3">G3</option>
                  <option value="G4">G4</option>
                  <option value="G5">G5</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setGestionarVuelo(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 bg-[#000c24] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
                >
                  {formLoading && (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  )}
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
