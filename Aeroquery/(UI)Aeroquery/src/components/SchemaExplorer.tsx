import React, { useState } from 'react';
import { tableMetadata, mockAeropuertos, mockAerolineas, mockVuelos, mockRutas, mockPasajeros, mockEquipaje, mockEmpleados, mockAviones, mockTickets } from '../mockData';
import { Database, TableProperties, HelpCircle, Columns, ShieldAlert, Plus, Layers, ArrowRightLeft, FileSpreadsheet, Trash, Sparkles } from 'lucide-react';
import { TableMeta } from '../types';

export default function SchemaExplorer() {
  const [selectedTableName, setSelectedTableName] = useState<string>('Aeropuerto');
  
  // Interactive mock databases in state to allow CRUD simulation!
  const [aeropuertos, setAeropuertos] = useState(mockAeropuertos);
  const [aerolineas, setAerolineas] = useState(mockAerolineas);
  const [vuelos, setVuelos] = useState(mockVuelos);
  const [pasajeros, setPasajeros] = useState(mockPasajeros);
  const [equipajes, setEquipajes] = useState(mockEquipaje);

  // Get current metadata
  const currentMeta = tableMetadata.find(m => m.name === selectedTableName) || tableMetadata[0];

  // Helper to fetch data array based on table name
  const getTableRows = (name: string) => {
    switch (name) {
      case 'Aeropuerto': return aeropuertos;
      case 'Aerolinea': return aerolineas;
      case 'Vuelo': return vuelos;
      case 'Pasajero': return pasajeros;
      case 'Equipaje': return equipajes;
      case 'Ruta': return mockRutas;
      case 'Empleado': return mockEmpleados;
      case 'Avion': return mockAviones;
      case 'Ticket': return mockTickets;
      default: return [];
    }
  };

  // State for simple form input
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAeropuertoName, setNewAeropuertoName] = useState('');
  const [newAeropuertoIata, setNewAeropuertoIata] = useState('');
  const [newAeropuertoCity, setNewAeropuertoCity] = useState('');

  const [newAerolineaName, setNewAerolineaName] = useState('');
  const [newAerolineaPais, setNewAerolineaPais] = useState('');
  const [newAerolineaIata, setNewAerolineaIata] = useState('');

  const handleAddRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTableName === 'Aeropuerto') {
      if (!newAeropuertoName || !newAeropuertoIata) return;
      const newRow = {
        ID_Aeropuerto: aeropuertos.length + 1,
        Nombre_Aero: newAeropuertoName,
        Ciudad: newAeropuertoCity || 'Desconocido',
        Codigo_IATA: newAeropuertoIata.toUpperCase().slice(0, 3)
      };
      setAeropuertos([...aeropuertos, newRow]);
      setNewAeropuertoName('');
      setNewAeropuertoIata('');
      setNewAeropuertoCity('');
      setShowAddForm(false);
    } else if (selectedTableName === 'Aerolinea') {
      if (!newAerolineaName || !newAerolineaIata) return;
      const newRow = {
        ID_Aerolinea: aerolineas.length + 1,
        Nombre_AeroLineae: newAerolineaName,
        Pais: newAerolineaPais || 'Desconocido',
        Codigo_IATA: newAerolineaIata.toUpperCase().slice(0, 2)
      };
      setAerolineas([...aerolineas, newRow]);
      setNewAerolineaName('');
      setNewAerolineaPais('');
      setNewAerolineaIata('');
      setShowAddForm(false);
    }
  };

  const handleDeleteRow = (indexField: string, idVal: number) => {
    if (selectedTableName === 'Aeropuerto') {
      setAeropuertos(aeropuertos.filter(a => a.ID_Aeropuerto !== idVal));
    } else if (selectedTableName === 'Aerolinea') {
      setAerolineas(aerolineas.filter(a => a.ID_Aerolinea !== idVal));
    }
  };

  return (
    <section className="py-20 px-6 md:px-12 bg-[#F4F1EE] text-[#121212]" id="database">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Title */}
        <div className="text-center mb-16 max-w-xl mx-auto space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C05D38] block">
            Esquemas Relacionales
          </span>
          <h2 className="font-serif text-3xl md:text-4xl italic font-light text-[#121212] tracking-tight">
            Explorador de Tablas del Core
          </h2>
          <p className="font-sans text-sm text-[#121212]/70 leading-relaxed pt-2 border-t border-black/5">
            Estructuras optimizadas con 9 entidades críticas para Transact-SQL en SQL Server. Analice las restricciones de clave primaria/foránea (PK/FK) y simule inserciones en caliente.
          </p>
        </div>

        {/* Grand Sheet Card Container */}
        <div className="bg-white border border-black/10 p-8 rounded-none shadow-sm relative overflow-hidden">
          
          {/* Top Info Header Stripe */}
          <div className="flex flex-col md:flex-row pb-6 mb-8 border-b border-black/10 gap-4 justify-between items-start md:items-center">
            <div className="flex items-center gap-3 text-[#121212]">
              <Database className="w-5 h-5 text-[#C05D38]" />
              <span className="font-sans text-xs font-bold tracking-[0.15em] uppercase">SYSTEM SCHEMA DICTIONARY</span>
            </div>
            <div className="flex flex-wrap gap-4 text-[11px] font-sans font-bold uppercase tracking-wider text-[#121212]/60">
              <span className="flex items-center gap-1.5">
                TABLAS: 9
              </span>
              <span className="text-black/25">|</span>
              <span className="flex items-center gap-1.5">
                RELACIONES: 24
              </span>
              <span className="text-black/25">|</span>
              <span className="bg-[#E5E2DE] px-3 py-1 font-bold text-black border border-black/5 text-[9px] tracking-wider">
                Motor: SQL Server 2022
              </span>
            </div>
          </div>

          {/* Grid Split Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: List of Tables */}
            <div className="lg:col-span-3 space-y-3">
              <p className="font-sans text-[10px] tracking-widest text-[#121212]/50 font-bold uppercase mb-4">Entidades del Esquema</p>
              <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0 scrollbar-none">
                {tableMetadata.map((t) => {
                  const isActive = t.name === selectedTableName;
                  return (
                    <button
                      key={t.name}
                      onClick={() => {
                        setSelectedTableName(t.name);
                        setShowAddForm(false);
                      }}
                      className={`text-left p-4.5 rounded-none border text-xs font-sans tracking-wider uppercase transition-all duration-300 whitespace-nowrap lg:whitespace-normal flex-shrink-0 lg:flex-shrink ${
                        isActive 
                          ? 'border-[#C05D38] bg-[#F4F1EE] text-[#C05D38] font-bold border-l-4' 
                          : 'border-black/5 hover:border-black/20 hover:bg-[#F4F1EE]/40 text-[#121212]/80'
                      }`}
                      id={`schema_tab_${t.name}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <TableProperties className={`w-3.5 h-3.5 ${isActive ? 'text-[#C05D38]' : 'text-[#121212]/45'}`} />
                        <span>{t.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Schema Information & Data Row Operations */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* Entity Title & Header */}
              <div className="p-6 bg-[#F4F1EE] border border-black/10 rounded-none flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h4 className="font-serif font-bold text-xl text-[#121212]">dbo.{currentMeta.name}</h4>
                  <p className="font-sans text-xs text-[#121212]/70 mt-1 max-w-xl">{currentMeta.description}</p>
                </div>
                <span className="font-sans text-[9px] font-bold tracking-widest bg-white border border-black/10 text-[#C05D38] px-3.5 py-1.5 uppercase rounded-none">
                  RESTRICTOR INTEGRADO
                </span>
              </div>

              {/* Grid content inside entity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Columns & Types */}
                <div className="border border-black/10 bg-white rounded-none flex flex-col">
                  <div className="bg-[#E5E2DE] px-4 py-3 border-b border-black/10 flex items-center justify-between">
                    <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#121212] flex items-center gap-2">
                      <Columns className="w-3.5 h-3.5 text-[#C05D38]" /> Campos y Atributos
                    </span>
                    <span className="font-sans text-[9px] font-bold text-[#121212]/50 uppercase">{currentMeta.columns.length} atributos</span>
                  </div>

                  <div className="p-4 space-y-3.5 max-h-80 overflow-y-auto flex-1 custom-scrollbar">
                    {currentMeta.columns.map((col, idx) => col && (
                      <div key={idx} className="flex justify-between items-start border-b border-black/5 pb-3 last:border-0 last:pb-0">
                        <div>
                          <span className={`font-mono text-xs font-bold ${
                            col.constraint.includes('PRIMARY') ? 'text-[#C05D38]' : col.constraint.includes('FOREIGN') ? 'text-[#121212]' : 'text-black/80'
                          }`}>
                            {col.name}
                          </span>
                          <p className="font-sans text-[10px] text-black/50 mt-1 leading-snug">{col.description}</p>
                        </div>
                        <div className="text-right space-y-1.5 flex-shrink-0 ml-4">
                          <span className="font-mono text-[10px] bg-[#F4F1EE] px-2 py-0.5 border border-black/5 text-black">
                            {col.type}
                          </span>
                          {col.constraint && (
                            <span className={`font-sans text-[8px] block tracking-widest uppercase font-bold text-center border px-2 py-0.5 mt-0.5 ${
                              col.constraint.includes('PRIMARY') 
                                ? 'border-[#C05D38]/30 bg-[#C05D38]/5 text-[#C05D38]' 
                                : col.constraint.includes('FOREIGN') 
                                ? 'border-black/10 bg-[#E5E2DE] text-[#121212]' 
                                : 'border-black/5 bg-transparent text-black/40'
                            }`}>
                              {col.constraint}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simulated sample rows */}
                <div className="border border-black/10 bg-white rounded-none flex flex-col min-h-[350px]">
                  <div className="bg-[#E5E2DE] px-4 py-3 border-b border-black/10 flex items-center justify-between">
                    <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#121212] flex items-center gap-2">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-[#C05D38]" /> Datos Corrientes
                    </span>
                    
                    {/* Add row interactive action */}
                    {(selectedTableName === 'Aeropuerto' || selectedTableName === 'Aerolinea') && (
                      <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="px-2 py-1 bg-[#121212] hover:bg-[#C05D38] text-white rounded-none font-sans text-[9px] font-bold tracking-widest uppercase flex items-center gap-1 transition-colors duration-200"
                        id="schema_btn_add_form"
                      >
                        <Plus className="w-2.5 h-2.5" /> AGREGAR
                      </button>
                    )}
                  </div>

                  {/* Body contents */}
                  {showAddForm ? (
                    <form onSubmit={handleAddRow} className="p-6 space-y-4 text-xs flex flex-col justify-between h-full flex-1">
                      <div className="space-y-3">
                        <h5 className="font-serif italic text-base font-bold text-[#C05D38]">
                          Insertar Registro en dbo.{selectedTableName}
                        </h5>
                        
                        {selectedTableName === 'Aeropuerto' && (
                          <div className="space-y-2">
                            <div>
                              <label className="block text-black/50 font-sans text-[9px] font-bold uppercase tracking-wider mb-1">Nombre Aeropuerto</label>
                              <input 
                                type="text" 
                                value={newAeropuertoName} 
                                onChange={(e) => setNewAeropuertoName(e.target.value)}
                                placeholder="Ej: Cusco Astete" 
                                className="w-full bg-white border border-black/20 rounded-none px-3 py-2 text-[#121212] focus:border-[#C05D38] outline-none"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-black/50 font-sans text-[9px] font-bold uppercase tracking-wider mb-1">Ciudad</label>
                                <input 
                                  type="text" 
                                  value={newAeropuertoCity} 
                                  onChange={(e) => setNewAeropuertoCity(e.target.value)}
                                  placeholder="Cusco" 
                                  className="w-full bg-white border border-black/20 rounded-none px-3 py-2 text-[#121212] focus:border-[#C05D38] outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-black/50 font-sans text-[9px] font-bold uppercase tracking-wider mb-1">Código IATA</label>
                                <input 
                                  type="text" 
                                  value={newAeropuertoIata} 
                                  onChange={(e) => setNewAeropuertoIata(e.target.value)}
                                  placeholder="CUZ" 
                                  maxLength={3}
                                  className="w-full bg-white border border-black/20 rounded-none px-3 py-2 text-[#121212] focus:border-[#C05D38] outline-none uppercase"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedTableName === 'Aerolinea' && (
                          <div className="space-y-2">
                            <div>
                              <label className="block text-black/50 font-sans text-[9px] font-bold uppercase tracking-wider mb-1">Nombre Aerolínea</label>
                              <input 
                                type="text" 
                                value={newAerolineaName} 
                                onChange={(e) => setNewAerolineaName(e.target.value)}
                                placeholder="Ej: JetSMART Perú" 
                                className="w-full bg-white border border-black/20 rounded-none px-3 py-2 text-[#121212] focus:border-[#C05D38] outline-none"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-black/50 font-sans text-[9px] font-bold uppercase tracking-wider mb-1">País</label>
                                <input 
                                  type="text" 
                                  value={newAerolineaPais} 
                                  onChange={(e) => setNewAerolineaPais(e.target.value)}
                                  placeholder="Perú" 
                                  className="w-full bg-white border border-black/20 rounded-none px-3 py-2 text-[#121212] focus:border-[#C05D38] outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-black/50 font-sans text-[9px] font-bold uppercase tracking-wider mb-1">Código IATA (2)</label>
                                <input 
                                  type="text" 
                                  value={newAerolineaIata} 
                                  onChange={(e) => setNewAerolineaIata(e.target.value)}
                                  placeholder="JA" 
                                  maxLength={2}
                                  className="w-full bg-white border border-black/20 rounded-none px-3 py-2 text-[#121212] focus:border-[#C05D38] outline-none uppercase"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 justify-end pt-4 border-t border-black/10">
                        <button 
                          type="button" 
                          onClick={() => setShowAddForm(false)} 
                          className="px-4 py-2 border border-black/10 text-black hover:bg-[#F4F1EE] rounded-none font-sans font-bold uppercase tracking-widest text-[9px]"
                          id="schema_btn_cancel"
                        >
                          Cancelar
                        </button>
                        <button 
                          type="submit" 
                          className="px-5 py-2 bg-[#121212] text-white font-bold uppercase tracking-widest text-[9px] hover:bg-[#C05D38]"
                          id="schema_btn_save"
                        >
                          INSERT SQL
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="p-4 space-y-2 max-h-80 overflow-y-auto flex-1 custom-scrollbar">
                      {getTableRows(currentMeta.name).length === 0 ? (
                        <p className="font-sans text-xs text-black/40 italic py-6 text-center">Sin filas en la simulación temporal.</p>
                      ) : (
                        getTableRows(currentMeta.name).map((row: any, idxVal: number) => {
                          return (
                            <div key={idxVal} className="p-3 bg-[#F4F1EE]/60 border border-black/5 rounded-none flex justify-between items-center text-xs">
                              <div className="space-y-1">
                                <div className="flex flex-wrap gap-2 items-center">
                                  <span className="font-mono text-[#C05D38] font-bold text-[10px]">
                                    ID: {row.ID_Aeropuerto || row.ID_Aerolinea || row.ID_Vuelo || row.ID_Pasajero || row.ID_Equipaje || idxVal + 1}
                                  </span>
                                  <span className="font-sans font-bold text-[#121212] tracking-normal">
                                    {row.Nombre_Aero || row.Nombre_AeroLineae || row.Numero_Vuelo || `${row.Nombre || ''} ${row.Apellido || ''}` || `Equipaje #${row.ID_Equipaje}`}
                                  </span>
                                </div>
                                <p className="font-sans text-[10px] text-black/50 font-medium">
                                  {row.Ciudad || row.Pais || row.Estado || (row.Nro_Pasaporte && `Pasaporte: ${row.Nro_Pasaporte}`) || (row.Peso_KG && `Peso: ${row.Peso_KG} Kg`)}
                                </p>
                              </div>

                              {/* Option to delete */}
                              {(selectedTableName === 'Aeropuerto' || selectedTableName === 'Aerolinea') ? (
                                <button
                                  onClick={() => handleDeleteRow(selectedTableName === 'Aeropuerto' ? 'ID_Aeropuerto' : 'ID_Aerolinea', row.ID_Aeropuerto || row.ID_Aerolinea)}
                                  className="text-black/30 hover:text-[#C05D38] p-1.5 transition-colors"
                                  title="Eliminar fila"
                                  id={`schema_btn_del_${idxVal}`}
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <span className="font-mono text-[9px] text-[#121212] font-semibold bg-white border border-black/10 px-2 py-0.5 uppercase">
                                  {row.Codigo_IATA || row.Puerta_Embarque || row.Estado_Mantenimiento || 'Fijo'}
                                </span>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
