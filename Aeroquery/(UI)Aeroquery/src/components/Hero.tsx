import React from 'react';
import { motion } from 'motion/react';
import { Database, Eye, Terminal, Star, ArrowRight } from 'lucide-react';

// Import generated images
// @ts-ignore
import runwayImg from '../assets/images/cusco_airport_runway_latam_1780076021332.png';
// @ts-ignore
import gateImg from '../assets/images/cusco_airport_gate_latam_1780076041964.png';

interface HeroProps {
  onExploreSchema: () => void;
  onOpenConsole: () => void;
}

export default function Hero({ onExploreSchema, onOpenConsole }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 bg-[#F4F1EE] text-[#121212] overflow-hidden" id="hero">
      {/* Editorial subtle pattern lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column - Editorial Headline Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Issue Tag */}
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C05D38] block">
            Edición No. 12 — Andes Operación Aérea
          </span>
          
          {/* Main Title */}
          <h1 className="font-serif text-6xl md:text-[84px] leading-[0.9] font-light tracking-tight italic text-[#121212] py-2">
            AeroQuery <br/>
            <span className="font-sans font-black uppercase not-italic tracking-tighter text-[54px] md:text-[72px] block mt-2 text-[#121212]">CUSCO</span>
          </h1>

          {/* Description */}
          <p className="font-sans text-base md:text-lg leading-relaxed text-[#121212]/80 max-w-xl pr-6 pt-2 border-t border-black/5">
            Sincronización operacional inteligente de base de datos relacional para el control aeronáutico del Aeropuerto Internacional Alejandro Velasco Astete. Optimizando pista, rutas y equipaje bajo condiciones meteorológicas extremas y altitud crítica.
          </p>

          {/* Action triggers */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={onOpenConsole}
              className="px-8 py-4 bg-[#121212] text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-none hover:bg-[#C05D38] active:scale-95 transition-all duration-300 flex items-center gap-3 group"
              id="hero_btn_proyecto"
            >
              <Terminal className="w-4 h-4 text-white group-hover:rotate-6 transition-transform" />
              Consola del Proyecto
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1.5 transition-all" />
            </button>
            
            <button
              onClick={onExploreSchema}
              className="px-8 py-4 border border-[#121212]/25 text-[#121212] text-[11px] font-bold uppercase tracking-[0.2em] rounded-none hover:bg-black/5 active:scale-95 transition-all duration-300 flex items-center gap-2"
              id="hero_btn_db"
            >
              <Database className="w-4 h-4" />
              Esquema de Tablas
            </button>
          </div>

          {/* Editorial Metadata Grid */}
          <div className="pt-8 grid grid-cols-3 gap-6 border-t border-black/10 max-w-lg">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-black/40">Altitud Base</p>
              <p className="font-serif italic text-lg text-[#121212] mt-1">3,400 msnm</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-black/40">Código IATA</p>
              <p className="font-serif italic text-lg text-[#121212] mt-1">SPZO / CUZ</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-black/40">Sustentación</p>
              <p className="font-serif italic text-lg text-[#C05D38] mt-1 flex items-center gap-1">
                Visual (VFR)
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Visual Narrative Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative lg:ml-auto w-full"
        >
          {/* Framed Graphic Container */}
          <div className="border border-black/10 bg-[#E5E2DE] p-6 pb-12 rounded-none shadow-sm relative">
            <div className="relative">
              {/* Main Runway Image */}
              <div className="relative aspect-[4/3] w-[82%] overflow-hidden bg-black/5 border border-black/30">
                <img 
                  src={runwayImg} 
                  alt="AeroQuery Cusco - Pista de Vuelo SPZO" 
                  className="w-full h-full object-cover hover:scale-105 duration-700 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                
                {/* Top Banner on Image */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-black/5 px-2.5 py-1 text-black font-sans text-[8px] font-bold tracking-widest uppercase shadow-sm">
                  Pista de Vuelo (SPZO)
                </div>

                {/* Caption Overlay */}
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-white/80">Fotografía de Archivo</span>
                  <span className="block text-base md:text-lg font-serif italic">Andes Occidentales del Cusco</span>
                </div>
              </div>

              {/* Secondary Gate Image (Staggered Overlapping) */}
              <div className="absolute -bottom-12 -right-2 w-[48%] aspect-[4/3] overflow-hidden bg-[#E5E2DE] p-1.5 border border-black/10 shadow-lg z-20">
                <div className="relative w-full h-full overflow-hidden border border-black/5">
                  <img 
                    src={gateImg} 
                    alt="AeroQuery Cusco - Terminal SPZO" 
                    className="w-full h-full object-cover hover:scale-105 duration-700 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                  
                  {/* Caption Overlay */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="block text-[7px] font-bold uppercase tracking-[0.2em] text-white/80">Terminal</span>
                    <span className="block text-[11px] font-serif italic leading-tight">Puertas de Abordaje</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status line */}
            <div className="mt-16 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-black/50">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#C05D38]" />
                <span>SERVER_STATE // ONLINE</span>
              </div>
              <span className="hidden sm:inline">REGISTRADO BAJO REGLAMENTO DGAC PERÚ</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
