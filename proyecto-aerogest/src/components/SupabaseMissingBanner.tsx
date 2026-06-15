import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function SupabaseMissingBanner() {
  return (
    <div className="glass-card bg-[#121214]/60 border border-white/5 rounded-xl p-8 max-w-lg mx-auto my-12 text-center animate-fade-in">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mx-auto mb-5">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="font-semibold text-lg text-white mb-2">Conexión Incompleta</h3>
      <p className="text-sm text-gray-400 leading-relaxed mb-6">
        Se requiere acceso en tiempo real a Supabase para cargar el panel operativo de AeroGest Cusco.
      </p>
      <div className="py-3 px-4 bg-red-500/10 text-xs font-mono font-bold border border-red-500/20 rounded-xl mb-4 text-center text-red-400">
        Falta configurar la conexión con Supabase
      </div>
      <p className="text-xs text-gray-500 font-mono">
        Configure <span className="font-bold">VITE_SUPABASE_URL</span> y <span className="font-bold">VITE_SUPABASE_ANON_KEY</span>.
      </p>
    </div>
  );
}
