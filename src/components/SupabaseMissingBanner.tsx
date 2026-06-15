import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function SupabaseMissingBanner() {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,10,30,0.03)] max-w-lg mx-auto my-12 text-center font-sans animate-fade-in">
      <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center border border-rose-150 mx-auto mb-5 text-rose-600">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="font-display font-semibold text-lg text-slate-900 mb-2">Conexión Incompleta</h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-6">
        Se requiere acceso en tiempo real a Supabase para cargar el panel operativo de AeroGest Cusco.
      </p>
      
      <div className="py-3 px-4 bg-rose-50 text-xs font-mono font-bold text-rose-700 border border-rose-150 rounded-xl mb-4 text-center">
        Falta configurar la conexión con Supabase
      </div>
      
      <p className="text-xs text-slate-400 font-mono">
        Configure <span className="font-bold">VITE_SUPABASE_URL</span> y <span className="font-bold">VITE_SUPABASE_ANON_KEY</span>.
      </p>
    </div>
  );
}
