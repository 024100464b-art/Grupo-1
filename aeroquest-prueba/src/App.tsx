import React, { useState } from 'react';
import SCENARIOS from './data/scenarios';
import { ScenarioType } from './types';

// Importing custom components
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PrincipalDashboardView from './components/PrincipalDashboardView';
import SaludEmpresarialView from './components/SaludEmpresarialView';
import MercadoCrecimientoView from './components/MercadoCrecimientoView';
import RiesgosEstrategicosView from './components/RiesgosEstrategicosView';
import ExecutiveReport from './components/ExecutiveReport';

interface LoggedInUser {
  name: string;
}

export default function App() {
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [currentScenarioId, setScenarioId] = useState<ScenarioType>('alta_demanda');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Toast notifications state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active scenario data
  const activeScenario = SCENARIOS[currentScenarioId];

  // Helper trigger to display system-wide notifications
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleLogin = (username: string) => {
    setUser({ name: username === 'A.VALDIVIA' ? 'Alejandro Valdivia' : username });
    triggerToast(`Sesión autorizada. Bienvenido de vuelta al Centro de Monitoreo Estratégico de Cusco.`);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
    setScenarioId('alta_demanda');
    triggerToast('Has cerrado sesión en la terminal ejecutiva de forma segura.');
  };

  // If not logged in, display beautiful login screen
  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex bg-surface min-h-screen text-on-surface">
      {/* Toast Alert Pop-up */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-xl border border-amber-500/30 bg-[#121214]/95 text-on-surface tracking-wide shadow-2xl flex items-center gap-3 animate-fadeIn max-w-sm">
          <span className="material-symbols-outlined text-amber-500 p-1 bg-amber-500/10 rounded-full text-sm">
            notifications_active
          </span>
          <p className="text-xs font-semibold leading-relaxed font-sans text-gray-200">{toastMessage}</p>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeAlerts={activeScenario.activeRiesgosCount}
        directorName={user.name}
        onLogout={handleLogout}
      />

      {/* Content wrapper */}
      <div className="ml-[280px] flex-1 flex flex-col min-h-screen">
        {/* Header containing scenario switch */}
        <Header
          currentScenario={currentScenarioId}
          setScenario={(id) => {
            setScenarioId(id);
            triggerToast(`Entorno de negocio ajustado a: ${SCENARIOS[id].name}`);
          }}
          onNotificationsClick={() => {
            setActiveTab('riesgos_estrategicos');
            triggerToast('Abriendo panel de Riesgos Estratégicos para su inspección.');
          }}
          activeAlerts={activeScenario.activeRiesgosCount}
        />

        {/* Dynamic Inner Tab Views */}
        <div className="p-8 flex-1 space-y-8 pb-16">
          
          {/* Active Business Climate Banner */}
          <div className="p-5 rounded-xl bg-surface-container-high/40 border border-[#e9c176]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${activeScenario.badgeColor}`}>
                  {activeScenario.badge}
                </span>
                <span className="text-xs text-on-surface-variant font-mono">Foco de Negocio</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface">
                {activeScenario.name}
              </h3>
              <p className="text-xs text-on-surface-variant max-w-3xl leading-relaxed">
                {activeScenario.description}
              </p>
            </div>
            
            {/* Quick action button */}
            <div className="flex items-center gap-2.5 self-start md:self-center flex-shrink-0">
              <button 
                onClick={() => {
                  setActiveTab('reporte');
                  triggerToast('Cargando reporte ejecutivo general para el Directorio.');
                }}
                className="py-2.5 px-4 rounded-lg bg-surface-container hover:bg-surface-variant/30 text-amber-500 border border-[#e9c176]/10 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Ver Reporte de Directorio
              </button>
            </div>
          </div>

          {/* TAB Routing Content Area */}
          <div className="outline-none" tabIndex={-1}>
            {activeTab === 'dashboard' && (
              <PrincipalDashboardView 
                data={activeScenario} 
                onNavigateTab={(tab) => {
                  setActiveTab(tab);
                  triggerToast(`Navegando a la sección de ${tab === 'salud_empresarial' ? 'Salud Empresarial' : 'Mercado'}`);
                }}
              />
            )}

            {activeTab === 'salud_empresarial' && (
              <SaludEmpresarialView data={activeScenario} />
            )}

            {activeTab === 'mercado_crecimiento' && (
              <MercadoCrecimientoView data={activeScenario} />
            )}

            {activeTab === 'riesgos_estrategicos' && (
              <RiesgosEstrategicosView data={activeScenario} />
            )}

            {activeTab === 'reporte' && (
              <ExecutiveReport 
                data={activeScenario} 
                onExportDone={(msg) => triggerToast(msg)}
              />
            )}

            {/* Config View */}
            {activeTab === 'config' && (
              <div className="p-8 glass-card rounded-xl space-y-6 animate-fadeIn">
                <div>
                  <h3 className="font-sans text-lg font-light text-white tracking-wide">
                    Configuración de <span className="italic font-serif">Integración e Inteligencia</span>
                  </h3>
                  <p className="text-xs text-gray-400">Verifique los parámetros regulados de AeroGest Cusco.</p>
                </div>
                <div className="space-y-4 text-sm leading-relaxed text-gray-300 max-w-xl">
                  <p className="font-sans font-light">
                    Esta terminal ejecutiva de AeroGest Cusco está configurada bajo las regulaciones corporativas nacionales del Perú. Cuenta con sincronización instantánea y cifrado militar activo.
                  </p>
                  <div className="p-4 bg-white/[0.02] rounded-lg border border-white/5 text-xs font-mono space-y-1 text-gray-400">
                    <div>DIRECTOR ACTIVO: {user.name.toUpperCase()}</div>
                    <div>SITUACIÓN CORPORATIVA: AUDITADA (DGAC)</div>
                    <div>VERSIÓN DEL SISTEMA: AeroGest Cusco v5.0.0-STRAT</div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
