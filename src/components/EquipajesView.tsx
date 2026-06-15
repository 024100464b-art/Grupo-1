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
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Control de Equipaje</h2>
          <p className="text-sm text-gray-400">Gestión, pesaje y rastreo de equipaje facturado en tiempo real en Velasco Astete.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-[#000511] text-white hover:bg-slate-900 px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:shadow-lg transition-all cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Registrar Equipaje</span>
        </button>
      </div>

      {/* Buscar y Filtro Específico (Bento Panel) */}
      <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-gray-200/50 p-6 shadow-md flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Caja de escáner específico */}
        <div className="w-full md:w-96 relative group">
          <ScanLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            value={localBaggageSearch}
            onChange={(e) => setLocalBaggageSearch(e.target.value)}
            placeholder="Código de Equipaje o Nombre Pasajero..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:bg-white text-gray-800 placeholder:text-gray-400/90 focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
          />
        </div>

        {/* Botones de Estamento */}
        <div className="flex flex-wrap gap-2">
          {/* Todos */}
          <button
            onClick={() => setActiveStatus('Todos')}
            className={`px-4 py-2 rounded-full border text-xs font-mono font-medium flex items-center gap-2 transition-all cursor-pointer ${
              activeStatus === 'Todos'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <span>Todos</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeStatus === 'Todos' ? 'bg-white text-blue-600' : 'bg-gray-100 text-gray-500'
            }`}>
              {equipajes.length}
            </span>
          </button>

          {/* En Tránsito */}
          <button
            onClick={() => setActiveStatus('En Tránsito')}
            className={`px-4 py-2 rounded-full border text-xs font-mono font-medium flex items-center gap-2 transition-all cursor-pointer ${
              activeStatus === 'En Tránsito'
                ? 'bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-100'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>En Tránsito</span>
          </button>

          {/* Entregado */}
          <button
            onClick={() => setActiveStatus('Entregado')}
            className={`px-4 py-2 rounded-full border text-xs font-mono font-medium flex items-center gap-2 transition-all cursor-pointer ${
              activeStatus === 'Entregado'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-100'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
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
                ? 'bg-red-50 text-red-700 border-red-300 ring-2 ring-red-100'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
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
              className="flex items-start gap-3 p-4 bg-red-950/10 border border-red-500/30 rounded-2xl shadow-md"
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
      <div className="bg-white border border-[#e2e8f0] shadow-md rounded-2xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#001c4a] text-xs font-mono text-slate-200 uppercase tracking-wider font-semibold">
                <th className="py-4 px-6">Código Equipaje</th>
                <th className="py-4 px-6">Pasajero Titular</th>
                <th className="py-4 px-6">Código Boleto</th>
                <th className="py-4 px-6 text-right font-semibold">Peso (kg)</th>
                <th className="py-4 px-6 text-center">Estado</th>
                <th className="py-4 px-6 text-right">Ficha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-sm text-slate-700 bg-white">
              {filteredEquipajes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-mono text-xs">
                    Ningún bolso de equipaje reporta coincidencias con la consulta.
                  </td>
                </tr>
              ) : (
                filteredEquipajes.map((eq, idx) => {
                  const isLost = eq.estado === 'Perdido';

                  return (
                    <tr 
                      key={`${eq.id}-${idx}`} 
                      className={`hover:bg-slate-50/75 transition-all group even:bg-slate-50/30 ${
                        isLost ? 'bg-red-50/25 hover:bg-rose-50/40' : ''
                      }`}
                    >
                      {/* Código de barra estandarizado */}
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <Barcode className={`w-4 h-4 ${isLost ? 'text-rose-500' : 'text-sky-600'}`} />
                          <span>{eq.codigo_equipaje}</span>
                        </div>
                      </td>

                      {/* Nombre Pasajero */}
                      <td className="py-4 px-6 font-semibold text-slate-900">{eq.pasajero_nombre}</td>

                      {/* Boleto Código */}
                      <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-500">{eq.codigo_boleto}</td>

                      {/* Peso en KG */}
                      <td className="py-4 px-6 font-mono font-bold text-right text-slate-950 pr-10">
                        {eq.peso.toFixed(1)} kg
                      </td>

                      {/* Estado */}
                      <td className="py-4 px-6 text-center">
                        {eq.estado === 'En Tránsito' ? (
                          <span className="inline-flex items-center gap-1.5 bg-[#ecf5ff] text-[#0061a5] border border-[#d2e5ff] px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            <span>En Tránsito</span>
                          </span>
                        ) : eq.estado === 'Entregado' ? (
                          <span className="inline-flex items-center gap-1.5 bg-[#ecfdf5] text-[#047857] border border-[#d1fae5] px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>Entregado</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-[#fef2f2] text-[#b91c1c] border border-[#fee2e2] px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase animate-pulse">
                            <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                            <span>Perdido</span>
                          </span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedEquipaje(eq)}
                            className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-sky-100"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => abrirGestion(eq)}
                            className="p-1.5 px-3 bg-[#000c24] hover:bg-slate-800 text-sky-300 hover:text-sky-200 rounded-lg border border-sky-400/20 hover:border-sky-400/40 transition-all cursor-pointer inline-flex items-center gap-1.5 text-[10px] font-mono font-bold"
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
        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50/50">
          <span className="text-xs text-gray-500 font-mono">
            Mostrando 1 a {filteredEquipajes.length} de {equipajes.length} registros de Cusco cargo
          </span>
          <div className="flex gap-2">
            <button className="p-1 border border-gray-200 rounded text-gray-300 cursor-pointer" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 border border-gray-200 rounded text-gray-300 cursor-pointer" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: REGISTRAR EQUIPAJE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#001e40]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Luggage className="w-5 h-5 text-[#0061a5]" />
                Registrar Equipaje / Cusco Cargo
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-xs font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-semibold text-gray-500 uppercase mb-1">Nombre Completo Pasajero *</label>
                <input
                  type="text"
                  value={pasajeroNombre}
                  onChange={(e) => setPasajeroNombre(e.target.value)}
                  placeholder="ej. Maria Gonzales"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-500 uppercase mb-1">Código de Boleto / TK *</label>
                  <input
                    type="text"
                    value={codigoBoleto}
                    onChange={(e) => setCodigoBoleto(e.target.value)}
                    placeholder="ej. TK-99214"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none font-mono uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-500 uppercase mb-1">Peso Estimado (kg) *</label>
                  <input
                    type="text"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    placeholder="ej. 23.0"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-gray-500 uppercase mb-1">Estado de Recepción</label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value as any)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none"
                >
                  <option value="En Tránsito">En Tránsito</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Perdido">Perdido</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer"
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
        <div className="fixed inset-0 bg-[#001e40]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 animate-slide-up">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Gestión: {gestionarEquipaje.codigo_equipaje}
              </h3>
              <button
                onClick={() => setGestionarEquipaje(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGuardarCambios} className="p-6 space-y-4">
              {editError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-xs font-mono border border-red-100">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-semibold text-gray-500 uppercase mb-1.5">
                  Estado del Equipaje
                </label>
                <select
                  value={editEstado}
                  onChange={(e) => setEditEstado(e.target.value as Equipaje['estado'])}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                >
                  <option value="En Tránsito">En Tránsito</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Perdido">Perdido</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setGestionarEquipaje(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2 bg-[#000c24] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
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
        <div className="fixed inset-0 bg-[#001e40]/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 relative">
            <button 
              onClick={() => setSelectedEquipaje(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <span className="p-2.5 bg-blue-50 text-[#0061a5] rounded-xl">
                <Luggage className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-bold text-gray-900 leading-tight">Equipaje Facturado</h3>
                <span className="text-xs text-gray-400 font-mono font-bold uppercase">{selectedEquipaje.codigo_equipaje}</span>
              </div>
            </div>

            <div className="space-y-3.5 border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <span className="text-xs text-gray-405 font-mono">PASAJERO:</span>
                <span className="text-sm font-bold text-gray-800">{selectedEquipaje.pasajero_nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-405 font-mono">BOLETO ASOCIADO:</span>
                <span className="text-sm font-mono font-bold text-blue-600">{selectedEquipaje.codigo_boleto}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-405 font-mono">PESO REGISTRADO:</span>
                <span className="text-sm font-mono font-bold text-gray-900">{selectedEquipaje.peso.toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-405 font-mono">ESTADO DE RASTREO:</span>
                <span className="text-xs font-mono font-bold uppercase">{selectedEquipaje.estado}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedEquipaje(null)}
              className="mt-6 w-full py-2.5 bg-[#000511] hover:bg-slate-900 text-white text-xs font-bold font-mono rounded-lg transition-colors cursor-pointer"
            >
              Cerrar Detalle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
