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
    <div className="space-y-8 pb-4">
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-[11px] font-semibold text-amber-400 font-mono tracking-wider uppercase">
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
        <div className="bg-[#121214]/60 border border-white/5 rounded-xl p-5 relative overflow-hidden group hover:border-amber-500/20 transition-all duration-300">
          <div className="absolute -right-5 -top-5 w-20 h-20 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">TOTAL VUELOS</span>
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
              <Plane className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-extrabold text-white leading-none tracking-tight">{formatStat(stats.total_vuelos)}</span>
            <p className="text-[10px] text-emerald-400 font-medium font-mono mt-1">CUZ Sector</p>
          </div>
        </div>

        {/* Card 2: Programados */}
        <div className="bg-[#121214]/60 border border-white/5 rounded-xl p-5 relative overflow-hidden group hover:border-amber-500/20 transition-all duration-300">
          <div className="absolute -right-5 -top-5 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">PROGRAMADOS</span>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-extrabold text-white leading-none tracking-tight">{formatStat(stats.vuelos_programados)}</span>
            <p className="text-[10px] text-emerald-400 font-medium font-mono mt-1">&bull; Confirmados</p>
          </div>
        </div>

        {/* Card 3: Retrasados */}
        <div className="bg-[#121214]/60 border border-white/5 rounded-xl p-5 relative overflow-hidden group hover:border-amber-500/20 transition-all duration-300">
          <div className="absolute -right-5 -top-5 w-20 h-20 bg-orange-500/5 rounded-full blur-xl group-hover:bg-orange-500/10 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">RETRASADOS</span>
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-650 leading-none tracking-tight">{stats.vuelos_retrasados}</span>
            <span className="flex items-center text-[10px] text-red-400 font-bold bg-red-500/10 px-1.5 py-0.5 rounded-full border border-red-500/20">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              <span>+3</span>
            </span>
          </div>
        </div>

        {/* Card 4: Pasajeros */}
        <div className="bg-[#121214]/60 border border-white/5 rounded-xl p-5 relative overflow-hidden group hover:border-amber-500/20 transition-all duration-300">
          <div className="absolute -right-5 -top-5 w-20 h-20 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">PASAJEROS</span>
            <div className="p-2.5 bg-amber-500/5 text-amber-500 rounded-xl border border-amber-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-extrabold text-white leading-none tracking-tight">{formatStat(stats.total_pasajeros, true)}</span>
            <p className="text-[10px] text-amber-500 font-medium font-mono mt-1">Hoy registrados</p>
          </div>
        </div>

        {/* Card 5: Boletos */}
        <div className="bg-[#121214]/60 border border-white/5 rounded-xl p-5 relative overflow-hidden group hover:border-amber-500/20 transition-all duration-300">
          <div className="absolute -right-5 -top-5 w-20 h-20 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">BOLETOS</span>
            <div className="p-2.5 bg-amber-500/5 text-amber-500 rounded-xl border border-amber-500/20">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-extrabold text-white leading-none tracking-tight">{formatStat(stats.total_boletos, true)}</span>
            <p className="text-[10px] text-amber-500 font-medium font-mono mt-1">Emitidos hoy</p>
          </div>
        </div>

        {/* Card 6: Equipajes */}
        <div className="bg-[#121214]/60 border border-white/5 rounded-xl p-5 relative overflow-hidden group hover:border-amber-500/20 transition-all duration-300">
          <div className="absolute -right-5 -top-5 w-20 h-20 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">EQUIPAJES</span>
            <div className="p-2.5 bg-amber-500/5 text-amber-500 rounded-xl border border-amber-500/20">
              <Luggage className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-extrabold text-white leading-none tracking-tight">{formatStat(stats.total_equipajes, true)}</span>
            <p className="text-[10px] text-amber-500 font-medium font-mono mt-1">Bultos en bodega</p>
          </div>
        </div>
      </div>

      {/* Simulador Gerencial Predictivo */}
      <SimuladorGemini />

      {/* Proyección de Staffing */}
      <ProyeccionStaffing vuelos={vuelos} />

      {/* Tabla: Próximos Vuelos de Alta Estética */}
      <div className="bg-[#121214]/60 border border-white/5 rounded-xl overflow-hidden flex flex-col">
        {/* Cabecera de la sección */}
        <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-[#161618]">
          <div>
            <h3 className="font-display font-semibold text-lg text-white">Despacho de Próximos Vuelos</h3>
            <p className="text-xs text-gray-400 mt-0.5">Sincronización en tiempo real con sistemas de radar local.</p>
          </div>
          <button
            onClick={() => onNavigateToView('vuelos')}
            className="font-semibold text-xs text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20"
          >
            <span>Monitorear Todo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tabla Operacional */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-[#001c4a] text-xs font-mono font-semibold text-gray-300">
                <th className="py-4 px-6 uppercase tracking-wider">Código de Vuelo</th>
                <th className="py-4 px-6 uppercase tracking-wider">Aerolínea</th>
                <th className="py-4 px-6 uppercase tracking-wider">Origen</th>
                <th className="py-4 px-6 uppercase tracking-wider">Destino</th>
                <th className="py-4 px-6 uppercase tracking-wider">Hora Programada</th>
                <th className="py-4 px-6 uppercase tracking-wider text-right">Estado Actual</th>
                <th className="py-4 px-6 uppercase tracking-wider text-center">Acción Rápida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-200 text-sm">
              {premiumFlights.map((v, idx) => {
                const airlineCode = (v.aerolina || '').slice(0, 2).toUpperCase();

                // Estilo pulcro según estado pedido
                let badgeClass = 'bg-sky-500/10 text-sky-400 border-sky-500/20';
                let stateLabel = v.estado;

                if ((v.estado as string) === 'Retrasado' || (v.estado as string) === 'Retrasados') {
                  badgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                  stateLabel = 'Retrasado';
                } else if ((v.estado as string) === 'Aterrizado' || (v.estado as string) === 'Completados' || (v.estado as string) === 'Completado' || (v.estado as string) === 'Confirmados') {
                  badgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                  stateLabel = v.estado === 'Aterrizado' ? 'Aterrizado' : 'Completado';
                } else if (v.estado === 'Cancelado') {
                  badgeClass = 'bg-red-500/10 text-red-400 border-red-500/20';
                  stateLabel = 'Cancelado';
                } else if (v.estado === 'En Vuelo') {
                  badgeClass = 'bg-sky-500/10 text-sky-400 border-sky-500/20';
                  stateLabel = 'En Vuelo';
                }

                return (
                  <tr 
                    key={`${v.id}-${idx}`} 
                    className="hover:bg-white/[0.02] transition-all group even:bg-white/[0.01]"
                  >
                    {/* Código de vuelo */}
                    <td className="py-4.5 px-6 font-mono font-bold text-white group-hover:text-amber-500 transition-colors">
                      {v.codigo}
                    </td>

                    {/* Aerolínea */}
                    <td className="py-4.5 px-6 text-gray-200">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 bg-[#161618] rounded-full flex items-center justify-center text-[10px] font-mono font-bold text-gray-400 border border-white/5">
                          {airlineCode}
                        </span>
                        <span className="font-semibold text-gray-200">{v.aerolina}</span>
                      </div>
                    </td>

                    {/* Origen */}
                    <td className="py-4.5 px-6 text-gray-400 font-medium">
                      {v.origen}
                    </td>

                    {/* Destino */}
                    <td className="py-4.5 px-6 text-white font-semibold">
                      {v.destino}
                    </td>

                    {/* Hora Salida con soporte de retraso */}
                    <td className="py-4.5 px-6 font-mono text-xs">
                      {v.estado === 'Retrasado' || v.estado === 'Retrasados' ? (
                        <div className="flex flex-col">
                          <span className="text-amber-600 font-semibold">{v.salida}</span>
                          {v.hora_salida_real && (
                            <span className="text-[10px] text-gray-500 line-through">{v.hora_salida_real}</span>
                          )}
                        </div>
                      ) : v.estado === 'Cancelado' ? (
                        <span className="text-rose-500 font-semibold">Cancelado</span>
                      ) : (
                        <span className="text-gray-200 font-semibold">{v.salida}</span>
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-mono font-bold rounded-lg border border-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#121214]/95 rounded-xl w-full max-w-md border border-white/10 shadow-2xl overflow-hidden animate-slide-up">
            <div className="px-6 py-4 bg-[#161618] border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-500" />
                Gestión Rápida: {gestionarVuelo.codigo}
              </h3>
              <button
                onClick={() => setGestionarVuelo(null)}
                className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGuardarCambios} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-500/10 text-red-400 rounded-lg flex items-center gap-2 text-xs font-mono border border-red-500/20">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-semibold text-gray-400 uppercase mb-1.5">
                  Estado del Vuelo
                </label>
                <select
                  value={formEstado}
                  onChange={(e) => setFormEstado(e.target.value as Vuelo['estado'])}
                  className="w-full border border-white/10 rounded-lg px-3 py-2.5 text-sm bg-[#161618] focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500/30"
                >
                  <option value="Programado">Programado</option>
                  <option value="En Vuelo">En Vuelo</option>
                  <option value="Aterrizado">Aterrizado</option>
                  <option value="Retrasado">Retrasado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-gray-400 uppercase mb-1.5">
                  Puerta de Embarque
                </label>
                <select
                  value={formPuerta}
                  onChange={(e) => setFormPuerta(e.target.value)}
                  className="w-full border border-white/10 rounded-lg px-3 py-2.5 text-sm bg-[#161618] focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500/30"
                >
                  <option value="G1">G1</option>
                  <option value="G2">G2</option>
                  <option value="G3">G3</option>
                  <option value="G4">G4</option>
                  <option value="G5">G5</option>
                </select>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setGestionarVuelo(null)}
                  className="px-4 py-2 bg-[#161618] hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
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
