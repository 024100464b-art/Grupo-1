import React, { useState } from 'react';
import { ScenarioData } from '../types';
import { FileText, Printer, CheckCircle, Award, Landmark, TrendingUp } from 'lucide-react';

interface ExecutiveReportProps {
  data: ScenarioData;
  onExportDone: (msg: string) => void;
}

export default function ExecutiveReport({ data, onExportDone }: ExecutiveReportProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      onExportDone(`¡Informe de Gobierno Corporativo de AeroGest Cusco preparado! Código de archivo: CUZ-REP-${data.id.toUpperCase()}-2026`);
      
      // Let's call standard window.print() if possible, or trigger a clean offline formatted print flow!
      window.print();
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top action header for report controls */}
      <div className="glass-card p-6 rounded-xl border border-white/5 bg-[#121214]/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] text-amber-500 font-mono uppercase tracking-widest font-bold">GOBIERNO CORPORATIVO AEROPOSTAL</span>
          <h4 className="text-sm font-semibold text-white mt-1">Dossier del Directorio Ejecutivo del Aeropuerto de Cusco</h4>
          <p className="text-xs text-gray-400">Genere un informe limpio listo para imprimir o guardar como PDF corporativo.</p>
        </div>

        <button
          onClick={handleExport}
          disabled={exporting}
          className="bg-amber-600 hover:bg-amber-500 text-white font-sans py-2.5 px-4 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all uppercase tracking-wider"
        >
          {exporting ? (
            <>
              <span className="material-symbols-outlined text-xs animate-spin">progress_activity</span>
              Preparando Dossier...
            </>
          ) : (
            <>
              <Printer size={14} />
              Imprimir / Exportar Reporte a PDF
            </>
          )}
        </button>
      </div>

      {/* Styled Printable Report Area - Wrapped in high-contrast crisp theme style suitable for printing */}
      <div id="printable-board-report" className="glass-card p-8 sm:p-12 rounded-2xl border border-white/10 bg-[#121214]/90 space-y-8 text-gray-300">
        
        {/* Document Header - Strict clean editorial styling */}
        <div className="border-b-2 border-amber-500/20 pb-6 flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-amber-500 font-bold uppercase bg-amber-500/5 px-2.5 py-1 rounded border border-amber-500/20">
              CONFIDENCIAL // USO EXCLUSIVO DEL DIRECTORIO
            </span>
            <h2 className="text-2xl font-black text-white font-serif mt-2">
              REPORTE ESTRATÉGICO DE GESTIÓN Y DESARROLLO COMERCIAL
            </h2>
            <p className="text-xs text-gray-450 uppercase font-mono">
              Aeropuerto Internacional Alejandro Velasco Astete de Cusco (CUZ) • AeroGest Cusco S.A.
            </p>
          </div>
          
          <div className="text-left md:text-right font-mono text-[10px] text-gray-400 space-y-1">
            <div><strong>Emisión:</strong> Auditoría Q3 2026</div>
            <div><strong>Sello:</strong> AOCC-CUZ-DIR-APPROVED</div>
            <div><strong>Versión:</strong> v4.5.1-STRAT</div>
          </div>
        </div>

        {/* Executive Summary Narrative */}
        <div className="space-y-3">
          <span className="text-[10px] text-amber-500 font-mono tracking-widest uppercase font-bold">1. Resumen General del Negocio</span>
          <p className="text-sm leading-relaxed text-gray-200">
            AeroGest Cusco S.A. presenta los resultados operativos y financieros consolidados del terminal para el escenario estratégico: <strong className="text-amber-500">{data.name}</strong>. El periodo se caracteriza por una madurez sostenida del tráfico de cabotaje, con variabilidad estacional controlada mediante la optimización comercial y la regulación de la capacidad de slots coordinada con la DGAC e inspectores aeroportuarios regionales.
          </p>
          <p className="text-sm leading-relaxed text-gray-300">
            Durante este ciclo, se consolida la posición empresarial favorable bajo estricto control de CAPEX y diversificación de flujos mediante retail no aeronáutico, mitigando la concentración histórica de las líneas operando en Cusco.
          </p>
        </div>

        {/* 2. Core Strategic KPIs Indicators */}
        <div className="space-y-4">
          <span className="text-[10px] text-amber-500 font-mono tracking-widest uppercase font-bold">2. Indicadores Clave de Gestión (EBITDA, Tráficos, Rentabilidad)</span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
              <span className="text-[9px] text-gray-450 uppercase font-mono">Facturación Prevista</span>
              <p className="text-lg font-black text-white font-mono">{data.ingresosAnuales}</p>
              <span className="text-[10px] text-emerald-400 font-mono block">{data.ingresosAnualesTrend}</span>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
              <span className="text-[9px] text-gray-450 uppercase font-mono">Tránsito Pasajeros</span>
              <p className="text-lg font-black text-white font-mono">{data.pasajerosAnuales} PAX</p>
              <span className="text-[10px] text-emerald-400 font-mono block">{data.pasajerosAnualesTrend}</span>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
              <span className="text-[9px] text-gray-450 uppercase font-mono">Crecimiento Logístico</span>
              <p className="text-lg font-black text-white font-mono">{data.crecimientoAnual}</p>
              <span className="text-[10px] text-gray-450 block truncate font-mono">{data.crecimientoAnualTrend}</span>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
              <span className="text-[9px] text-gray-450 uppercase font-mono">Cartera de Alertas</span>
              <p className="text-lg font-black text-white font-mono">{data.riesgosSummary}</p>
              <span className="text-[10px] text-amber-500 font-mono block">Auditoría de Directorio</span>
            </div>
          </div>
        </div>

        {/* 3. Financial and Passenger annual evolution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          
          {/* Passenger monthly profile */}
          <div className="space-y-3">
            <span className="text-[10px] text-amber-500 font-mono tracking-widest uppercase font-bold">3. Perfil de Evolución de Pasajeros</span>
            <p className="text-xs text-gray-400 leading-relaxed">
              Distribución estacional histórica que consolida el flujo anual acumulado de Cusco, con picos marcados durante las festividades de junio y julio:
            </p>
            <div className="font-mono text-xs text-gray-200">
              <div className="grid grid-cols-3 border-b border-white/10 pb-1.5 font-bold uppercase text-gray-400">
                <span>Mes</span>
                <span className="text-right">Año Previo</span>
                <span className="text-right text-amber-500">Año Actual</span>
              </div>
              <div className="max-h-[140px] overflow-y-auto divide-y divide-white/5 pr-2">
                {data.passengersList.slice(0, 8).map((p, idx) => (
                  <div key={idx} className="grid grid-cols-3 py-1 text-[11px]">
                    <span>{p.month}</span>
                    <span className="text-right text-gray-400">{p.year2023.toLocaleString()}</span>
                    <span className="text-right text-white font-bold">{p.year2024.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Historical Concession Financials */}
          <div className="space-y-3">
            <span className="text-[10px] text-amber-500 font-mono tracking-widest uppercase font-bold">4. Evolución del Desempeño Comercial y EBITDA</span>
            <p className="text-xs text-gray-400 leading-relaxed">
              Márgenes operativos acumulados de los últimos ciclos contables certificados ante CORPAC:
            </p>
            <div className="font-mono text-xs text-gray-200 space-y-2">
              <div className="grid grid-cols-4 border-b border-white/10 pb-1.5 font-bold uppercase text-gray-400">
                <span>Año</span>
                <span className="text-right">Facturado</span>
                <span className="text-right text-amber-500">EBITDA %</span>
                <span className="text-right">Pasajeros</span>
              </div>
              {data.historicYears.map((y, idx) => (
                <div key={idx} className="grid grid-cols-4 py-1 text-[11px] border-b border-white/5">
                  <span className="font-bold text-white">{y.year}</span>
                  <span className="text-right">${y.revenue}M USD</span>
                  <span className="text-right text-amber-500 font-bold">{y.margin}%</span>
                  <span className="text-right">{y.passengers.toFixed(2)}M PAX</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 4. Strategic Risks identified in slot allocation */}
        <div className="space-y-4">
          <span className="text-[10px] text-amber-500 font-mono tracking-widest uppercase font-bold">5. Mitigación e Identificación de Riesgos Estratégicos</span>
          <p className="text-xs text-gray-400 pb-1">
            Análisis preventivo de alertas que exigen supervisión activa de los miembros delegados del consejo de administración:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.risks.slice(0, 2).map((r, idx) => (
              <div key={idx} className="p-3 bg-white/[0.01] border border-white/5 rounded-lg space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-gray-400 uppercase font-bold">Categoría: {r.category}</span>
                  <span className="text-red-400 font-bold">Severidad: {r.impact}</span>
                </div>
                <h5 className="font-bold text-white uppercase">{r.name}</h5>
                <p className="text-gray-450 leading-relaxed text-[11px]">{r.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Executive Conclusions of the Board */}
        <div className="space-y-4 pt-2">
          <span className="text-[10px] text-amber-500 font-mono tracking-widest uppercase font-bold">6. Dictamen de Conclusiones de la Segunda Sesión AOCC</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            {data.conclusiones.map((concl, idx) => (
              <div key={idx} className="p-4 bg-[#1a130b]/30 border border-amber-500/10 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center text-[9px] font-mono text-amber-500 uppercase font-bold">
                  <span>ÁREA: {concl.category}</span>
                  <span>{concl.value}</span>
                </div>
                <h5 className="font-bold text-white text-xs">{concl.title}</h5>
                <p className="text-gray-400 leading-normal text-[11px]">{concl.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sello de firma del Directorio */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-xs">
            <p className="text-gray-450 text-[10px] font-mono">AUDITADO POR LA DGAC Y COMPOSICIÓN DE GESTIÓN DE RAMPAS</p>
            <p className="text-gray-500 text-[9px] italic">Código de certificación: QR-AOCC-893-SEC-2026. Todos los derechos reservados.</p>
          </div>
          
          {/* Mock corporate stamp graphic */}
          <div className="flex flex-col items-center">
            <div className="border border-double border-emerald-500/50 text-emerald-400 px-4 py-2 text-center rounded text-[10px] font-mono uppercase bg-emerald-500/5 rotate-[-2deg]">
              <div className="font-black">DIRECTORIO CUZ</div>
              <div>VERIFICADO DIGITAL</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
