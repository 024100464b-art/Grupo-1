import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Lock, BadgeCheck } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('A.VALDIVIA');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorErrorMsg('Ingrese un identificador de usuario válido.');
      return;
    }
    setIsLoading(true);
    setErrorErrorMsg('');

    // Simulate authenticating regional director
    setTimeout(() => {
      setIsLoading(false);
      onLogin(username);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden bg-[#08080a]">
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/95 to-[#08080a]/50 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 grayscale-[0.2] scale-105 transition-transform duration-10000"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2070&auto=format&fit=crop')" 
          }}
        />
      </div>

      {/* Main Login Card */}
      <main className="relative z-20 w-full max-w-[480px]">
        <div className="glass-card p-10 md:p-12 rounded-xl flex flex-col items-center border border-white/5 bg-[#121214]/90 shadow-2xl">
          {/* Brand Header */}
          <header className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-amber-500/10 rounded-full border border-amber-500/20 active-glow-bar">
                <span className="material-symbols-outlined text-amber-500 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  flight_takeoff
                </span>
              </div>
            </div>
            <h1 className="font-sans text-3xl font-light text-white tracking-wide mb-1">
              AeroGest Cusco
            </h1>
            <p className="text-[10px] text-amber-500 font-mono uppercase tracking-[0.15em]">
              Centro Ejecutivo de Gestión Aeroportuaria
            </p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 block ml-1 uppercase font-mono" htmlFor="username">
                Identificador de Usuario
              </label>
              <div className="relative flex items-center transition-all bg-[#161618] rounded-lg border border-white/10 focus-within:border-amber-500/50">
                <span className="material-symbols-outlined absolute left-4 text-gray-600 text-[20px]">badge</span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toUpperCase())}
                  className="w-full bg-transparent py-3.5 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none font-mono text-sm uppercase tracking-wider"
                  placeholder="ej. A.VALDIVIA"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] text-gray-500 uppercase font-mono" htmlFor="password">
                  Clave de Acceso
                </label>
                <a href="#forgot" className="text-[10px] font-bold text-amber-500 hover:text-amber-400 transition-colors tracking-wide uppercase font-mono">
                  Recuperar Acceso
                </a>
              </div>
              <div className="relative flex items-center transition-all bg-[#161618] rounded-lg border border-white/10 focus-within:border-amber-500/50">
                <span className="material-symbols-outlined absolute left-4 text-gray-600 text-[20px]">lock</span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent py-3.5 pl-12 pr-12 text-white placeholder:text-gray-600 focus:outline-none text-sm font-mono"
                  placeholder="••••••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember checkbox */}
            <div className="flex items-center px-1 py-1">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded bg-black border-white/10 text-amber-500 focus:ring-offset-[#121214] focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="remember" className="ml-3 text-xs text-gray-400 cursor-pointer select-none font-sans">
                Recordar sesión en esta terminal ejecutiva
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-600 hover:bg-amber-500 active:scale-[0.99] text-white py-3.5 px-6 rounded-lg font-bold flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer uppercase tracking-wider text-xs"
              >
                <span>
                  {isLoading ? 'Verificando Protocolos...' : 'Ingresar al Panel Ejecutivo'}
                </span>
                {!isLoading && (
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 600" }}>
                    arrow_forward
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Footer Metadata */}
          <footer className="mt-8 w-full pt-6 border-t border-white/5 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest font-bold">
                SISTEMA AOCC OPERATIVO : 100% DISPONIBLE
              </span>
            </div>
            <p className="text-[10px] text-gray-600 leading-relaxed uppercase tracking-normal font-mono">
              Acceso Restringido. El monitoreo de esta sesión es obligatorio bajo normativas DGAC y protocolos de seguridad aeroportuaria Cusco.
            </p>
          </footer>
        </div>

        {/* Shadow Text ornaments */}
        <div className="absolute -bottom-16 left-0 right-0 text-center opacity-30 pointer-events-none uppercase">
          <span className="font-mono text-[9px] tracking-[0.4em] text-gray-700">
            AEROGEST-SYS V4.2.1 // TERMINAL-CUS
          </span>
        </div>
      </main>
    </div>
  );
}
