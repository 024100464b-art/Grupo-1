import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, PlaneTakeoff, Luggage, Wallet, ShieldAlert,
  Info, Scale
} from 'lucide-react';
import { 
  mockPasajeros, mockVuelos, mockEquipaje, 
  mockTickets, mockEmpleados, mockAviones 
} from '../mockData';

export default function BentoGrid() {
  const [activeTab, setActiveTab] = useState<'pasajeros' | 'vuelos' | 'equipaje' | 'tickets' | 'empleados' | 'aeronaves' | null>(null);

  const modules = [
    {
      id: 'pasajeros',
      title: 'Pasajeros',
      subtitle: 'Control biométrico y flujos migratorios',
      summary: 'Monitoreo de pasaportes y flujos de tránsito en control de Cusco.',
      icon: Users,
      color: 'text-[#121212]',
      bgColor: 'group-hover:bg-[#C05D38] group-hover:text-white',
      badgeColor: 'bg-[#E5E2DE] text-[#121212] border border-black/5',
      data: mockPasajeros,
      renderDetail: () => (
        <div className="space-y-3">
          <p className="font-sans text-xs text-[#121212]/70 font-semibold uppercase tracking-wider">Flujo migratorio internacional:</p>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {mockPasajeros.map(p => (
              <div key={p.ID_Pasajero} className="p-3 bg-[#F4F1EE] border border-black/5 rounded-none flex justify-between items-center text-xs">
                <div>
                  <span className="font-sans font-bold text-[#121212]">{p.Nombre} {p.Apellido}</span>
                  <p className="font-mono text-[10px] text-[#121212]/50">{p.Nacionalidad} • Nac: {p.Fecha_Nacimiento}</p>
                </div>
                <span className="font-mono text-[10px] bg-white border border-black/10 text-[#121212] px-2 py-1 font-bold">
                  {p.Nro_Pasaporte}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'vuelos',
      title: 'Vuelos',
      subtitle: 'Sincronización horaria de itinerarios',
      summary: 'Planillas de partidas y arribos nacionales en terminal.',
      icon: PlaneTakeoff,
      color: 'text-[#121212]',
      bgColor: 'group-hover:bg-[#C05D38] group-hover:text-white',
      badgeColor: 'bg-[#E5E2DE] text-[#121212] border border-black/5',
      data: mockVuelos,
      renderDetail: () => (
        <div className="space-y-3">
          <p className="font-sans text-xs text-[#121212]/70 font-semibold uppercase tracking-wider">Arribos y partidas de hoy:</p>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {mockVuelos.slice(0, 5).map(v => (
              <div key={v.ID_Vuelo} className="p-3 bg-[#F4F1EE] border border-black/5 rounded-none flex justify-between items-center text-xs">
                <div>
                  <span className="font-serif font-black tracking-wider text-[#121212]">{v.Numero_Vuelo}</span>
                  <p className="font-sans text-[10px] text-[#121212]/50 mt-0.5">Puerta {v.Puerta_Embarque} • Salida: {v.Hora_Salida}</p>
                </div>
                <span className={`font-sans text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 ${
                  v.Estado === 'A tiempo' || v.Estado === 'Aterrizado'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : v.Estado === 'Retrasado' 
                    ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                    : 'bg-[#C05D38]/10 text-[#C05D38] border border-[#C05D38]/25'
                }`}>
                  {v.Estado}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'equipaje',
      title: 'Equipaje',
      subtitle: 'Trazabilidad y control de báscula',
      summary: 'Detección automática de sobrecarga con pesos reales.',
      icon: Luggage,
      color: 'text-[#121212]',
      bgColor: 'group-hover:bg-[#C05D38] group-hover:text-white',
      badgeColor: 'bg-[#E5E2DE] text-[#121212] border border-black/5',
      data: mockEquipaje,
      renderDetail: () => (
        <div className="space-y-3">
          <p className="font-sans text-xs text-[#121212]/70 font-semibold uppercase tracking-wider">Báscula y pesaje (Límite 23Kg):</p>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {mockEquipaje.map(e => {
              const isOverweight = e.Peso_KG > 23;
              return (
                <div key={e.ID_Equipaje} className="p-3 bg-[#F4F1EE] border border-black/5 rounded-none flex justify-between items-center text-xs">
                  <div>
                    <span className="font-sans font-bold text-[#121212]">Código #{e.ID_Equipaje}</span>
                    <p className="font-sans text-[10px] text-[#121212]/50">Color: {e.Color} • Estatus: {e.Estado}</p>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono text-xs font-bold px-2 py-0.5 block ${
                      isOverweight ? 'bg-[#C05D38] text-white' : 'bg-white text-black border border-black/10'
                    }`}>
                      {e.Peso_KG} Kg
                    </span>
                    {isOverweight && (
                      <span className="font-sans text-[9px] text-[#C05D38] font-bold block mt-1 uppercase tracking-tight">
                        Exceso Tarifa
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )
    },
    {
      id: 'tickets',
      title: 'Tickets',
      subtitle: 'Gestión integrada de boletaje',
      summary: 'Reservas clasificadas por tarifas y clases prioritarias.',
      icon: Wallet,
      color: 'text-[#121212]',
      bgColor: 'group-hover:bg-[#C05D38] group-hover:text-white',
      badgeColor: 'bg-[#E5E2DE] text-[#121212] border border-black/5',
      data: mockTickets,
      renderDetail: () => (
        <div className="space-y-3">
          <p className="font-sans text-xs text-[#121212]/70 font-semibold uppercase tracking-wider">Reservas del sistema:</p>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {mockTickets.map(t => (
              <div key={t.ID_Ticket} className="p-3 bg-[#F4F1EE] border border-black/5 rounded-none flex justify-between items-center text-xs">
                <div>
                  <span className="font-sans font-bold text-[#121212]">Asiento {t.Asiento}</span>
                  <p className="font-sans text-[10px] text-[#121212]/50">Ticket #{t.ID_Ticket} • Clase: {t.Clase}</p>
                </div>
                <span className="font-serif italic text-sm font-bold text-[#C05D38]">
                  USD {t.Precio.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'empleados',
      title: 'Empleados',
      subtitle: 'Administración de roles y turnos',
      summary: 'Distribución operativa de personal en terminal.',
      icon: Info,
      color: 'text-[#121212]',
      bgColor: 'group-hover:bg-[#C05D38] group-hover:text-white',
      badgeColor: 'bg-[#E5E2DE] text-[#121212] border border-black/5',
      data: mockEmpleados,
      renderDetail: () => (
        <div className="space-y-3">
          <p className="font-sans text-xs text-[#121212]/70 font-semibold uppercase tracking-wider">Turnos operacionales activos:</p>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {mockEmpleados.map(emp => (
              <div key={emp.ID_Empleado} className="p-3 bg-[#F4F1EE] border border-black/5 rounded-none flex justify-between items-center text-xs">
                <div>
                  <span className="font-sans font-bold text-[#121212]">{emp.Nombre} {emp.Apellido}</span>
                  <p className="font-sans text-[10px] text-[#121212]/50 mt-0.5">{emp.Puesto}</p>
                </div>
                <span className={`font-sans font-bold text-[10px] uppercase px-2 py-0.5 ${
                  emp.Turno === 'Mañana' 
                    ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                    : emp.Turno === 'Tarde' 
                    ? 'bg-purple-50 text-purple-800 border border-purple-200' 
                    : 'bg-stone-100 text-stone-800 border border-stone-200'
                }`}>
                  {emp.Turno}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'aeronaves',
      title: 'Aeronaves',
      subtitle: 'Mantenimiento preventivo de flota',
      summary: 'Inspección de fuselaje de flota operando en Cusco.',
      icon: PlaneTakeoff,
      color: 'text-[#121212]',
      bgColor: 'group-hover:bg-[#C05D38] group-hover:text-white',
      badgeColor: 'bg-[#E5E2DE] text-[#121212] border border-black/5',
      data: mockAviones,
      renderDetail: () => (
        <div className="space-y-3">
          <p className="font-sans text-xs text-[#121212]/70 font-semibold uppercase tracking-wider">Certificaciones técnicas:</p>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {mockAviones.map(a => (
              <div key={a.ID_Avion} className="p-3 bg-[#F4F1EE] border border-black/5 rounded-none flex justify-between items-center text-xs">
                <div>
                  <span className="font-sans font-bold text-[#121212]">{a.Modelo}</span>
                  <p className="font-sans text-[10px] text-[#121212]/50 mt-0.5">{a.Aerolinea_Propietaria} • Cap: {a.Capacidad_Pasajeros} pax</p>
                </div>
                <span className={`font-sans text-[10px] font-bold uppercase px-2 py-1 ${
                  a.Estado_Mantenimiento === 'Operativo'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : a.Estado_Mantenimiento === 'En Mantenimiento'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {a.Estado_Mantenimiento}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-20 px-6 md:px-12 bg-[#F4F1EE] text-[#121212]" id="modules">
      <div className="max-w-7xl mx-auto w-full">
        {/* Module Title */}
        <div className="text-center mb-16 max-w-xl mx-auto space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C05D38] block">
            Ecosistema de Datos Coherente
          </span>
          <h2 className="font-serif text-3xl md:text-4xl italic font-light text-[#121212] tracking-tight">
            Gestión Integral de Operaciones
          </h2>
          <p className="font-sans text-sm text-[#121212]/70 leading-relaxed pt-2 border-t border-black/5">
            Módulos analíticos para cada sector. Presione cada tarjeta editorial para ver transiciones y detalles en tiempo real.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((m) => {
            const IconComponent = m.icon;
            const isSelected = activeTab === m.id;

            return (
              <motion.div
                layout
                key={m.id}
                onClick={() => setActiveTab(activeTab === m.id ? null : (m.id as any))}
                className={`bg-white border transition-all duration-300 cursor-pointer group flex flex-col justify-between overflow-hidden p-8 rounded-none relative ${
                  isSelected ? 'border-[#C05D38] shadow-md scale-[1.01]' : 'border-black/10 hover:border-black/30'
                }`}
                id={`bento_card_${m.id}`}
              >
                {/* Visual left accent bar when selected */}
                {isSelected && (
                  <div className="absolute top-0 bottom-0 left-0 w-[5px] bg-[#C05D38]" />
                )}

                <div>
                  {/* Header Row */}
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 flex items-center justify-center border border-black/10 bg-[#E5E2DE] text-[#121212] ${m.bgColor} transition-colors duration-300`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className={`font-sans text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 ${
                      isSelected ? 'bg-[#C05D38] text-white' : m.badgeColor
                    }`}>
                      {isSelected ? 'Cerrar' : 'Expandir'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-2xl font-semibold text-[#121212] tracking-tight mb-2 group-hover:text-[#C05D38] transition-colors">
                    {m.title}
                  </h3>
                  <p className="font-sans text-xs text-[#121212]/50 font-bold uppercase tracking-wider mb-4">
                    {m.subtitle}
                  </p>
                  
                  {/* Details Section (Conditional Display) */}
                  <AnimatePresence mode="wait">
                    {isSelected ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-black/10 text-gray-700 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {m.renderDetail()}
                      </motion.div>
                    ) : (
                      <p className="font-sans text-xs text-[#121212]/70 leading-relaxed font-light">
                        {m.summary}
                      </p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom detail tag */}
                {!isSelected && (
                  <div className="mt-6 pt-4 border-t border-black/10 flex justify-between items-center font-mono text-[9px] font-bold text-[#121212]/40">
                    <span>REGISTROS: {m.data.length}</span>
                    <span className="flex items-center gap-1.5 font-sans tracking-widest uppercase text-[9px] font-bold hover:text-black">
                      Ver Tabla <Scale className="w-3 h-3 text-[#C05D38]" />
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
