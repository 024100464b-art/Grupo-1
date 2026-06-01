import React, { useState, useEffect } from 'react';
import { 
  Terminal, ShieldAlert, Cpu, Power, Compass, RotateCw, Wind, Scale, Plane, Activity, RefreshCw, Send, Plus
} from 'lucide-react';
import { mockVuelos, mockEquipaje, mockAeropuertos } from '../mockData';

interface OperationLog {
  time: string;
  msg: string;
  type: 'info' | 'warning' | 'success';
}

export default function ControlDeck() {
  const [flights, setFlights] = useState(mockVuelos);
  const [altStatus, setAltStatus] = useState<'Apto' | 'Condicional' | 'Cerrado'>('Condicional');
  const [windSpeed, setWindSpeed] = useState<number>(14); // knots
  const [windDirection, setWindDirection] = useState<string>('340° NW');
  const [customLog, setCustomLog] = useState<string>('');
  
  const [logs, setLogs] = useState<OperationLog[]>([
    { time: '08:30', msg: 'Vuelo LA2021 aterrizó con éxito en Pista 11.', type: 'success' },
    { time: '10:15', msg: 'Vuelo H23015 listo para decolar, calculando sustentación.', type: 'info' },
    { time: '11:00', msg: 'Exceso de peso de maleta detectado en counter #105 (24.1 Kg).', type: 'warning' },
    { time: '12:30', msg: 'Puerta 01 abierta para el vuelo LA2154.', type: 'info' }
  ]);

  // Totalized Metrics
  const totalWeight = mockEquipaje.reduce((sum, e) => sum + e.Peso_KG, 0).toFixed(1);
  const totalOverweightCount = mockEquipaje.filter(e => e.Peso_KG > 23).length;

  // Simulate updating winds periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setWindSpeed(prev => {
        const next = prev + (Math.random() > 0.5 ? 1 : -1);
        const clamped = Math.max(8, Math.min(22, next));
        if (clamped > 18) {
          setAltStatus('Cerrado');
        } else if (clamped > 13) {
          setAltStatus('Condicional');
        } else {
          setAltStatus('Apto');
        }
        return clamped;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Handler to manually trigger state change for simulated flight dispatch
  const handleToggleFlightStatus = (idVuelo: number) => {
    setFlights(prev => prev.map(f => {
      if (f.ID_Vuelo === idVuelo) {
        let nextStatus: typeof f.Estado = 'A tiempo';
        if (f.Estado === 'A tiempo') nextStatus = 'Abordando';
        else if (f.Estado === 'Abordando') nextStatus = 'Retrasado';
        else if (f.Estado === 'Retrasado') nextStatus = 'Aterrizado';
        else if (f.Estado === 'Aterrizado') nextStatus = 'Cancelado';
        else nextStatus = 'A tiempo';

        // Add to log console
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        setLogs(l => [
          { time: timeStr, msg: `Estado de vuelo ${f.Numero_Vuelo} cambiado a "${nextStatus}".`, type: 'info' },
          ...l
        ]);

        return { ...f, Estado: nextStatus };
      }
      return f;
    }));
  };

  // Submit manual log input
  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLog.trim()) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setLogs(l => [
      { time: timeStr, msg: customLog, type: 'info' },
      ...l
    ]);
    setCustomLog('');
  };

  // Reset Flights to mock initial database state
  const handleResetFlights = () => {
    setFlights(mockVuelos);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setLogs(l => [
      { time: timeStr, msg: 'Diccionario operacional de vuelos restablecido a valores SQL iniciales.', type: 'success' },
      ...l
    ]);
  };

  return (
    <section className="py-20 px-6 md:px-12 bg-[#F4F1EE] text-[#121212]" id="dashboard">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Title */}
        <div className="text-center mb-16 max-w-xl mx-auto space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C05D38] block">
            Consola en Tiempo Real (Telemetría)
          </span>
          <h2 className="font-serif text-3xl md:text-4xl italic font-light text-[#121212] tracking-tight">
            Consola Operativa Cusco
          </h2>
          <p className="font-sans text-sm text-[#121212]/70 leading-relaxed pt-2 border-t border-black/5">
            Métricas de sustentación aerodinámica y de equipaje asociadas al flujo de Cusco (SPZO). Presione sobre los estados de vuelo para modificar su estado relacional y observe el registro de firmas.
          </p>
        </div>

        {/* Dynamic Telemetry Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          {/* Card 1: Viento */}
          <div className="p-6 bg-white border border-black/10 rounded-none shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-4">
              <span className="font-sans text-[9px] font-bold uppercase text-black/50 tracking-wider">Meteorología</span>
              <Wind className="w-4.5 h-4.5 text-[#C05D38]" />
            </div>
            <div>
              <p className="font-serif italic text-3xl font-light text-black">{windSpeed} Knots</p>
              <p className="font-mono text-[9px] text-black/40 uppercase tracking-widest mt-1">Dirección: {windDirection}</p>
            </div>
          </div>

          {/* Card 2: Estatus Approximación */}
          <div className="p-6 bg-white border border-black/10 rounded-none shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-4">
              <span className="font-sans text-[9px] font-bold uppercase text-black/50 tracking-wider">Autorización Pista (VFR)</span>
              <Compass className="w-4.5 h-4.5 text-[#C05D38]" />
            </div>
            <div>
              <span className={`inline-block px-3 py-1 font-sans text-[9px] font-bold uppercase tracking-widest ${
                altStatus === 'Apto' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                altStatus === 'Condicional' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {altStatus === 'Apto' ? 'APTO (VFR DIRECTO)' : altStatus === 'Condicional' ? 'VISUAL CONDICIONAL' : 'PISTA CERRADA'}
              </span>
              <p className="font-mono text-[9px] text-black/40 uppercase tracking-widest mt-2">Visibilidad min: 5,000 mts</p>
            </div>
          </div>

          {/* Card 3: Báscula de Carga total */}
          <div className="p-6 bg-white border border-black/10 rounded-none shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-4">
              <span className="font-sans text-[9px] font-bold uppercase text-black/50 tracking-wider">Báscula Acumulada</span>
              <Scale className="w-4.5 h-4.5 text-[#C05D38]" />
            </div>
            <div>
              <p className="font-serif italic text-3xl font-light text-black">{totalWeight} Kg</p>
              <p className="font-mono text-[9px] text-black/40 uppercase tracking-widest mt-1">Con {totalOverweightCount} sobrepesos (&gt;23Kg)</p>
            </div>
          </div>

          {/* Card 4: Frecuencia de Vuelo */}
          <div className="p-6 bg-white border border-black/10 rounded-none shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-4">
              <span className="font-sans text-[9px] font-bold uppercase text-black/50 tracking-wider">Vuelos Monitoreados</span>
              <Plane className="w-4.5 h-4.5 text-[#C05D38]" />
            </div>
            <div>
              <p className="font-serif italic text-3xl font-light text-black">{flights.length} Activos</p>
              <div className="flex justify-between items-center mt-1">
                <p className="font-mono text-[9px] text-black/40 uppercase tracking-widest">Base: SPZO / CUZ</p>
                <button
                  onClick={handleResetFlights}
                  className="font-mono text-[9px] text-[#C05D38] hover:underline uppercase font-bold flex items-center gap-1"
                  title="Restablecer base de vuelos inicial"
                  id="controldeck_btn_reset"
                >
                  <RefreshCw className="w-2.5 h-2.5" /> Reset
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Live Grid Operations Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Block: Flight Grid list */}
          <div className="lg:col-span-7 bg-white border border-black/10 p-6 rounded-none shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-black/10">
              <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-black flex items-center gap-1.5Packed">
                <Plane className="w-4 h-4 text-[#C05D38]" /> Estado Local de Tablones de Arribo
              </span>
              <span className="font-sans text-[8px] text-black/40 font-bold uppercase">Clic para actualizar</span>
            </div>

            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1 select-none custom-scrollbar">
              {flights.map((f) => {
                return (
                  <div 
                    key={f.ID_Vuelo}
                    onClick={() => handleToggleFlightStatus(f.ID_Vuelo)}
                    className="p-4 bg-[#F4F1EE]/50 border border-black/5 hover:border-black/20 hover:bg-[#F4F1EE] rounded-none flex justify-between items-center transition-all duration-300 cursor-pointer"
                    id={`control_flight_row_${f.ID_Vuelo}`}
                    title="Haga clic para simular el siguiente estado operational"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-serif italic font-bold text-[#C05D38] text-sm">
                          {f.Numero_Vuelo}
                        </span>
                        <span className="font-mono text-[9px] bg-white border border-black/10 px-1.5 py-0.5 text-black">
                          GATE {f.Puerta_Embarque || 'N/A'}
                        </span>
                        <span className="font-mono text-[9px] text-black/50">
                          {f.Hora_Salida} &mdash; {f.Hora_Llegada}
                        </span>
                      </div>
                      <p className="font-sans text-[10px] text-black/50 font-normal">
                        Ruta: {f.ID_Aeropuerto_Origen === 1 ? 'Cusco (CUZ)' : 'Lima (LIM)'} hacia {f.ID_Aeropuerto_Destino === 1 ? 'Cusco (CUZ)' : 'Lima (LIM)'}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block font-sans text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 border ${
                        f.Estado === 'A tiempo' || f.Estado === 'Aterrizado'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : f.Estado === 'Retrasado' 
                          ? 'bg-amber-50 text-amber-800 border-amber-200' 
                          : 'bg-red-50 text-red-800 border-red-200'
                      }`}>
                        {f.Estado}
                      </span>
                      <p className="font-mono text-[7px] text-[#C05D38] font-bold uppercase tracking-wider mt-1.5">MUTAR ESTADO</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Block: Live terminal logs ticker */}
          <div className="lg:col-span-5 bg-white border border-black/10 p-6 rounded-none shadow-sm flex flex-col justify-between min-h-[400px]">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-black/10">
                <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-black flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#C05D38]" /> Ticker Operativo y Radio Control
                </span>
                <span className="font-sans text-[8px] bg-[#E5E2DE] border border-black/5 px-2 py-0.5 uppercase text-black">Live feed</span>
              </div>

              {/* Logger feed console */}
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 font-mono text-[11px] leading-relaxed custom-scrollbar">
                {logs.length === 0 ? (
                  <p className="italic text-black/35 py-12 text-center text-xs">Sin registros de eventos temporales.</p>
                ) : (
                  logs.map((log, idx) => (
                    <div key={idx} className="flex gap-2 pb-2.5 border-b border-black/5 last:border-0">
                      <span className="text-black/40 font-bold flex-shrink-0">{log.time}</span>
                      <span className="text-black/25 flex-shrink-0">//</span>
                      <span className={`break-words ${
                        log.type === 'warning' ? 'text-[#C05D38] font-semibold' :
                        log.type === 'success' ? 'text-emerald-800 font-medium' :
                        'text-[#121212]'
                      }`}>
                        {log.msg}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Input field to alert dispatch */}
            <form onSubmit={handleAddLog} className="pt-4 border-t border-black/10 mt-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={customLog}
                  onChange={(e) => setCustomLog(e.target.value)}
                  placeholder="Inyectar mensaje de radio de control (ej: Cierre de pista)..." 
                  className="flex-1 bg-[#F4F1EE] border border-black/10 text-xs font-sans rounded-none px-3.5 py-2.5 focus:border-[#C05D38] outline-none"
                  id="controldeck_manual_input"
                  maxLength={100}
                />
                <button 
                  type="submit" 
                  className="bg-[#121212] text-white px-4 hover:bg-[#C05D38] hover:text-white transition-colors rounded-none flex items-center justify-center"
                  id="controldeck_btn_submit"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="font-sans text-[9px] text-black/35 mt-1.5 uppercase font-semibold">Inyecta eventos directo a la consola del aeropuerto.</p>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
