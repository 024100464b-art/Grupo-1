import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import BentoGrid from './components/BentoGrid';
import Architecture from './components/Architecture';
import SchemaExplorer from './components/SchemaExplorer';
import Queries from './components/Queries';
import ControlDeck from './components/ControlDeck';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('architecture');

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EE] text-[#121212] selection:bg-[#C05D38]/20 selection:text-[#C05D38]">
      {/* Editorial Navigation Header */}
      <Header 
        onNavClick={handleNavClick} 
        activeSection={activeSection} 
      />

      {/* Main Publication Panels */}
      <main className="space-y-0">
        
        {/* Cover Hero Landing Section */}
        <Hero 
          onExploreSchema={() => handleNavClick('database')}
          onOpenConsole={() => handleNavClick('dashboard')}
        />

        {/* Dynamic Bento Modules overview */}
        <BentoGrid />

        {/* Sync Architecture pipelines */}
        <Architecture />

        {/* Relational Table dictionary & DB Simulation */}
        <SchemaExplorer />

        {/* SQL & LINQ Translation dictionaries */}
        <Queries />

        {/* Operational live telemetry console */}
        <ControlDeck />

      </main>

      {/* Structured Minimal Journal Footer */}
      <footer className="bg-white border-t border-black/10 py-16 px-6 text-[#121212]/60 font-sans text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2">
            <h4 className="font-serif italic text-lg font-bold text-black">AeroQuery <span className="font-light text-black/50">Cusco</span></h4>
            <p className="max-w-md font-light text-black/50 leading-relaxed">
              Consola administrativa optimizada conforme a especificaciones aeronáuticas con persistencia de integridad relacional SQL Server. Cusco, Perú, Suramérica.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-6 text-[10px] font-bold uppercase tracking-wider text-black/40">
            <div>
              <p className="text-black mb-1.5">Sistemas Core</p>
              <ul className="space-y-1 font-medium text-black/50 hover:text-[#C05D38] transition-colors">
                <li><a href="#architecture">Transact-SQL T-SQL</a></li>
                <li><a href="#database">EF Core System</a></li>
                <li><a href="#queries">LINQ Engine</a></li>
              </ul>
            </div>
            <div>
              <p className="text-black mb-1.5">Habilitación</p>
              <ul className="space-y-1 font-medium text-black/50">
                <li>SPZO Visual (VFR)</li>
                <li>Altitud 11,150 ft</li>
                <li>Pista de 3,400m</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between text-[11px] font-bold uppercase tracking-widest text-[#121212]/40">
          <p>© 2026 AeroQuery Cusco. Todos los derechos reservados.</p>
          <p className="flex items-center gap-2 mt-2 md:mt-0 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
            <span>ESTADO DE OPERACIÓN: ÓPTIMO</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
