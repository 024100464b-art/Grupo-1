import React from 'react';
import { Plane, Database, Library, Cpu, LayoutDashboard, Terminal } from 'lucide-react';

interface HeaderProps {
  onNavClick: (section: string) => void;
  activeSection: string;
}

export default function Header({ onNavClick, activeSection }: HeaderProps) {
  const navItems = [
    { id: 'architecture', label: 'Arquitectura', icon: Cpu },
    { id: 'database', label: 'Base de Datos', icon: Database },
    { id: 'queries', label: 'Consultas Inteligentes', icon: Library },
    { id: 'dashboard', label: 'Consola Operativa', icon: LayoutDashboard },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-[#F4F1EE]/90 backdrop-blur-md border-b border-black/10 shadow-sm">
      <div className="flex justify-between items-center h-20 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavClick('hero')} 
          className="flex items-center gap-3 cursor-pointer group"
          id="nav_logo"
        >
          <div className="w-9 h-9 border border-black/15 bg-white flex items-center justify-center text-[#121212] group-hover:bg-[#C05D38] group-hover:text-white transition-all duration-300">
            <Plane className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </div>
          <div className="font-serif text-xl font-bold tracking-tight text-[#121212] group-hover:text-[#C05D38] transition-colors">
            AeroQuery <span className="font-normal italic">Cusco</span>
          </div>
        </div>

        {/* Navigation Link Items */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className={`flex items-center gap-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 py-1.5 px-3 rounded-none ${
                  isActive 
                    ? 'text-[#C05D38] border-b-2 border-[#C05D38]' 
                    : 'text-[#121212]/60 hover:text-[#121212]'
                }`}
                id={`nav_${item.id}`}
              >
                <Icon className="w-3.5 h-3.5 opacity-70" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavClick('queries')} 
            className="text-[#121212]/60 font-sans text-[11px] font-bold uppercase tracking-[0.1em] hover:text-[#121212] transition-colors"
            id="nav_doc_btn"
          >
            Ref. API
          </button>
          <button 
            onClick={() => onNavClick('dashboard')} 
            className="group bg-[#121212] text-white font-sans font-bold text-[11px] uppercase tracking-[0.15em] px-5 py-3 rounded-none hover:bg-[#C05D38] active:scale-95 transition-all duration-300"
            id="nav_action_btn"
          >
            <span className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" />
              Consola Live
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
