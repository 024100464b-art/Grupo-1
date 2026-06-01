import React, { useState } from 'react';
import { Database, Filter, Monitor, LayoutDashboard, Cpu, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Architecture() {
  const [selectedStep, setSelectedStep] = useState<number>(4); // Default to Dashboard selected

  const steps = [
    {
      index: 0,
      title: 'SQL Server',
      tech: 'Base de Datos',
      icon: Database,
      desc: 'Motor relacional SQL Server para alta disponibilidad del transporte aéreo. Almacena de forma ordenada las entidades críticas de Cusco con disparadores (Triggers) optimizados.',
      sampleTitle: 'Esquema T-SQL - dbo.Vuelo',
      sampleCode: `CREATE TABLE Vuelo (
  ID_Vuelo INT PRIMARY KEY IDENTITY(1,1),
  Numero_Vuelo VARCHAR(10) UNIQUE,
  ID_Aeropuerto_Origen INT FOREIGN KEY REFERENCES Aeropuerto,
  ID_Aeropuerto_Destino INT FOREIGN KEY REFERENCES Aeropuerto,
  Hora_Salida VARCHAR(5) NOT NULL,
  Estado VARCHAR(30) DEFAULT 'A tiempo'
);`
    },
    {
      index: 1,
      title: 'EF Core',
      tech: 'OR/M de Acceso',
      icon: Cpu,
      desc: 'Mapeador Objeto-Relacional que traduce las tablas SQL a objetos nativos de C#, manteniendo una estricta fidelidad relacional en el servidor.',
      sampleTitle: 'Definición del DbContext C#',
      sampleCode: `public class AeroDbContext : DbContext {
  public DbSet<Vuelo> Vuelos { get; set; }
  public DbSet<Aeropuerto> Aeropuertos { get; set; }

  protected override void OnModelCreating(ModelBuilder mb) {
    mb.Entity<Vuelo>().HasIndex(v => v.Numero_Vuelo).IsUnique();
  }
}`
    },
    {
      index: 2,
      title: 'LINQ',
      tech: 'Motor Consultas',
      icon: Filter,
      desc: 'Consultas integradas fuertemente tipadas en .NET. Permite agrupar partidas y filtrar estados de vuelo sin necesidad de escribir código SQL plano.',
      sampleTitle: 'Consulta LINQ de Retrasos locales',
      sampleCode: `var reporteRetrasos = from v in _context.Vuelos
    join al in _context.Aerolineas on v.ID_Aerolinea equals al.ID_Aerolinea
    where v.Estado == "Retrasado"
    select new { 
      v.Numero_Vuelo, 
      Aerolinea = al.Nombre_AeroLineae, 
      v.Hora_Salida 
    };`
    },
    {
      index: 3,
      title: 'WinForms',
      tech: 'Interfaz Local',
      icon: Monitor,
      desc: 'Formulario administrativo para Windows, utilizado por la estación local de SPZO para registrar pasajeros e imprimir boletaje físico.',
      sampleTitle: 'Estructura UI del Formulario de Control',
      sampleCode: `public partial class MainForm : Form {
  private void InitializeAeroConsole() {
    this.Text = "Aero_System_Local.exe";
    this.BackColor = Color.FromArgb(244, 241, 238);
    this.dataGridViewVuelos.DataSource = await GetVuelosAsync();
  }
}`
    },
    {
      index: 4,
      title: 'Dashboard',
      tech: 'Consola Web',
      icon: LayoutDashboard,
      desc: 'Visualización inteligente y responsiva en tiempo real construida para coordinar de manera remota los flujos operacionales aéreos.',
      sampleTitle: 'Recepción del WebSocket',
      sampleCode: `const monitorFeed = new WebSocket("wss://aerocuery.cusco.gob.pe/live");
monitorFeed.onmessage = (event) => {
  const { flight, eventName, occupancy } = JSON.parse(event.data);
  updateOperationalMetrics(occupancy, flight);
};`
    }
  ];

  return (
    <section className="py-20 bg-[#F4F1EE] text-[#121212]" id="architecture">
      <div className="px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Detail */}
          <div className="lg:col-span-4 space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C05D38] block">
              Trazabilidad del Flujo
            </span>
            <h2 className="font-serif text-3xl md:text-4xl italic font-light text-[#121212] tracking-tight leading-tight">
              Arquitectura de Sincronización
            </h2>
            <p className="font-sans text-sm text-[#121212]/70 leading-relaxed border-t border-black/5 pt-4">
              Un pipeline técnico integrado de extremo a extremo. Muestra cómo fluyen e interactúan los datos desde la persistencia estricta relacional, pasando por el query LINQ, hasta la visualización ejecutiva.
            </p>
            
            {/* Interactive Step Card Detail */}
            <AnimatePresence mode="wait">
              {steps.map((s) => s.index === selectedStep && (
                <motion.div
                  key={s.index}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 bg-white border border-black/10 rounded-none relative overflow-hidden shadow-sm"
                >
                  {/* Selected accent label line */}
                  <div className="absolute top-0 bottom-0 left-0 w-[4px] bg-[#C05D38]" />
                  
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className="w-8 h-8 rounded-none border border-black/10 bg-[#E5E2DE] flex items-center justify-center text-black">
                      {React.createElement(s.icon, { className: 'w-4 h-4' })}
                    </div>
                    <div>
                      <span className="font-sans text-[9px] text-[#C05D38] tracking-widest uppercase font-bold">{s.tech}</span>
                      <h4 className="font-serif font-semibold text-black text-sm">{s.title}</h4>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-black/70 leading-relaxed">
                    {s.desc}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Right Pipeline Visualizer */}
          <div className="lg:col-span-8 w-full space-y-8">
            <div className="relative flex flex-col md:flex-row justify-between items-center gap-6 py-8 px-6 border border-black/10 rounded-none bg-white shadow-sm">
              
              {/* Connector line */}
              <div className="hidden md:block absolute left-12 right-12 top-1/2 h-[1px] bg-black/10 -translate-y-1/2 pointer-events-none" />

              {steps.map((step, idx) => {
                const IconComponent = step.icon;
                const isSelected = selectedStep === step.index;
                return (
                  <button
                    key={step.index}
                    onClick={() => setSelectedStep(step.index)}
                    className="relative z-10 flex flex-col items-center gap-3 group transition-all duration-300 focus:outline-none"
                    id={`arch_step_btn_${step.index}`}
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isSelected 
                        ? 'bg-[#121212] text-white border-2 border-black scale-105 shadow-sm' 
                        : 'bg-[#F4F1EE] text-black border border-black/15 hover:border-black/40 hover:bg-[#E5E2DE]'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <span className={`font-sans text-[11px] uppercase tracking-wider block transition-colors ${
                        isSelected ? 'text-[#C05D38] font-bold' : 'text-black/60 group-hover:text-black'
                      }`}>
                        {step.title}
                      </span>
                      <span className="font-sans text-[8px] text-black/40 block mt-0.5 uppercase tracking-tight">
                        {step.tech}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Code visual panel viewer */}
            <div className="border border-black/10 rounded-none bg-white overflow-hidden shadow-sm">
              <div className="bg-[#E5E2DE] px-4 py-2 border-b border-black/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#C05D38]" />
                  <span className="font-mono text-[10px] text-[#121212] uppercase font-bold tracking-wider">
                    REPRESENTACIÓN DEL CÓDIGO // {steps[selectedStep].title}
                  </span>
                </div>
                <span className="font-sans text-[9px] font-bold text-black/50 uppercase tracking-widest">
                  {steps[selectedStep].sampleTitle}
                </span>
              </div>
              <div className="p-4 bg-[#F4F1EE] overflow-x-auto border-t border-black/5">
                <pre className="font-mono text-xs text-[#121212] leading-relaxed">
                  <code>{steps[selectedStep].sampleCode}</code>
                </pre>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
