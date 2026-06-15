/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plane, Lock, User, ShieldCheck, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('admin@aerogest.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Pequeño retardo para simular conectividad con servidor o Supabase
    setTimeout(() => {
      if (!email.trim() || !password.trim()) {
        setError('Por favor complete todos los campos de acceso.');
        setLoading(false);
        return;
      }

      // Dejar pasar libremente para facilitar pruebas, pero con sugerencia
      onLoginSuccess();
      setLoading(false);
    }, 850);
  };

  return (
    <div className="min-h-screen w-full bg-[#000c24] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Círculos de luz ambiental futuristas */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-sky-500/10 blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[140px] pointer-events-none"></div>

      {/* Tarjeta de Inicio de Sesión Rediseñada */}
      <div className="bg-[#001435]/90 backdrop-blur-xl w-full max-w-4xl rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.6)] overflow-hidden border border-[#0ea5e9]/20 grid grid-cols-1 md:grid-cols-12 min-h-[550px] animate-fade-in relative z-10">
        
        {/* Banner Izquierdo Estética HUD Aeronáutica / Google Stitch */}
        <div className="md:col-span-5 bg-gradient-to-b from-[#000c24] via-[#00173d] to-[#012a60] p-8 text-white flex flex-col justify-between relative overflow-hidden border-r border-[#0ea5e9]/20">
          
          {/* Fondo Técnico - Cuadrícula de coordenadas y radar */}
          <div className="absolute inset-0 opacity-15 pointer-events-none select-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#7dd3fc" strokeWidth="0.5" />
                </pattern>
                <pattern id="runway" width="120" height="120" patternUnits="userSpaceOnUse">
                  <line x1="60" y1="0" x2="60" y2="120" stroke="#7dd3fc" strokeWidth="1" strokeDasharray="6,6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <rect width="100%" height="100%" fill="url(#runway)" opacity="0.4" />
              {/* Círculos concéntricos de radar */}
              <circle cx="50%" cy="50%" r="90" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3,6" />
              <circle cx="50%" cy="50%" r="50" fill="none" stroke="#0ea5e9" strokeWidth="0.5" />
              {/* Líneas angulares */}
              <line x1="0" y1="0" x2="100%" y2="100%" stroke="#0ea5e9" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.3" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <span className="p-2 bg-sky-500/10 rounded-xl text-sky-400 border border-sky-400/30 shadow-md shadow-sky-500/5">
                <Plane className="w-5 h-5 animate-pulse" />
              </span>
              <span className="font-semibold text-xs tracking-widest uppercase font-mono text-sky-300">CUZ / PORTAL</span>
            </div>

            <h3 className="text-2xl font-bold tracking-tight leading-tight text-white font-display">
              Centro de Control Cusco
            </h3>
            <p className="text-xs text-sky-200/75 mt-3 font-mono leading-relaxed bg-[#000c24]/50 p-3 rounded-xl border border-sky-500/10 backdrop-blur-xs">
              Portal homologado para el Aeropuerto Internacional Alejandro Velasco Astete (CUZ). Monitoreo de tráfico, expedición de equipajes y control aduanero a 3,310m de altitud.
            </p>
          </div>

          <div className="relative z-10 mt-8">
            <div className="bg-[#000c24]/80 border border-sky-400/20 p-4 rounded-xl backdrop-blur-md">
              <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest block mb-1.5">
                Sistemas Integrados
              </span>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-sky-300 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 absolute"></span>
                <span>Base de Datos Sincronizada</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario Derecho en Navy Soft de Alto Contraste */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-[#00173d]/90 relative">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight font-display">Acceso de Operadores</h2>
            <p className="text-sm text-sky-200/60 mt-1.5">Ingrese sus credenciales operativas de seguridad.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 bg-rose-500/10 text-rose-300 rounded-xl text-xs font-mono font-semibold flex items-center gap-2.5 border border-rose-500/20 animate-shake">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono font-bold text-sky-300/80 uppercase tracking-wider">
                USUARIO / CORREO ELECTRÓNICO
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-300/50">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aerogest.com"
                  className="w-full bg-[#000c24]/50 border border-[#0ea5e9]/20 hover:border-[#0ea5e9]/40 focus:border-[#0ea5e9] text-sm text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/10 transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-mono font-bold text-sky-300/80 uppercase tracking-wider">
                  CLAVE DE ACCESO HOMOLOGADA
                </label>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Soporte Operativo AeroGest:\nPara reestablecer su credencial de intendencia, contacte con el departamento técnico en el hangar central o envíe un correo a admin-tech@aerogest.com.pe.');
                  }}
                  className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
                >
                  ¿La olvidó?
                </a>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-300/50">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#000c24]/50 border border-[#0ea5e9]/20 hover:border-[#0ea5e9]/40 focus:border-[#0ea5e9] text-sm text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/10 transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Indicaciones para test */}
            <div className="bg-[#000c24]/40 p-4 rounded-xl border border-sky-400/10 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div className="text-xs text-sky-200/70 leading-normal">
                <strong className="text-white font-semibold">Consola Operativa Integrada:</strong> Puede acceder de manera directa usando el correo predeterminado. Los registros se sincronizarán mediante almacenamiento híbrido.
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-400 hover:to-blue-500 py-3.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 mt-2 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Sincronizando con Servidores...</span>
                </>
              ) : (
                <span>Autenticar Operador Cusco</span>
              )}
            </button>
          </form>

          {/* Footer de Cusco */}
          <div className="mt-8 text-center border-t border-sky-500/10 pt-4">
            <p className="text-[9px] text-sky-300/40 uppercase font-mono tracking-widest">
              SISTEMA DE SEGURIDAD AEROPORTUARIA &copy; AeroGest Cusco 2026
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
