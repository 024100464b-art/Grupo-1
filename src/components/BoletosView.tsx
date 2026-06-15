/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  ShieldAlert, 
  MoreVertical, 
  Plane, 
  X, 
  Briefcase, 
  ChevronLeft, 
  ChevronRight,
  Info,
  Ticket
} from 'lucide-react';
import { Boleto } from '../types';
import { hasSupabaseConfig } from '../supabase';
import SupabaseMissingBanner from './SupabaseMissingBanner';

interface BoletosViewProps {
  boletos: Boleto[];
  onAddBoleto: (boleto: Omit<Boleto, 'id' | 'pasajero_avatar_iniciales'>) => Promise<Boleto>;
  searchTerm: string;
}

export default function BoletosView({ 
  boletos, 
  onAddBoleto, 
  searchTerm 
}: BoletosViewProps) {
  if (!hasSupabaseConfig) {
    return <SupabaseMissingBanner />;
  }

  // Filtros internos
  const [activeStatusFilter, setActiveStatusFilter] = useState<'Todos' | 'Confirmado' | 'Pendiente' | 'Cancelado'>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBoleto, setSelectedBoleto] = useState<Boleto | null>(null);

  // Formulario
  const [pasajeroNombre, setPasajeroNombre] = useState('');
  const [vueloCodigo, setVueloCodigo] = useState('CUZ-742');
  const [asiento, setAsiento] = useState('');
  const [precio, setPrecio] = useState('110.00');
  const [estado, setEstado] = useState<'Confirmado' | 'Pendiente' | 'Cancelado'>('Confirmado');
  const [formError, setFormError] = useState('');

  // Auto-cargar búsqueda del pasajero si viene pre-filtrado por redirigir desde Pasajeros
  React.useEffect(() => {
    if (searchTerm) {
      setPasajeroNombre(searchTerm);
    }
  }, [searchTerm]);

  const filteredBoletos = boletos.filter((b) => {
    // Filtrar por estado
    const matchesStatus = activeStatusFilter === 'Todos' || b.estado === activeStatusFilter;

    // Filtrar por término de búsqueda (código de boleto, nombre de pasajero, código de vuelo)
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      b.codigo_boleto.toLowerCase().includes(term) ||
      b.pasajero_nombre.toLowerCase().includes(term) ||
      b.vuelo_codigo.toLowerCase().includes(term);

    return matchesStatus && matchesSearch;
  });

  const handleOpenCreateModal = () => {
    setPasajeroNombre('');
    setVueloCodigo('CUZ-742');
    setAsiento('');
    setPrecio('110.00');
    setEstado('Confirmado');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!pasajeroNombre.trim()) {
      setFormError('Debe ingresar el nombre completo del pasajero.');
      return;
    }
    if (!vueloCodigo.trim()) {
      setFormError('Especifique el código identificador del vuelo (ej. CUZ-742).');
      return;
    }
    const numPrecio = parseFloat(precio);
    if (isNaN(numPrecio) || numPrecio <= 0) {
      setFormError('Ingrese un precio numérico de venta válido.');
      return;
    }

    try {
      await onAddBoleto({
        codigo_boleto: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
        pasajero_id: `PAS-${Math.floor(100 + Math.random() * 900)}`,
        pasajero_nombre: pasajeroNombre.trim(),
        vuelo_codigo: vueloCodigo.trim().toUpperCase(),
        asiento: asiento.trim().toUpperCase() || '--',
        precio: numPrecio,
        estado,
      });
      setIsModalOpen(false);
    } catch {
      setFormError('Ocurrió un error al emitir el boleto. Compruebe los datos.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>ACCESO SEGURO AUTORIZADO</span>
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Gestión de Boletos</h2>
          <p className="text-sm text-gray-500 mt-1">Administre, emita y supervise las transacciones de boletos aéreos.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-[#000511] text-white hover:bg-slate-900 px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:shadow-lg transition-all self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Nuevo Boleto</span>
        </button>
      </div>

      {/* Grid de Filtros */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/50 p-3 rounded-xl border border-gray-100">
        <div className="flex flex-wrap gap-2">
          {(['Todos', 'Confirmado', 'Pendiente', 'Cancelado'] as const).map((filter) => {
            const isActive = activeStatusFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveStatusFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold font-mono transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
        <button 
          onClick={() => alert('Parámetros de Auditoría Cusco: Boletos seguros emitidos en formato estándar SHA-256.')}
          className="text-xs text-gray-400 font-mono hover:text-blue-600 transition-colors cursor-pointer"
        >
          Auditoría Cusco &Delta;
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-[#e2e8f0] shadow-md rounded-2xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#001c4a] text-xs font-mono text-slate-200 uppercase tracking-wider font-semibold">
                <th className="py-4 px-6">Código Boleto</th>
                <th className="py-4 px-6">Pasajero</th>
                <th className="py-4 px-6">Vuelo</th>
                <th className="py-4 px-6">Asiento</th>
                <th className="py-4 px-6">Precio de Venta</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6 text-right">Ficha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-sm text-slate-700 bg-white">
              {filteredBoletos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-mono text-xs">
                    Ningún pasaje registrado concuerda con las variables indicadas.
                  </td>
                </tr>
              ) : (
                filteredBoletos.map((b, idx) => {
                  const isCancelled = b.estado === 'Cancelado';

                  return (
                    <tr 
                      key={`${b.id}-${idx}`} 
                      className={`hover:bg-slate-50/70 transition-all group even:bg-slate-50/30 ${
                        isCancelled ? 'opacity-65' : ''
                      }`}
                    >
                      {/* Código de Boleto */}
                      <td className={`py-4 px-6 font-mono font-bold ${
                        isCancelled ? 'text-slate-400 line-through decoration-red-400' : 'text-slate-950'
                      }`}>
                        {b.codigo_boleto}
                      </td>

                      {/* Pasajero */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8.5 h-8.5 rounded-xl bg-sky-100/85 text-sky-850 font-mono text-xs font-bold flex items-center justify-center border border-sky-200">
                            {b.pasajero_avatar_iniciales}
                          </div>
                          <span className={`font-semibold ${isCancelled ? 'text-slate-400' : 'text-slate-900'}`}>
                            {b.pasajero_nombre}
                          </span>
                        </div>
                      </td>

                      {/* Vuelo */}
                      <td className="py-4 px-6 font-mono text-xs">
                        <div className="flex items-center gap-1.5 text-sky-700 font-bold bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-lg w-max">
                          <Plane className="w-3.5 h-3.5" />
                          <span>{b.vuelo_codigo}</span>
                        </div>
                      </td>

                      {/* Asiento */}
                      <td className="py-4 px-6 font-mono text-xs font-bold text-slate-500">{b.asiento}</td>

                      {/* Precio */}
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">
                        ${b.precio.toFixed(2)}
                      </td>

                      {/* Estado */}
                      <td className="py-4 px-6">
                        {b.estado === 'Confirmado' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase bg-[#ecf5ff] text-[#0061a5] border border-[#d2e5ff]">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-600 shrink-0"></span>
                            <span>Confirmado</span>
                          </span>
                        ) : b.estado === 'Pendiente' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase bg-[#fffbeb] text-[#b45309] border border-[#fef3c7]">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                            <span>Pendiente</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase bg-[#fef2f2] text-[#b91c1c] border border-[#fee2e2]">
                            <span>&times;</span>
                            <span>Cancelado</span>
                          </span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedBoleto(b)}
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
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
            Mostrando 1 a {filteredBoletos.length} de {boletos.length} boletos emitidos
          </span>
          <div className="flex gap-2">
            <button className="p-1 border border-gray-200 rounded hover:bg-gray-100 text-gray-400" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 border border-gray-200 rounded hover:bg-gray-100 text-gray-400" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: EMITIR BOLETO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#001e40]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-indigo-600" />
                Emitir Nuevo Boleto Cusco
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-xs font-mono">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-semibold text-gray-500 uppercase mb-1">Nombre Completo Pasajero *</label>
                <input
                  type="text"
                  value={pasajeroNombre}
                  onChange={(e) => setPasajeroNombre(e.target.value)}
                  placeholder="ej. Mateo Rojas"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-500 uppercase mb-1">Código de Vuelo *</label>
                  <input
                    type="text"
                    value={vueloCodigo}
                    onChange={(e) => setVueloCodigo(e.target.value)}
                    placeholder="ej. CUZ-742"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none font-mono uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-500 uppercase mb-1">Asiento Asignado</label>
                  <input
                    type="text"
                    value={asiento}
                    onChange={(e) => setAsiento(e.target.value)}
                    placeholder="ej. 12A"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-500 uppercase mb-1">Precio Cobrado ($) *</label>
                  <input
                    type="text"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    placeholder="ej. 145.00"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-500 uppercase mb-1">Estado de Emisión</label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value as any)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none"
                  >
                    <option value="Confirmado">Confirmado</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
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
                  Guardar Boleto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETALLES DE BOLETO */}
      {selectedBoleto && (
        <div className="fixed inset-0 bg-[#001e40]/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <button 
              onClick={() => setSelectedBoleto(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <span className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Ticket className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-bold text-gray-900 leading-tight">Boleto Electrónico</h3>
                <span className="text-xs text-gray-400 font-mono font-bold uppercase">{selectedBoleto.codigo_boleto}</span>
              </div>
            </div>

            <div className="space-y-3.5 border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-xs text-gray-500 font-mono font-semibold">PASAJERO:</span>
                <span className="text-sm font-bold text-gray-900">{selectedBoleto.pasajero_nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400 font-mono">CÓDIGO VUELO:</span>
                <span className="text-sm font-mono font-bold text-blue-600">{selectedBoleto.vuelo_codigo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400 font-mono">ASIENTO ASIGNADO:</span>
                <span className="text-sm font-mono font-bold text-gray-800">{selectedBoleto.asiento}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400 font-mono">ESTADO ACTUAL:</span>
                <span className="text-xs font-mono font-bold text-blue-700 uppercase">{selectedBoleto.estado}</span>
              </div>
              <div className="flex justify-between border-t pt-3.5">
                <span className="text-sm text-gray-900 font-semibold flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-gray-400" />
                  <span>TOTAL COBRADO</span>
                </span>
                <span className="text-lg font-bold text-gray-950 font-mono">${selectedBoleto.precio.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedBoleto(null)}
              className="mt-6 w-full py-2.5 bg-[#000511] hover:bg-slate-900 text-white text-xs font-bold font-mono rounded-lg transition-colors cursor-pointer"
            >
              Cerrar Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
