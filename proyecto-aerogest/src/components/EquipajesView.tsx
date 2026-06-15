/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Barcode, 
  ScanLine, 
  Eye, 
  Edit3, 
  X, 
  Luggage, 
  ChevronLeft, 
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Settings
} from 'lucide-react';
import { Equipaje } from '../types';
import { hasSupabaseConfig } from '../supabase';
import SupabaseMissingBanner from './SupabaseMissingBanner';

interface EquipajesViewProps {
  equipajes: Equipaje[];
  onAddEquipaje: (equipaje: Omit<Equipaje, 'id'>) => Promise<Equipaje>;
  onUpdateEstadoEquipaje: (id: string, nuevoEstado: Equipaje['estado']) => Promise<Equipaje>;
  searchTerm: string;
}

export default function EquipajesView({ 
  equipajes, 
  onAddEquipaje, 
  onUpdateEstadoEquipaje,
  searchTerm 
}: EquipajesViewProps) {
  if (!hasSupabaseConfig) {
    return <SupabaseMissingBanner />;
  }

  // Filtros de estado internos
  const [activeStatus, setActiveStatus] = useState<'Todos' | 'En Tránsito' | 'Entregado' | 'Perdido'>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipaje, setSelectedEquipaje] = useState<Equipaje | null>(null);

  // Formulario nuevo
  const [pasajeroNombre, setPasajeroNombre] = useState('');
  const [codigoBoleto, setCodigoBoleto] = useState('');
  const [peso, setPeso] = useState('23.0');
  const [estado, setEstado] = useState<'En Tránsito' | 'Entregado' | 'Perdido'>('En Tránsito');
  const [formError, setFormError] = useState('');

  // Estado del modal de gestión rápida de equipaje
  const [gestionarEquipaje, setGestionarEquipaje] = useState<Equipaje | null>(null);
  const [editEstado, setEditEstado] = useState<Equipaje['estado']>('En Tránsito');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const abrirGestion = (eq: Equipaje) => {
    setGestionarEquipaje(eq);
    setEditEstado(eq.estado);
    setEditError('');
  };

  const handleGuardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gestionarEquipaje) return;
    setEditLoading(true);
    setEditError('');

    try {
      await onUpdateEstadoEquipaje(gestionarEquipaje.id, editEstado);
      setGestionarEquipaje(null);
    } catch {
      setEditError('Error al actualizar el equipaje.');
    } finally {
      setEditLoading(false);
    }
  };

  // Detector SLA: equipajes no entregados son candidatos a alerta
  function detectarAlertasSLA(lista: Equipaje[]): { alertas: { faja: number; items: Equipaje[] }[] } {
    const pendientes = lista.filter(eq => eq.estado !== 'Entregado');
    const grupos = new Map<number, Equipaje[]>();
    for (const eq of pendientes) {
      const faja = (eq.codigo_equipaje.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 5) + 1;
      if (!grupos.has(faja)) grupos.set(faja, []);
      grupos.get(faja)!.push(eq);
    }
    const alertas = Array.from(grupos.entries())
      .filter(([, items]) => items.length >= 1)
      .map(([faja, items]) => ({ faja, items }));
    return { alertas };
  }
  const sla = detectarAlertasSLA(equipajes);

  // Sincronizar búsqueda local específica para código de equipaje o pasajero
  const [localBaggageSearch, setLocalBaggageSearch] = useState('');

  const filteredEquipajes = equipajes.filter((eq) => {
    // 1. Filtrar por estado
    const matchesStatus = activeStatus === 'Todos' || eq.estado === activeStatus;

    // 2. Filtrar por término de búsqueda global y local específica
    const term = (searchTerm || localBaggageSearch).toLowerCase();
    const matchesSearch = 
      eq.codigo_equipaje.toLowerCase().includes(term) ||
      eq.pasajero_nombre.toLowerCase().includes(term) ||
      eq.codigo_boleto.toLowerCase().includes(term);

    return matchesStatus && matchesSearch;
  });

  const handleOpenCreateModal = () => {
    setPasajeroNombre('');
    setCodigoBoleto('');
    setPeso('23.0');
    setEstado('En Tránsito');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!pasajeroNombre.trim()) {
      setFormError('Ingrese el nombre del pasajero titular.');
      return;
    }
    if (!codigoBoleto.trim()) {
      setFormError('Indique el boleto aéreo vinculado (ej. TK-99214).');
      return;
    }
    const numPeso = parseFloat(peso);
    if (isNaN(numPeso) || numPeso <= 0) {
      setFormError('Especifique un peso en kg válido.');
      return;
    }

    // Generar un código de equipaje Cusco estándar, ej: CUZ-8114-A
    const codePart = Math.floor(1000 + Math.random() * 9000);
    const letterPart = ['A', 'B', 'C'][Math.floor(Math.random() * 3)];
    const generatedCode = `CUZ-${codePart}-${letterPart}`;

    try {
      await onAddEquipaje({
        codigo_equipaje: generatedCode,
        pasajero_id: `PAS-${Math.floor(100 + Math.random() * 900)}`,
        pasajero_nombre: pasajeroNombre.trim(),
        codigo_boleto: codigoBoleto.trim().toUpperCase(),
        peso: numPeso,
        estado,
      });
      setIsModalOpen(false);
    } catch {
      setFormError('Ocurrió un error al registrar el equipaje.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Control de Equipaje</h2>
          <p className="text-sm text-gray-500">Gestión, pesaje y rastreo de equipaje facturado en tiempo real en Velasco Astete.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:border-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Registrar Equipaje</span>
        </button>
      </div>

      {/* Buscar y Filtro Específico (Bento Panel) */}
      <div className="glass-card bg-[#121214]/60 border border-white/5 rounded-xl p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Caja de escáner específico */}
        <div className="w-full md:w-96 relative group">
          <ScanLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
          <input
            type="text"
            value={localBaggageSearch}
            onChange={(e) => setLocalBaggageSearch(e.target.value)}
            placeholder="Código de Equipaje o Nombre Pasajero..."
            className="w-full bg-[#161618] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:bg-[#161618] text-gray-100 placeholder:text-gray-400/90 focus:outline-none focus:ring-1 focus:ring-amber-500/20 focus:border-amber-500/30 transition-all font-mono"
          />
        </div>

        {/* Botones de Estamento */}
        <div className="flex flex-wrap gap-2">
          {/* Todos */}
          <button
            onClick={() => setActiveStatus('Todos')}
            className={`px-4 py-2 rounded-full border text-xs font-mono font-medium flex items-center gap-2 transition-all cursor-pointer ${
              activeStatus === 'Todos'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-[#121214]/60 text-gray-200 border-white/5 hover:bg-white/[0.02]'
            }`}
          >
            <span>Todos</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeStatus === 'Todos' ? 'bg-[#121214]/60 text-amber-500' : 'bg-[#161618] text-gray-400'
            }`}>
              {equipajes.length}
            </span>
          </button>

          {/* En Tránsito */}
          <button
            onClick={() => setActiveStatus('En Tránsito')}
            className={`px-4 py-2 rounded-full border text-xs font-mono font-medium flex items-center gap-2 transition-all cursor-pointer ${
              activeStatus === 'En Tránsito'
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 ring-2 ring-amber-500/10'
                : 'bg-[#121214]/60 text-gray-200 border-white/5 hover:bg-white/[0.02]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            <span>En Tránsito</span>
          </button>

          {/* Entregado */}
          <button
            onClick={() => setActiveStatus('Entregado')}
            className={`px-4 py-2 rounded-full border text-xs font-mono font-medium flex items-center gap-2 transition-all cursor-pointer ${
              activeStatus === 'Entregado'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 ring-2 ring-emerald-500/10'
                : 'bg-[#121214]/60 text-gray-200 border-white/5 hover:bg-white/[0.02]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Entregado</span>
          </button>

          {/* Perdido */}
          <button
            onClick={() => setActiveStatus('Perdido')}
            className={`px-4 py-2 rounded-full border text-xs font-mono font-medium flex items-center gap-2 transition-all cursor-pointer ${
              activeStatus === 'Perdido'
                ? 'bg-red-500/10 text-red-400 border-red-500/20 ring-2 ring-red-500/10'
                : 'bg-[#121214]/60 text-gray-200 border-white/5 hover:bg-white/[0.02]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>Perdido</span>
          </button>
        </div>
      </div>

      {/* Alertas SLA */}
      {sla.alertas.length > 0 && (
        <div className="space-y-2">
          {sla.alertas.map(({ faja, items }) => (
            <div
              key={faja}
              className="flex items-start gap-3 p-4 bg-red-950/10 border border-red-500/30 rounded-xl"
            >
              <span className="p-2 bg-red-600/10 rounded-xl text-red-500 border border-red-400/30 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-red-600 uppercase tracking-wider">
                    ALERTA SLA EXCEDIDA
                  </span>
                  <span className="px-2 py-0.5 bg-red-600/10 text-red-600 border border-red-400/30 rounded text-[10px] font-mono font-bold animate-pulse">
                    {items.length} pendiente{items.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-sm font-mono text-red-400/90">
                  Faja <strong className="text-red-300">{faja}</strong> requiere atención inmediata — {items.length} equipaje{items.length !== 1 ? 's' : ''} no entregado{items.length !== 1 ? 's' : ''}.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabla Principal de Estilo Operacional */}
      <div className="bg-[#121214]/60 border border-white/5 rounded-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-[#001c4a] text-xs font-mono text-gray-300 uppercase tracking-wider font-semibold">
                <th className="py-4 px-6">Código Equipaje</th>
                <th className="py-4 px-6">Pasajero Titular</th>
                <th className="py-4 px-6">Código Boleto</th>
                <th className="py-4 px-6 text-right font-semibold">Peso (kg)</th>
                <th className="py-4 px-6 text-center">Estado</th>
                <th className="py-4 px-6 text-right">Ficha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-gray-200 bg-transparent">
              {filteredEquipajes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 font-mono text-xs">
                    Ningún bolso de equipaje reporta coincidencias con la consulta.
                  </td>
                </tr>
              ) : (
                filteredEquipajes.map((eq, idx) => {
                  const isLost = eq.estado === 'Perdido';

                  return (
                    <tr 
                      key={`${eq.id}-${idx}`} 
                      className={`hover:bg-white/[0.02] transition-all group even:bg-white/[0.01] ${
                        isLost ? 'bg-red-500/10 hover:bg-red-500/15' : ''
                      }`}
                    >
                      {/* Código de barra estandarizado */}
                      <td className="py-4 px-6 font-mono font-bold text-white">
                        <div className="flex items-center gap-2">
                          <Barcode className={`w-4 h-4 ${isLost ? 'text-rose-500' : 'text-amber-500'}`} />
                          <span>{eq.codigo_equipaje}</span>
                        </div>
                      </td>

                      {/* Nombre Pasajero */}
                      <td className="py-4 px-6 font-semibold text-white">{eq.pasajero_nombre}</td>

                      {/* Boleto Código */}
                      <td className="py-4 px-6 font-mono text-xs font-semibold text-gray-400">{eq.codigo_boleto}</td>

                      {/* Peso en KG */}
                      <td className="py-4 px-6 font-mono font-bold text-right text-white pr-10">
                        {eq.peso.toFixed(1)} kg
                      </td>

                      {/* Estado */}
                      <td className="py-4 px-6 text-center">
                        {eq.estado === 'En Tránsito' ? (
                          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            <span>En Tránsito</span>
                          </span>
                        ) : eq.estado === 'Entregado' ? (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>Entregado</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase animate-pulse">
                            <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
                            <span>Perdido</span>
                          </span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedEquipaje(eq)}
                            className="p-1.5 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-amber-500/20"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => abrirGestion(eq)}
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

        {/* Footer */}
        <div className="border-t border-white/5 px-6 py-4 flex items-center justify-between bg-[#161618]">
          <span className="text-xs text-gray-400 font-mono">
            Mostrando 1 a {filteredEquipajes.length} de {equipajes.length} registros de Cusco cargo
          </span>
          <div className="flex gap-2">
            <button className="p-1 border border-white/5 rounded text-gray-500 cursor-pointer" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 border border-white/5 rounded text-gray-500 cursor-pointer" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: REGISTRAR EQUIPAJE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#121214]/95 rounded-xl w-full max-w-md overflow-hidden border border-white/10">
            <div className="px-6 py-4 bg-[#161618] border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Luggage className="w-5 h-5 text-amber-500" />
                Registrar Equipaje / Cusco Cargo
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-500/10 text-red-400 rounded-lg flex items-center gap-2 text-xs font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-semibold text-gray-400 uppercase mb-1">Nombre Completo Pasajero *</label>
                <input
                  type="text"
                  value={pasajeroNombre}
                  onChange={(e) => setPasajeroNombre(e.target.value)}
                  placeholder="ej. Maria Gonzales"
                  className="w-full bg-[#161618] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500/30"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-400 uppercase mb-1">Código de Boleto / TK *</label>
                  <input
                    type="text"
                    value={codigoBoleto}
                    onChange={(e) => setCodigoBoleto(e.target.value)}
                    placeholder="ej. TK-99214"
                    className="w-full bg-[#161618] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500/30 font-mono uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-400 uppercase mb-1">Peso Estimado (kg) *</label>
                  <input
                    type="text"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    placeholder="ej. 23.0"
                    className="w-full bg-[#161618] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500/30 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-gray-400 uppercase mb-1">Estado de Recepción</label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value as any)}
                  className="w-full bg-[#161618] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="En Tránsito">En Tránsito</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Perdido">Perdido</option>
                </select>
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
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Confirmar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GESTIÓN RÁPIDA DE EQUIPAJE */}
      {gestionarEquipaje && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#121214]/95 rounded-xl w-full max-w-md overflow-hidden border border-white/10 animate-slide-up">
            <div className="px-6 py-4 bg-[#161618] border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-500" />
                Gestión: {gestionarEquipaje.codigo_equipaje}
              </h3>
              <button
                onClick={() => setGestionarEquipaje(null)}
                className="text-gray-500 hover:text-gray-400 transition-colors cursor-pointer"
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
                  Estado del Equipaje
                </label>
                <select
                  value={editEstado}
                  onChange={(e) => setEditEstado(e.target.value as Equipaje['estado'])}
                  className="w-full bg-[#161618] border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500/30"
                >
                  <option value="En Tránsito">En Tránsito</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Perdido">Perdido</option>
                </select>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setGestionarEquipaje(null)}
                  className="px-4 py-2 bg-[#161618] hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
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

      {/* DETALLE EQUIPAJE */}
      {selectedEquipaje && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#121214]/95 rounded-xl w-full max-w-sm p-6 relative border border-white/10">
            <button 
              onClick={() => setSelectedEquipaje(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <span className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
                <Luggage className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-bold text-white leading-tight">Equipaje Facturado</h3>
                <span className="text-xs text-gray-500 font-mono font-bold uppercase">{selectedEquipaje.codigo_equipaje}</span>
              </div>
            </div>

            <div className="space-y-3.5 border-t border-white/5 pt-4">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 font-mono">PASAJERO:</span>
                <span className="text-sm font-bold text-gray-100">{selectedEquipaje.pasajero_nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 font-mono">BOLETO ASOCIADO:</span>
                <span className="text-sm font-mono font-bold text-amber-500">{selectedEquipaje.codigo_boleto}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 font-mono">PESO REGISTRADO:</span>
                <span className="text-sm font-mono font-bold text-white">{selectedEquipaje.peso.toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 font-mono">ESTADO DE RASTREO:</span>
                <span className="text-xs font-mono font-bold uppercase text-white">{selectedEquipaje.estado}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedEquipaje(null)}
              className="mt-6 w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold font-mono rounded-lg transition-colors cursor-pointer"
            >
              Cerrar Detalle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
