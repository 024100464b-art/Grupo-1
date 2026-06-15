/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Eye, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Plane, 
  AlertCircle,
  HelpCircle,
  Settings,
  Download
} from 'lucide-react';
import { Vuelo } from '../types';
import { hasSupabaseConfig } from '../supabase';
import SupabaseMissingBanner from './SupabaseMissingBanner';

interface VuelosViewProps {
  vuelos: Vuelo[];
  onAddVuelo: (vuelo: Omit<Vuelo, 'id'>) => Promise<Vuelo>;
  onUpdateEstadoVuelo: (id: string, nuevoEstado: Vuelo['estado'], nuevaPuerta?: string) => Promise<Vuelo>;
  searchTerm: string;
  openCreateImmediately: boolean;
  onCloseCreateImmediately: () => void;
}

export default function VuelosView({ 
  vuelos, 
  onAddVuelo, 
  onUpdateEstadoVuelo,
  searchTerm,
  openCreateImmediately,
  onCloseCreateImmediately
}: VuelosViewProps) {
  if (!hasSupabaseConfig) {
    return <SupabaseMissingBanner />;
  }

  // Detector de conflictos de puerta
  function detectarConflictosPuerta(lista: Vuelo[]): Set<string> {
    const conflictos = new Set<string>();
    const activos = lista.filter(v => v.estado !== 'Completado' && v.estado !== 'Cancelado' && v.puerta && v.puerta !== '-');
    for (let i = 0; i < activos.length; i++) {
      for (let j = i + 1; j < activos.length; j++) {
        if (activos[i].puerta !== activos[j].puerta) continue;
        const a = parseHora(activos[i].salida);
        const b = parseHora(activos[j].salida);
        if (a === null || b === null) continue;
        const diff = Math.abs(a - b);
        if (diff < 45) {
          conflictos.add(activos[i].id);
          conflictos.add(activos[j].id);
        }
      }
    }
    return conflictos;
  }
  function parseHora(h: string): number | null {
    const m = h.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!m) return null;
    let horas = parseInt(m[1], 10);
    const minutos = parseInt(m[2], 10);
    const ampm = m[3]?.toUpperCase();
    if (ampm === 'PM' && horas !== 12) horas += 12;
    if (ampm === 'AM' && horas === 12) horas = 0;
    return horas * 60 + minutos;
  }
  const conflictIds = detectarConflictosPuerta(vuelos);

  // Filtro de estado activo
  const [activeFilter, setActiveFilter] = useState<'Todos' | 'Programados' | 'En Vuelo' | 'Retrasados' | 'Completados'>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(openCreateImmediately);
  const [selectedVuelo, setSelectedVuelo] = useState<Vuelo | null>(null);

  // Estados del formulario para agregar vuelo
  const [formCodigo, setFormCodigo] = useState('');
  const [formAerolinea, setFormAerolinea] = useState('LATAM');
  const [formOrigen, setFormOrigen] = useState('');
  const [formDestino, setFormDestino] = useState('Cusco (CUZ)');
  const [formSalida, setFormSalida] = useState('');
  const [formLlegada, setFormLlegada] = useState('');
  const [formPuerta, setFormPuerta] = useState('G1');
  const [formEstado, setFormEstado] = useState<Vuelo['estado']>('Programado');
  const [formError, setFormError] = useState('');

  // Estado del modal de gestión rápida
  const [gestionarVuelo, setGestionarVuelo] = useState<Vuelo | null>(null);
  const [editEstado, setEditEstado] = useState<Vuelo['estado']>('Programado');
  const [editPuerta, setEditPuerta] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const abrirGestion = (v: Vuelo) => {
    setGestionarVuelo(v);
    setEditEstado(v.estado);
    setEditPuerta(v.puerta);
    setEditError('');
  };

  const handleGuardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gestionarVuelo) return;
    setEditLoading(true);
    setEditError('');

    try {
      await onUpdateEstadoVuelo(gestionarVuelo.id, editEstado, editPuerta || undefined);
      setGestionarVuelo(null);
    } catch {
      setEditError('Error al actualizar el vuelo.');
    } finally {
      setEditLoading(false);
    }
  };

  // Sincronizar estado si viene desde el Dashboard queriendo abrir inmediatamente el modal
  React.useEffect(() => {
    if (openCreateImmediately) {
      setIsModalOpen(true);
      onCloseCreateImmediately();
    }
  }, [openCreateImmediately]);

  // Lista de aerolíneas Cusco recomendadas
  const aerolineas = ['LATAM', 'Avianca', 'Sky Airline', 'JetSMART', 'Aerolíneas Argentinas'];

  // Filtrado de vuelos según el filtro de categoría y el término de búsqueda global
  const filteredFlights = vuelos.filter((v) => {
    // 1. Filtro de estado
    const matchesFilter =
      activeFilter === 'Todos' ||
      (activeFilter === 'Programados' && v.estado === 'Programado') ||
      (activeFilter === 'En Vuelo' && v.estado === 'En Vuelo') ||
      (activeFilter === 'Retrasados' && (v.estado === 'Retrasado' || v.estado === 'Retrasados')) ||
      (activeFilter === 'Completados' && (v.estado === 'Completado' || v.estado === 'Completados' || v.estado === 'Aterrizado'));

    // 2. Filtro de búsqueda textual (código de vuelo, aerolínea, origen, destino)
    const normalizedSearch = searchTerm.toLowerCase();
    const matchesSearch =
      v.codigo.toLowerCase().includes(normalizedSearch) ||
      v.aerolina.toLowerCase().includes(normalizedSearch) ||
      v.origen.toLowerCase().includes(normalizedSearch) ||
      v.destino.toLowerCase().includes(normalizedSearch);

    return matchesFilter && matchesSearch;
  });

  const handleOpenCreateModal = () => {
    setFormCodigo('');
    setFormOrigen('');
    setFormDestino('Cusco (CUZ)');
    setFormSalida('');
    setFormLlegada('');
    setFormPuerta('G1');
    setFormEstado('Programado');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCreateVuelo = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validaciones
    if (!formCodigo.trim()) {
      setFormError('Por favor ingrese el código del vuelo (ej. LA2014)');
      return;
    }
    if (!formOrigen.trim()) {
      setFormError('Por favor ingrese el origen del vuelo (ej. Lima (LIM))');
      return;
    }
    if (!formSalida.trim() || !formLlegada.trim()) {
      setFormError('Por favor complete las horas estimadas de salida y llegada');
      return;
    }

    try {
      await onAddVuelo({
        codigo: formCodigo.trim().toUpperCase(),
        aerolina: formAerolinea,
        origen: formOrigen.trim(),
        destino: formDestino.trim(),
        salida: formSalida.trim(),
        llegada: formLlegada.trim(),
        puerta: formPuerta,
        estado: formEstado,
      });

      setIsModalOpen(false);
    } catch {
      setFormError('Hubo un problema registrando el vuelo. Intente nuevamente.');
    }
  };

  const exportarManifiestoCSV = () => {
    const conflictIds = detectarConflictosPuerta(vuelos);
    const filtrados = vuelos.filter(v =>
      v.estado === 'Retrasado' || v.estado === 'Retrasados' || conflictIds.has(v.id)
    );
    if (filtrados.length === 0) {
      alert('No hay vuelos retrasados ni conflictos de slot para exportar.');
      return;
    }

    const BOM = '\uFEFF';
    const encabezados = ['ID Vuelo', 'Aerolínea', 'Puerta Asignada', 'Estado', 'Incumplimiento Operativo'];
    const filas = filtrados.map(v => {
      const incumplimiento = conflictIds.has(v.id)
        ? 'Conflicto de Slot (menos de 45 min entre vuelos en misma puerta)'
        : 'Retraso operativo';
      return [
        v.codigo,
        v.aerolina,
        v.puerta,
        v.estado,
        incumplimiento,
      ].map(celda => `"${celda.replace(/"/g, '""')}"`).join(',');
    });

    const csv = BOM + encabezados.join(',') + '\n' + filas.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reporte_demoras_cusco.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Panel Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Gestión de Vuelos</h2>
          <p className="text-sm text-gray-400 mt-1">Monitoreo, control y programación del tráfico aéreo en tiempo real.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportarManifiestoCSV}
            className="bg-[#161618] border border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4.5 h-4.5" />
            <span>Exportar Manifiesto de Retrasos (CSV)</span>
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Nuevo Vuelo</span>
          </button>
        </div>
      </div>

      {/* Contenedor Principal (Glassmorphic Table) */}
      <div className="glass-card bg-[#121214]/60 border border-white/5 rounded-xl overflow-hidden flex flex-col min-h-[500px]">
        {/* Barra de Filtros */}
        <div className="p-6 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 bg-[#161618]">
          <div className="flex flex-wrap gap-2">
            {(['Todos', 'Programados', 'En Vuelo', 'Retrasados', 'Completados'] as const).map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold font-mono transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-[#161618] text-gray-400 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
          <span className="text-xs font-mono text-gray-500">
            Filtros Activos: <strong className="text-gray-200">{activeFilter}</strong>
          </span>
        </div>

        {/* Tabla de Vuelos */}
        <div className="flex-grow p-6">
          <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#121214]/60">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-[#001c4a] font-mono text-xs text-gray-300 uppercase">
                  <th className="py-4 px-4 font-semibold">Código</th>
                  <th className="py-4 px-4 font-semibold">Aerolínea</th>
                  <th className="py-4 px-4 font-semibold">Origen</th>
                  <th className="py-4 px-4 font-semibold">Destino</th>
                  <th className="py-4 px-4 font-semibold">Salida</th>
                  <th className="py-4 px-4 font-semibold">Llegada</th>
                  <th className="py-4 px-4 font-semibold text-center">Puerta</th>
                  <th className="py-4 px-4 font-semibold text-center">Estado</th>
                  <th className="py-4 px-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-sm text-gray-200">
                {filteredFlights.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-gray-500 text-xs">
                      Ningún vuelo coincide con los filtros especificados.
                    </td>
                  </tr>
                ) : (
                  filteredFlights.map((v, idx) => {
                    const airlineInitials = (v.aerolina || '').slice(0, 2).toUpperCase();

                    // Mapeo estilístico exacto según pedido:
                    // Verde: Programado, Naranja: Retrasado, Rojo: Cancelado, Azul: En Vuelo / Completado
                    let labelClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                    let textLabel = v.estado;

                    if (v.estado === 'Retrasado' || v.estado === 'Retrasados') {
                      labelClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                      textLabel = 'Retrasado';
                    } else if (v.estado === 'En Vuelo') {
                      labelClass = 'bg-sky-500/10 text-sky-400 border-sky-500/20';
                      textLabel = 'En Vuelo';
                    } else if (v.estado === 'Completado' || v.estado === 'Completados' || v.estado === 'Aterrizado') {
                      labelClass = 'bg-sky-500/10 text-sky-400 border-sky-500/20';
                      textLabel = v.estado === 'Aterrizado' ? 'Aterrizado' : 'Completado';
                    } else if (v.estado === 'Cancelado') {
                      labelClass = 'bg-red-500/10 text-red-400 border-red-500/20';
                      textLabel = 'Cancelado';
                    } else if (v.estado === 'Programado' || v.estado === 'Programados') {
                      labelClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                    }

                    const esConflicto = conflictIds.has(v.id);

                    return (
                      <tr 
                        key={`${v.id}-${idx}`} 
                        className={`hover:bg-white/[0.02] transition-all group even:bg-white/[0.01] ${
                          esConflicto ? 'border-l-4 border-l-red-500 bg-red-950/5' : ''
                        }`}
                      >
                        <td className="py-4 px-4 font-bold text-white">{v.codigo}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6.5 h-6.5 rounded-lg bg-amber-600 text-white flex items-center justify-center text-[9px] font-bold">
                              {airlineInitials}
                            </span>
                            <span className="font-semibold text-gray-100">{v.aerolina}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-400 font-medium">{v.origen}</td>
                        <td className="py-4 px-4 font-semibold text-white">{v.destino}</td>
                        <td className="py-4 px-4 text-xs font-semibold text-gray-300">{v.salida}</td>
                        <td className="py-4 px-4 text-xs text-gray-400">{v.llegada}</td>
                        <td className={`py-4 px-4 text-center font-bold bg-[#161618] relative ${
                          esConflicto ? 'text-red-600' : 'text-gray-100'
                        }`}>
                          <div className="flex items-center justify-center gap-1.5">
                            <span>{v.puerta}</span>
                            {esConflicto && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-600/10 text-red-600 border border-red-400/40 rounded text-[9px] font-mono font-bold uppercase tracking-wider animate-pulse">
                                ¡Conflicto de Slot!
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${labelClass}`}>
                            {textLabel}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedVuelo(v)}
                              className="p-1.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-lg border border-amber-500/20 transition-colors cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Detalle</span>
                            </button>
                            <button
                              onClick={() => abrirGestion(v)}
                              className="p-1.5 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg border-0 transition-all cursor-pointer inline-flex items-center gap-1.5 text-[10px] font-mono font-bold"
                            >
                              <Settings className="w-3.5 h-3.5" />
                              <span>Gestionar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer con Paginacion ficticia */}
        <div className="border-t border-white/5 px-6 py-4 flex items-center justify-between bg-[#161618]">
          <span className="text-xs text-gray-400 font-mono">
            Mostrando 1 a {filteredFlights.length} de {vuelos.length} vuelos registrados en Cusco
          </span>
          <div className="flex gap-2">
            <button className="p-1.5 border border-white/5 rounded hover:bg-white/10 text-gray-400 hover:text-gray-200 disabled:opacity-40 cursor-pointer" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1.5 border border-white/5 rounded hover:bg-white/10 text-gray-400 hover:text-gray-200 disabled:opacity-40" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: REGISTRAR NUEVO VUELO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#121214]/95 rounded-xl w-full max-w-lg border border-white/10 shadow-2xl overflow-hidden animate-slide-up">
            <div className="px-6 py-4 bg-[#161618] border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Plane className="w-5 h-5 text-amber-500" />
                Registrar Nuevo Vuelo (Cusco Sector)
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVuelo} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-500/10 text-red-400 rounded-lg flex items-center gap-2 text-xs font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-400 uppercase mb-1">Código de Vuelo *</label>
                  <input
                    type="text"
                    value={formCodigo}
                    onChange={(e) => setFormCodigo(e.target.value)}
                    placeholder="ej. LA2014"
                    className="w-full bg-[#161618] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/30 uppercase font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-400 uppercase mb-1">Aerolínea *</label>
                  <select
                    value={formAerolinea}
                    onChange={(e) => setFormAerolinea(e.target.value)}
                    className="w-full bg-[#161618] text-gray-200 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/30"
                  >
                    {aerolineas.map((airline) => (
                      <option key={airline} value={airline}>{airline}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-400 uppercase mb-1">Origen *</label>
                  <input
                    type="text"
                    value={formOrigen}
                    onChange={(e) => setFormOrigen(e.target.value)}
                    placeholder="ej. Lima (LIM)"
                    className="w-full bg-[#161618] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-400 uppercase mb-1">Destino *</label>
                  <input
                    type="text"
                    value={formDestino}
                    onChange={(e) => setFormDestino(e.target.value)}
                    placeholder="ej. Cusco (CUZ)"
                    className="w-full bg-[#161618] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/30"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-400 uppercase mb-1">Hora Salida Estimada *</label>
                  <input
                    type="text"
                    value={formSalida}
                    onChange={(e) => setFormSalida(e.target.value)}
                    placeholder="ej. 10:45 AM"
                    className="w-full bg-[#161618] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/30 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-400 uppercase mb-1">Hora Llegada Estimada *</label>
                  <input
                    type="text"
                    value={formLlegada}
                    onChange={(e) => setFormLlegada(e.target.value)}
                    placeholder="ej. 11:55 AM"
                    className="w-full bg-[#161618] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/30 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-400 uppercase mb-1">Puerta</label>
                  <select
                    value={formPuerta}
                    onChange={(e) => setFormPuerta(e.target.value)}
                    className="w-full bg-[#161618] text-gray-200 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/30"
                  >
                    <option value="G1">G1</option>
                    <option value="G2">G2</option>
                    <option value="G3">G3</option>
                    <option value="G4">G4</option>
                    <option value="G5">G5</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-400 uppercase mb-1">Estado Operativo</label>
                  <select
                    value={formEstado}
                    onChange={(e) => setFormEstado(e.target.value as Vuelo['estado'])}
                    className="w-full bg-[#161618] text-gray-200 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/30"
                  >
                    <option value="Programado">Programado</option>
                    <option value="En Vuelo">En Vuelo</option>
                    <option value="Retrasados">Retrasado</option>
                    <option value="Completados">Completado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#161618] hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer"
                >
                  Guardar Vuelo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              {editError && (
                <div className="p-3 bg-red-500/10 text-red-400 rounded-lg flex items-center gap-2 text-xs font-mono border border-red-500/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-semibold text-gray-400 uppercase mb-1.5">
                  Estado del Vuelo
                </label>
                <select
                  value={editEstado}
                  onChange={(e) => setEditEstado(e.target.value as Vuelo['estado'])}
                  className="w-full bg-[#161618] text-gray-200 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500/30"
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
                  value={editPuerta}
                  onChange={(e) => setEditPuerta(e.target.value)}
                  className="w-full bg-[#161618] text-gray-200 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500/30"
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
                  disabled={editLoading}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
                >
                  {editLoading && (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  )}
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL / BOTTOM SHEET: VER DETALLE DEL VUELO */}
      {selectedVuelo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#121214]/95 rounded-xl w-full max-w-md border border-white/10 shadow-2xl overflow-hidden animate-slide-up">
            <div className="px-6 py-4 bg-[#161618] border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-white">
                Ficha Técnica: {selectedVuelo.codigo}
              </h3>
              <button 
                onClick={() => setSelectedVuelo(null)}
                className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-xs text-gray-500 uppercase font-mono">Aerolínea</span>
                <span className="text-sm font-semibold text-white">{selectedVuelo.aerolina}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-xs text-gray-500 uppercase font-mono">Código</span>
                <span className="text-sm font-bold text-amber-500 font-mono">{selectedVuelo.codigo}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-xs text-gray-500 uppercase font-mono">Ruta Aérea</span>
                <span className="text-sm font-medium text-white flex items-center gap-1.5">
                  <span>{selectedVuelo.origen}</span>
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{selectedVuelo.destino}</span>
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-xs text-gray-500 uppercase font-mono">Salida / Llegada</span>
                <span className="text-sm font-mono font-medium text-gray-200">
                  {selectedVuelo.salida} &rarr; {selectedVuelo.llegada}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-xs text-gray-500 uppercase font-mono">Puerta Asignada</span>
                <span className="text-sm font-bold text-white font-mono">{selectedVuelo.puerta}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-xs text-gray-500 uppercase font-mono">Estado Actual</span>
                <span className="text-xs font-bold font-mono text-amber-500 uppercase">{selectedVuelo.estado}</span>
              </div>
            </div>
            <div className="px-6 py-4 bg-[#161618] border-t border-white/5 text-right">
              <button 
                onClick={() => setSelectedVuelo(null)}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-lg cursor-pointer shadow"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
