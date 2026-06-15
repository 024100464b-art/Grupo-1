/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  ShieldCheck, 
  Filter, 
  Download, 
  Search, 
  Smartphone, 
  Mail, 
  Ticket, 
  X, 
  UserPlus, 
  AlertCircle 
} from 'lucide-react';
import { Pasajero } from '../types';
import { hasSupabaseConfig } from '../supabase';
import SupabaseMissingBanner from './SupabaseMissingBanner';

interface PasajerosViewProps {
  pasajeros: Pasajero[];
  onAddPasajero: (pasajero: Omit<Pasajero, 'id'>) => Promise<Pasajero>;
  searchTerm: string;
  onNavigateToBoletosWithPasajeroId: (nombre: string) => void;
}

export default function PasajerosView({ 
  pasajeros, 
  onAddPasajero, 
  searchTerm,
  onNavigateToBoletosWithPasajeroId
}: PasajerosViewProps) {
  if (!hasSupabaseConfig) {
    return <SupabaseMissingBanner />;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados del formulario
  const [formNombres, setFormNombres] = useState('');
  const [formApellidos, setFormApellidos] = useState('');
  const [formTipoDoc, setFormTipoDoc] = useState<'DNI' | 'PASAPORTE' | 'C.E.'>('DNI');
  const [formDoc, setFormDoc] = useState('');
  const [formNacionalidad, setFormNacionalidad] = useState('');
  const [formTelefono, setFormTelefono] = useState('');
  const [formCorreo, setFormCorreo] = useState('');
  const [formError, setFormError] = useState('');

  // Filtrado de pasajeros con búsqueda global
  const filteredPasajeros = pasajeros.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.nombres.toLowerCase().includes(term) ||
      p.apellidos.toLowerCase().includes(term) ||
      p.documento.toLowerCase().includes(term) ||
      p.nacionalidad.toLowerCase().includes(term) ||
      p.correo.toLowerCase().includes(term)
    );
  });

  const handleOpenModal = () => {
    setFormNombres('');
    setFormApellidos('');
    setFormTipoDoc('DNI');
    setFormDoc('');
    setFormNacionalidad('');
    setFormTelefono('');
    setFormCorreo('');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validaciones
    if (!formNombres.trim() || !formApellidos.trim()) {
      setFormError('Por favor complete el nombre y apellido del pasajero.');
      return;
    }
    if (!formDoc.trim()) {
      setFormError('Debe ingresar un número de documento válido.');
      return;
    }
    if (!formNacionalidad.trim()) {
      setFormError('Por favor especifique la nacionalidad.');
      return;
    }

    try {
      await onAddPasajero({
        nombres: formNombres.trim(),
        apellidos: formApellidos.trim(),
        tipo_documento: formTipoDoc,
        documento: formDoc.trim(),
        nacionalidad: formNacionalidad.trim(),
        telefono: formTelefono.trim() || '--',
        correo: formCorreo.trim() || '--',
      });
      setIsModalOpen(false);
    } catch {
      setFormError('Error al guardar el pasajero. Intente nuevamente.');
    }
  };

  // Exportar reportes ficticios en consola/descarga para simular un verdadero WIS
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pasajeros, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "aerogest_pasajeros_cusco.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Cabecera del Módulo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestión de Pasajeros</h1>
          <p className="text-sm text-gray-500 mt-1">Directorio y control de identidades para vuelos en curso.</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="bg-[#000511] text-white hover:bg-slate-900 px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:shadow-lg transition-all shrink-0 cursor-pointer"
        >
          <UserPlus className="w-5 h-5" />
          <span>Nuevo Pasajero</span>
        </button>
      </div>

      {/* Panel en Estilo Glass Panel */}
      <div className="bg-white/85 backdrop-blur-md border border-gray-200/50 shadow-lg rounded-2xl overflow-hidden flex flex-col">
        {/* Barra de herramientas superior idéntica al prototipo */}
        <div className="p-5 border-b border-gray-200/50 flex flex-wrap items-center justify-between gap-4 bg-gray-50/20">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200/85 px-3.5 py-1.5 rounded-full border border-gray-200 text-xs font-mono font-bold text-gray-700 uppercase transition-all">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>SISTEMA SEGURO Cusco</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => alert('Filtros avanzados activados. Use la barra de búsqueda superior para encontrar coincidencias.')}
              className="p-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer"
              title="Filtrar"
            >
              <Filter className="w-4 h-4" />
            </button>
            <button 
              onClick={handleExportData}
              className="p-2 border border-[#0061a5]/25 hover:border-[#0061a5] rounded-lg text-[#0061a5] hover:bg-blue-50 transition-colors flex items-center justify-center cursor-pointer"
              title="Exportar Reporte"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabla Responsive de Alta Estética */}
        <div className="overflow-x-auto rounded-xl border border-slate-250 shadow-sm bg-white m-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#001c4a] text-xs font-mono text-slate-200 uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Nombres</th>
                <th className="px-6 py-4">Apellidos</th>
                <th className="px-6 py-4">Documento</th>
                <th className="px-6 py-4">Nacionalidad</th>
                <th className="px-6 py-4">Información de Contacto</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-sans text-slate-700 bg-white">
              {filteredPasajeros.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-mono text-xs">
                    No se encontraron pasajeros registrados con ese nombre o documento.
                  </td>
                </tr>
              ) : (
                filteredPasajeros.map((p, idx) => {
                  // Iniciales para el Avatar
                  const initials = `${p.nombres[0]}${p.apellidos[0]}`.toUpperCase().slice(0, 2);

                  // Color de avatar dependiente del id para variar el canvas
                  const bgColors = [
                    'bg-sky-100 text-sky-800 border-sky-200', 
                    'bg-teal-100 text-teal-850 border-teal-200', 
                    'bg-amber-100 text-amber-850 border-amber-200 border', 
                    'bg-indigo-100 text-indigo-850 border-indigo-200'
                  ];
                  const colorIndex = p.nombres.length % bgColors.length;

                  return (
                    <tr 
                      key={`${p.id}-${idx}`} 
                      className="hover:bg-slate-50/70 transition-all group even:bg-slate-50/30"
                    >
                      {/* Nombres con Iniciales */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`h-8.5 w-8.5 rounded-xl ${bgColors[colorIndex]} flex items-center justify-center font-mono text-xs font-bold leading-none shadow-sm border`}>
                            {initials}
                          </div>
                          <span className="font-semibold text-slate-900">{p.nombres}</span>
                        </div>
                      </td>

                      {/* Apellidos */}
                      <td className="px-6 py-4.5 whitespace-nowrap font-medium text-slate-800">
                        {p.apellidos}
                      </td>

                      {/* Documento */}
                      <td className="px-6 py-4.5 whitespace-nowrap font-mono text-xs">
                        <div className="flex flex-col">
                          <span className="text-slate-400 font-bold uppercase">{p.tipo_documento}</span>
                          <span className="text-slate-900 font-bold">{p.documento}</span>
                        </div>
                      </td>

                      {/* Nacionalidad */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-800 uppercase tracking-wide">
                          {p.nacionalidad}
                        </span>
                      </td>

                      {/* Contacto */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="flex flex-col text-xs space-y-0.5 text-slate-500 font-mono">
                          <span className="flex items-center gap-1.5"><Smartphone className="w-3 h-3 text-slate-400" /> {p.telefono}</span>
                          <span className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-400" /> {p.correo}</span>
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4.5 whitespace-nowrap text-right">
                        <button
                          onClick={() => onNavigateToBoletosWithPasajeroId(p.nombres + ' ' + p.apellidos)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white text-xs font-bold font-mono rounded-xl transition-all duration-200 cursor-pointer border border-[#0ea5e9]/10 shadow-sm"
                        >
                          <Ticket className="w-4 h-4" />
                          <span>Boletos</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <span className="text-xs text-gray-500 font-mono">
            Mostrando 1 a {filteredPasajeros.length} de {pasajeros.length} pasajeros registrados
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-xs font-mono hover:bg-gray-50 text-gray-600 cursor-pointer disabled:opacity-40" disabled>
              Anterior
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-xs font-mono hover:bg-gray-50 text-gray-600 cursor-pointer disabled:opacity-40" disabled>
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: RESGISTRAR PASAJERO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#001e40]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                Registrar Nuevo Pasajero
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-xs font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-500 uppercase mb-1">Nombres *</label>
                  <input
                    type="text"
                    value={formNombres}
                    onChange={(e) => setFormNombres(e.target.value)}
                    placeholder="ej. Mateo"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-500 uppercase mb-1">Apellidos *</label>
                  <input
                    type="text"
                    value={formApellidos}
                    onChange={(e) => setFormApellidos(e.target.value)}
                    placeholder="ej. Rojas"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-500 uppercase mb-1">Tipo Documento</label>
                  <select
                    value={formTipoDoc}
                    onChange={(e) => setFormTipoDoc(e.target.value as any)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none"
                  >
                    <option value="DNI">DNI (Peru)</option>
                    <option value="PASAPORTE">Pasaporte Extranjero</option>
                    <option value="C.E.">C.E. (Carnet Extranjería)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-500 uppercase mb-1">Número Documento *</label>
                  <input
                    type="text"
                    value={formDoc}
                    onChange={(e) => setFormDoc(e.target.value)}
                    placeholder="ej. 45871236"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-gray-500 uppercase mb-1">Nacionalidad *</label>
                <input
                  type="text"
                  value={formNacionalidad}
                  onChange={(e) => setFormNacionalidad(e.target.value)}
                  placeholder="ej. Peru, Argentina, USA"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-500 uppercase mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={formTelefono}
                    onChange={(e) => setFormTelefono(e.target.value)}
                    placeholder="ej. +51 987 654 321"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-500 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={formCorreo}
                    onChange={(e) => setFormCorreo(e.target.value)}
                    placeholder="ej. correo@aerogest.com"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none font-mono"
                  />
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
                  Guardar Pasajero
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
