import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

const SYSTEM_PROMPT = `Eres el Coordinador del Centro de Control de Operaciones (AOCC) del Aeropuerto Internacional Alejandro Velasco Astete en Cusco.

El usuario describirá un evento o crisis operativa. Debes procesarla y devolver ÚNICAMENTE una respuesta estructurada con este formato exacto, sin markdown adicional ni explicaciones:

📊 IMPACTO EN PUERTAS Y FAJAS
• [punto técnico 1]
• [punto técnico 2]
• [punto técnico 3]

👥 RECOMENDACIÓN DE PERSONAL
• [reasignación de staff sugerida para mitigar el caos]

Usa un tono muy conciso, directo y técnico. Sin introducciones ni despedidas.`;

export default function SimuladorGemini() {
  const [evento, setEvento] = useState('');
  const [resultado, setResultado] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY as string | undefined;
  const hasApiKey = Boolean(apiKey && !apiKey.includes('MY_GEMINI_API_KEY'));

  const handleSimular = async () => {
    if (!evento.trim()) {
      setError('Describa un evento operativo para simular.');
      return;
    }
    if (!hasApiKey) {
      setError('Variable VITE_GEMINI_API_KEY no configurada en .env.local');
      return;
    }

    setLoading(true);
    setError('');
    setResultado('');

    const generarFallback = (alerta: string): string => {
      const climaKeywords = ['lluvia', 'clima', 'tormenta', 'niebla', 'viento', 'desvío', 'desvio', 'nubes', 'temporal', 'lluvioso'];
      const personalKeywords = ['personal', 'staff', 'huelga', 'paro', 'protesta', 'tripulación', 'tripulacion'];
      const tecnicoKeywords = ['falla', 'técnico', 'tecnico', 'mantenimiento', 'avería', 'averia', 'sistema', 'radar', 'combustible'];
      const bajaDemanda = ['poca', 'bajo', 'vacío', 'vacio', 'sin pasajeros', 'cancelaciones masivas'];

      const txt = alerta.toLowerCase();

      if (tecnicoKeywords.some(k => txt.includes(k))) {
        return '[FALLBACK OPERATIVO LOCAL]\n📊 IMPACTO EN PUERTAS Y FAJAS\n• Falla técnica detectada: mantenimiento no programado en hangar principal.\n• Puerta G2 fuera de servicio por reparación de sistema de combustible.\n• Faja 3 detenida — redirigir equipaje a fajas 1 y 2.\n\n👥 RECOMENDACIÓN DE PERSONAL\n• Activar equipo de mantenimiento nocturno y desviar 3 operadores de rampa a soporte en fajas.';
      }
      if (personalKeywords.some(k => txt.includes(k))) {
        return '[FALLBACK OPERATIVO LOCAL]\n📊 IMPACTO EN PUERTAS Y FAJAS\n• Déficit de personal en turno tarde: 40% de ausentismo reportado.\n• Puertas G1–G3 operativas con personal mínimo.\n• Fajas 4 y 5 sin operador asignado.\n\n👥 RECOMENDACIÓN DE PERSONAL\n• Reasignar 5 agentes de seguridad a operaciones de rampa.\n• Convocar personal de turno nocturno 2 horas antes.';
      }
      if (bajaDemanda.some(k => txt.includes(k))) {
        return '[FALLBACK OPERATIVO LOCAL]\n📊 IMPACTO EN PUERTAS Y FAJAS\n• Baja ocupación detectada: consolidar vuelos con menos del 40% de capacidad.\n• Puertas G5 y G6 pueden cerrarse temporalmente.\n• Fajas 1–3 con capacidad ociosa del 60%.\n\n👥 RECOMENDACIÓN DE PERSONAL\n• Reducir personal de mostrador en 30% y reasignar a tareas de mantenimiento preventivo.';
      }
      if (climaKeywords.some(k => txt.includes(k))) {
        return '[FALLBACK OPERATIVO LOCAL]\n📊 IMPACTO EN PUERTAS Y FAJAS\n• Posible saturación en fajas 1 y 2 por retrasos masivos.\n• Puertas G3 y G4 asignadas a vuelos demorados de Lima.\n• Tiempo de respuesta en descarga de equipaje +15 min estimado.\n\n👥 RECOMENDACIÓN DE PERSONAL\n• Incrementar un 20% el personal de rampa para el turno nocturno.';
      }
      return '[FALLBACK OPERATIVO LOCAL]\n📊 IMPACTO EN PUERTAS Y FAJAS\n• Evento no categorizado: se requiere evaluación en terreno.\n• Puertas y fajas operando con capacidad reducida.\n• Posible efecto dominó en vuelos entrantes.\n\n👥 RECOMENDACIÓN DE PERSONAL\n• Mantener staff actual y monitorear evolución cada 30 min.\n• Tener equipo de reserva en stand-by.';
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: evento.trim(),
        config: {
          systemInstruction: SYSTEM_PROMPT,
        },
      });
      clearTimeout(timeoutId);
      setResultado(response.text || 'El modelo no generó respuesta.');
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('Gemini no respondió, usando fallback local:', err.message);
      setResultado(generarFallback(evento));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#000c24]/80 backdrop-blur-md border border-sky-500/15 rounded-2xl shadow-[0_8px_30px_rgba(0,10,30,0.3)] overflow-hidden">
      {/* Cabecera HUD */}
      <div className="px-6 py-4 flex items-center justify-between bg-gradient-to-r from-[#000c24] to-[#001c4a] border-b border-sky-500/10">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-400/30">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-display font-semibold text-sm text-white">Simulador Gerencial Predictivo</h3>
            <p className="text-[10px] text-cyan-300/60 font-mono">AOCC · Análisis What-If con IA</p>
          </div>
        </div>
        <span className="text-[9px] font-mono font-bold text-cyan-400/60 uppercase tracking-widest border border-cyan-400/20 px-2 py-1 rounded-md">
          gemini-2.5-flash
        </span>
      </div>

      <div className="p-6 space-y-4">
        {/* Banner de API Key faltante */}
        {!hasApiKey && (
          <div className="p-3 bg-amber-900/30 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-xs font-mono text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <span>Configure <strong>VITE_GEMINI_API_KEY</strong> en <strong>.env.local</strong> para habilitar el simulador.</span>
          </div>
        )}

        {/* Textarea */}
        <div>
          <label className="block text-[10px] font-mono font-semibold text-sky-300/70 uppercase tracking-wider mb-1.5">
            Describa el evento o crisis operativa
          </label>
          <textarea
            value={evento}
            onChange={(e) => setEvento(e.target.value)}
            placeholder='Ej: "Mal tiempo en Lima provocará desvíos hacia Cusco durante las próximas 4 horas"'
            rows={3}
            className="w-full bg-[#000c24]/60 border border-sky-500/20 rounded-xl px-4 py-3 text-sm text-sky-100 placeholder:text-sky-600/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/40 transition-all resize-none"
          />
        </div>

        {/* Botón */}
        <button
          onClick={handleSimular}
          disabled={loading || !hasApiKey}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Procesando con AOCC...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Simular Impacto Operativo</span>
            </>
          )}
        </button>

        {/* Error elegante */}
        {error && (
          <div className="p-3 bg-rose-900/30 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-xs font-mono text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Resultado con estilo HUD */}
        {resultado && (
          <div className="bg-gradient-to-br from-[#000c24] to-[#001c4a] border border-cyan-500/20 rounded-2xl p-5 shadow-inner relative overflow-hidden">
            {/* Grid de fondo HUD */}
            <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="hud-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#22d3ee" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hud-grid)" />
              </svg>
            </div>

            <div className="relative z-10">
              {/* Indicador AOCC vivo */}
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  Predicción AOCC en vivo
                </span>
              </div>

              <pre className="text-sm text-cyan-100 font-mono leading-relaxed whitespace-pre-wrap">
                {resultado}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
