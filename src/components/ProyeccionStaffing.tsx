import React from 'react';
import { Vuelo } from '../types';
import { Users, Shield, SprayCanIcon as Broom } from 'lucide-react';

const PASAJEROS_PROMEDIO_POR_VUELO = 120;

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

function minutosDesdeMedianoche(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

interface Staffing {
  rampa: number;
  seguridad: number;
  limpieza: number;
  total_pasajeros: number;
  vuelos_considerados: number;
}

function calcularStaffing(vuelos: Vuelo[]): Staffing {
  const ahora = minutosDesdeMedianoche();
  const tresHoras = 180;

  const proximos = vuelos.filter(v => {
    if (v.estado !== 'Programado' && v.estado !== 'Retrasado' && v.estado !== 'Retrasados') return false;
    const mins = parseHora(v.salida);
    if (mins === null) return false;
    const diff = mins - ahora;
    return diff >= 0 && diff <= tresHoras;
  });

  const total_pasajeros = proximos.length * PASAJEROS_PROMEDIO_POR_VUELO;

  return {
    rampa: Math.max(1, Math.ceil(total_pasajeros / 40)),
    seguridad: Math.max(1, Math.ceil(total_pasajeros / 75)),
    limpieza: 5 + Math.ceil(total_pasajeros / 100),
    total_pasajeros,
    vuelos_considerados: proximos.length,
  };
}

interface Props {
  vuelos: Vuelo[];
}

export default function ProyeccionStaffing({ vuelos }: Props) {
  const s = calcularStaffing(vuelos);

  const filas: { label: string; icon: React.ElementType; valor: number; detalle: string }[] = [
    { label: 'Personal de Rampa', icon: Users, valor: s.rampa, detalle: '1 operario por cada 40 pasajeros' },
    { label: 'Agentes de Seguridad', icon: Shield, valor: s.seguridad, detalle: '1 agente por cada 75 pasajeros' },
    { label: 'Personal de Limpieza', icon: Broom, valor: s.limpieza, detalle: '5 base + 1 por cada 100 pasajeros' },
  ];

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-[0_8px_30px_rgb(0,10,30,0.03)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between bg-gradient-to-r from-[#000c24] to-[#001c4a]">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-sky-500/10 rounded-xl text-sky-400 border border-sky-400/30">
            <Users className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-display font-semibold text-sm text-white">Proyección de Staffing Operativo</h3>
            <p className="text-[10px] text-sky-300/70 font-mono">
              {s.vuelos_considerados} vuelos programados en las próximas 3h · ~{s.total_pasajeros} pasajeros estimados
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
              <th className="pb-3 pl-1">Rol</th>
              <th className="pb-3 text-right">Personal Requerido</th>
              <th className="pb-3 text-right pr-1">Criterio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filas.map((f, i) => {
              const Icon = f.icon;
              return (
                <tr key={f.label} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 pl-1">
                    <div className="flex items-center gap-2.5">
                      <span className="p-1.5 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="text-sm font-semibold text-slate-800">{f.label}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-lg font-extrabold font-mono text-[#001c4a]">{f.valor}</span>
                  </td>
                  <td className="py-3 text-right pr-1">
                    <span className="text-[11px] font-mono text-slate-400">{f.detalle}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
