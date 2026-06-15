import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Clock,
  Play,
  CheckCircle2,
  MessageSquare,
  Wrench,
  Luggage,
  Plane as PlaneIcon,
} from 'lucide-react';

type EstadoIncidencia = 'Pendiente' | 'En Progreso' | 'Resuelto';

interface IncidenciaTicket {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'equipaje' | 'vuelo' | 'infraestructura';
  estado: EstadoIncidencia;
  prioridad: 'Alta' | 'Media' | 'Baja';
  fecha_reporte: string;
  iniciado_en?: number;
}

const datosIniciales: IncidenciaTicket[] = [
  { id: 'INC-001', titulo: 'Falla en faja 3', descripcion: 'Faja transportadora de equipaje detenida por sobrecarga eléctrica.', tipo: 'infraestructura', estado: 'Pendiente', prioridad: 'Alta', fecha_reporte: '2026-06-14 08:30' },
  { id: 'INC-002', titulo: 'Retraso masivo por clima', descripcion: 'Tormenta eléctrica en Lima desvía 4 vuelos a Cusco.', tipo: 'vuelo', estado: 'Pendiente', prioridad: 'Alta', fecha_reporte: '2026-06-14 09:15' },
  { id: 'INC-003', titulo: 'Equipaje perdido LA2031', descripcion: 'Maleta no reclamada en faja 2 con código BAG-LA2031-01.', tipo: 'equipaje', estado: 'Pendiente', prioridad: 'Media', fecha_reporte: '2026-06-14 07:45' },
  { id: 'INC-004', titulo: 'Puerta G2 sin energía', descripcion: 'Sistema de embarque en G2 requiere mantenimiento eléctrico urgente.', tipo: 'infraestructura', estado: 'En Progreso', prioridad: 'Alta', fecha_reporte: '2026-06-14 06:00', iniciado_en: Date.now() - 23 * 60000 },
  { id: 'INC-005', titulo: 'Sobrevendido SK4012', descripcion: 'Vuelo SK4012 con 5 pasajeros sin asiento asignado.', tipo: 'vuelo', estado: 'En Progreso', prioridad: 'Media', fecha_reporte: '2026-06-14 10:00', iniciado_en: Date.now() - 12 * 60000 },
  { id: 'INC-006', titulo: 'Sensor de peso descalibrado', descripcion: 'Báscula en mostrador 4 reporta lecturas incorrectas.', tipo: 'equipaje', estado: 'Resuelto', prioridad: 'Baja', fecha_reporte: '2026-06-13 16:20' },
  { id: 'INC-007', titulo: 'Filtro de seguridad bloqueado', descripcion: 'Scanner de rayos X en filtro B fuera de servicio.', tipo: 'infraestructura', estado: 'Resuelto', prioridad: 'Alta', fecha_reporte: '2026-06-13 14:00' },
];

const TIPO_ICON: Record<IncidenciaTicket['tipo'], React.ElementType> = {
  equipaje: Luggage,
  vuelo: PlaneIcon,
  infraestructura: Wrench,
};

const TIPO_LABEL: Record<IncidenciaTicket['tipo'], string> = {
  equipaje: 'Equipaje',
  vuelo: 'Vuelo',
  infraestructura: 'Infra.',
};

const PRIORIDAD_BAR: Record<IncidenciaTicket['prioridad'], string> = {
  Alta: 'bg-red-500',
  Media: 'bg-amber-500',
  Baja: 'bg-slate-400',
};

const TarjetaIncidencia: React.FC<{
  ticket: IncidenciaTicket;
  onAction: (id: string, accion: 'iniciar' | 'cerrar') => void;
}> = ({ ticket, onAction }) => {
  const Icon = TIPO_ICON[ticket.tipo];
  const [mins, setMins] = useState(0);

  useEffect(() => {
    if (ticket.estado !== 'En Progreso' || !ticket.iniciado_en) return;
    const actualizar = () => setMins(Math.floor((Date.now() - ticket.iniciado_en) / 60000));
    actualizar();
    const id = setInterval(actualizar, 10000);
    return () => clearInterval(id);
  }, [ticket.estado, ticket.iniciado_en]);

  return (
    <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-sm hover:shadow-md transition-shadow space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="p-1.5 bg-slate-100 rounded-lg text-slate-600 shrink-0">
            <Icon className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-mono font-bold text-slate-400">{ticket.id}</p>
            <h4 className="text-sm font-semibold text-slate-900 leading-tight truncate">{ticket.titulo}</h4>
          </div>
        </div>
        <span className={`shrink-0 w-2 h-2 rounded-full ${PRIORIDAD_BAR[ticket.prioridad]} mt-1.5`} />
      </div>

      {/* Descripción */}
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{ticket.descripcion}</p>

      {/* Meta + Tipo */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
          {TIPO_LABEL[ticket.tipo]}
        </span>
        <span className="text-[10px] text-slate-400 font-mono">{ticket.fecha_reporte}</span>
      </div>

      {/* Timer SLA */}
      {ticket.estado === 'En Progreso' && (
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/60 rounded-lg px-3 py-2">
          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="text-[11px] font-mono font-bold text-amber-700">
            {Math.floor(mins / 60)}h {mins % 60}m en reparación
          </span>
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-2 pt-1">
        {ticket.estado === 'Pendiente' && (
          <button
            onClick={() => onAction(ticket.id, 'iniciar')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            Iniciar Reparación
          </button>
        )}
        {ticket.estado === 'En Progreso' && (
          <button
            onClick={() => onAction(ticket.id, 'cerrar')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Cerrar Ticket
          </button>
        )}
        {ticket.estado === 'Resuelto' && (
          <span className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-100 text-slate-400 text-xs font-semibold rounded-lg cursor-default">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Resuelto
          </span>
        )}
      </div>
    </div>
  );
};

export default function IncidenciasView() {
  const [tickets, setTickets] = useState<IncidenciaTicket[]>(datosIniciales);

  const handleAction = (id: string, accion: 'iniciar' | 'cerrar') => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        if (accion === 'iniciar') return { ...t, estado: 'En Progreso' as const, iniciado_en: Date.now() };
        return { ...t, estado: 'Resuelto' as const };
      })
    );
  };

  const columnas: { estado: EstadoIncidencia; label: string; icon: React.ElementType; color: string; bg: string }[] = [
    { estado: 'Pendiente', label: 'Pendiente', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50/60' },
    { estado: 'En Progreso', label: 'En Progreso', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50/60' },
    { estado: 'Resuelto', label: 'Resuelto', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50/60' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Consola de Despacho</h2>
          <p className="text-sm text-gray-400 mt-1">Gestión de incidencias operativas en tiempo real — AOCC Cusco.</p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-white border border-slate-200 px-3 py-2 rounded-lg">
          <MessageSquare className="w-4 h-4 text-sky-500" />
          <span>{tickets.filter(t => t.estado !== 'Resuelto').length} activas</span>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {columnas.map(col => {
          const items = tickets.filter(t => t.estado === col.estado);
          const Icon = col.icon;
          return (
            <div key={col.estado} className={`${col.bg} rounded-2xl border border-slate-200/60 p-4 space-y-4 min-h-[300px]`}>
              {/* Col header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${col.color}`} />
                  <h3 className="text-sm font-bold text-slate-800">{col.label}</h3>
                </div>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${col.color} border-current/20`}>
                  {items.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {items.length === 0 ? (
                  <div className="text-center py-8 text-xs font-mono text-slate-400">
                    Ninguna incidencia en esta columna.
                  </div>
                ) : (
                  items.map(t => (
                    <TarjetaIncidencia key={t.id} ticket={t} onAction={handleAction} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
