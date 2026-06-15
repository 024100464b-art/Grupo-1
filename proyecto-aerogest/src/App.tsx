import React, { useState, useEffect, useCallback, createContext, useContext, lazy, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginScreen from './components/LoginScreen';

import {
  getDashboardStats,
  getVuelos,
  getPasajeros,
  getBoletos,
  getEquipajes,
  addVuelo,
  addPasajero,
  addBoleto,
  addEquipaje,
  updateEstadoVuelo,
  updateEstadoEquipaje,
  hasSupabaseConfig
} from './supabase';

import { useRealtimeSync } from './hooks/useRealtimeSync';
import { SCENARIOS } from './data/scenarios';
import { ScenarioType, Vuelo, Pasajero, Boleto, Equipaje, DashboardStats } from './types';

const PrincipalDashboardView = lazy(() => import('./components/PrincipalDashboardView'));
const SaludEmpresarialView = lazy(() => import('./components/SaludEmpresarialView'));
const MercadoCrecimientoView = lazy(() => import('./components/MercadoCrecimientoView'));
const RiesgosEstrategicosView = lazy(() => import('./components/RiesgosEstrategicosView'));
const ExecutiveReport = lazy(() => import('./components/ExecutiveReport'));
const DashboardView = lazy(() => import('./components/DashboardView'));
const VuelosView = lazy(() => import('./components/VuelosView'));
const PasajerosView = lazy(() => import('./components/PasajerosView'));
const BoletosView = lazy(() => import('./components/BoletosView'));
const EquipajesView = lazy(() => import('./components/EquipajesView'));
const IncidenciasView = lazy(() => import('./components/IncidenciasView'));
const MonitoreoView = lazy(() => import('./components/MonitoreoView'));

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const ToastContext = createContext<{ addToast: (message: string, type: Toast['type']) => void }>({
  addToast: () => {}
});

export function useToast() {
  return useContext(ToastContext);
}

function Loader() {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <span className="material-symbols-outlined text-4xl text-amber-500 animate-spin"
        style={{ fontVariationSettings: "'FILL' 1" } as React.CSSProperties}>
        flight
      </span>
      <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Cargando módulo...</p>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('aerogest_auth_token') === 'true';
  });
  const [directorName, setDirectorName] = useState('A.VALDIVIA');

  const [currentScenario, setCurrentScenario] = useState<ScenarioType>('alta_demanda');
  const [activeTab, setActiveTab] = useState('dashboard');

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [vuelos, setVuelos] = useState<Vuelo[]>([]);
  const [pasajeros, setPasajeros] = useState<Pasajero[]>([]);
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [equipajes, setEquipajes] = useState<Equipaje[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [openCreateFlightModal, setOpenCreateFlightModal] = useState(false);
  const [boletoSearchFilter, setBoletoSearchFilter] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const scenarioData = SCENARIOS[currentScenario];
  const activeAlerts = scenarioData.activeRiesgosCount;

  const addToast = (message: string, type: Toast['type']) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const fetchAllOperationalData = useCallback(async () => {
    setIsLoading(true);
    setErrorStatus(null);
    if (!hasSupabaseConfig) {
      setErrorStatus('Falta configurar la conexión con Supabase');
      setIsLoading(false);
      return;
    }
    try {
      const [loadedStats, loadedVuelos, loadedPasajeros, loadedBoletos, loadedEquipajes] =
        await Promise.all([
          getDashboardStats(),
          getVuelos(),
          getPasajeros(),
          getBoletos(),
          getEquipajes()
        ]);
      setStats(loadedStats);
      setVuelos(loadedVuelos);
      setPasajeros(loadedPasajeros);
      setBoletos(loadedBoletos);
      setEquipajes(loadedEquipajes);
    } catch {
      setErrorStatus('No se pudo conectar a la base de datos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchAllOperationalData();
  }, [isAuthenticated, fetchAllOperationalData]);

  useEffect(() => {
    setSearchTerm('');
    setBoletoSearchFilter('');
  }, [activeTab]);

  const handleLogin = (username: string) => {
    localStorage.setItem('aerogest_auth_token', 'true');
    setIsAuthenticated(true);
    setDirectorName(username);
  };

  const handleLogout = () => {
    if (confirm('¿Está seguro que desea salir del Sistema de Información Cusco?')) {
      localStorage.removeItem('aerogest_auth_token');
      setIsAuthenticated(false);
      setDirectorName('A.VALDIVIA');
      setActiveTab('dashboard');
    }
  };

  const handleNavigateWithAction = (view: string, openCreateForm = false) => {
    setActiveTab(view);
    if (openCreateForm && view === 'vuelos') setOpenCreateFlightModal(true);
  };

  const handleNavigateToBoletosWithPasajero = (nombrePasajero: string) => {
    setBoletoSearchFilter(nombrePasajero);
    setActiveTab('boletos');
  };

  const handleAddVuelo = async (nuevo: Omit<Vuelo, 'id'>) => {
    const salvado = await addVuelo(nuevo);
    setVuelos(prev => [salvado, ...prev]);
    setStats(await getDashboardStats());
    addToast(`Vuelo ${salvado.codigo} registrado`, 'success');
    return salvado;
  };

  const handleAddPasajero = async (nuevo: Omit<Pasajero, 'id'>) => {
    const salvado = await addPasajero(nuevo);
    setPasajeros(prev => [salvado, ...prev]);
    setStats(await getDashboardStats());
    addToast(`Pasajero ${salvado.nombres} registrado`, 'success');
    return salvado;
  };

  const handleAddBoleto = async (nuevo: Omit<Boleto, 'id' | 'pasajero_avatar_iniciales'>) => {
    const salvado = await addBoleto(nuevo);
    setBoletos(prev => [salvado, ...prev]);
    setStats(await getDashboardStats());
    addToast(`Boleto ${salvado.codigo_boleto} emitido`, 'success');
    return salvado;
  };

  const handleAddEquipaje = async (nuevo: Omit<Equipaje, 'id'>) => {
    const salvado = await addEquipaje(nuevo);
    setEquipajes(prev => [salvado, ...prev]);
    setStats(await getDashboardStats());
    addToast(`Equipaje ${salvado.codigo_equipaje} registrado`, 'success');
    return salvado;
  };

  const handleUpdateEstadoVuelo = useCallback(
    async (id: string, nuevoEstado: Vuelo['estado'], nuevaPuerta?: string) => {
      const actualizado = await updateEstadoVuelo(id, nuevoEstado, nuevaPuerta);
      setVuelos(prev => prev.map(v => (v.id === id ? actualizado : v)));
      setStats(await getDashboardStats());
      return actualizado;
    },
    []
  );

  const handleUpdateEstadoEquipaje = useCallback(
    async (id: string, nuevoEstado: Equipaje['estado']) => {
      const actualizado = await updateEstadoEquipaje(id, nuevoEstado);
      setEquipajes(prev => prev.map(eq => (eq.id === id ? actualizado : eq)));
      setStats(await getDashboardStats());
      return actualizado;
    },
    []
  );

  useRealtimeSync(
    useCallback(() => { fetchAllOperationalData(); }, [fetchAllOperationalData])
  );

  let searchPlaceholder = 'Buscar en AeroGest Cusco...';
  if (activeTab === 'vuelos') searchPlaceholder = 'Filtrar por código de vuelo, aerolínea u origen...';
  else if (activeTab === 'pasajeros') searchPlaceholder = 'Filtrar por nombre, documento o nacionalidad...';
  else if (activeTab === 'boletos') searchPlaceholder = 'Filtrar por código de boleto o pasajero...';
  else if (activeTab === 'equipajes') searchPlaceholder = 'Buscar equipaje por código de bulto o pasajero...';

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className="min-h-screen bg-[#08080a] flex">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeAlerts={activeAlerts}
          directorName={directorName}
          onLogout={handleLogout}
        />

        <div className="flex-1 pl-[280px] flex flex-col min-h-screen">
          <Header
            currentScenario={currentScenario}
            setScenario={setCurrentScenario}
            onNotificationsClick={() => setActiveTab('incidencias')}
            activeAlerts={activeAlerts}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchPlaceholder={searchPlaceholder}
            onRefreshData={fetchAllOperationalData}
            showSearch={['vuelos', 'pasajeros', 'boletos', 'equipajes'].includes(activeTab)}
          />

          <main className="pt-24 px-8 pb-10 flex-grow max-w-7xl w-full mx-auto">
            {isLoading ? (
              <div className="h-[60vh] flex flex-col items-center justify-center gap-4 animate-pulse">
                <span className="material-symbols-outlined text-5xl text-amber-500 animate-spin"
                  style={{ fontVariationSettings: "'FILL' 1" } as React.CSSProperties}>
                  flight
                </span>
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                  Cargando Datos del Sistema...
                </p>
              </div>
            ) : errorStatus ? (
              <div className="glass-card p-8 rounded-xl border border-red-500/20 bg-red-950/10">
                <div className="flex items-center gap-4 text-red-400">
                  <span className="material-symbols-outlined text-3xl">error</span>
                  <div>
                    <h4 className="font-bold text-sm">Error de Conexión</h4>
                    <p className="text-xs mt-1">{errorStatus}</p>
                    <button
                      onClick={fetchAllOperationalData}
                      className="mt-3 px-4 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded text-xs font-semibold cursor-pointer transition-all"
                    >
                      Reintentar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Suspense fallback={<Loader />}>
                <div className="animate-fade-in">
                  {activeTab === 'dashboard' && (
                    <PrincipalDashboardView data={scenarioData} onNavigateTab={setActiveTab} />
                  )}
                  {activeTab === 'salud_empresarial' && (
                    <SaludEmpresarialView data={scenarioData} />
                  )}
                  {activeTab === 'mercado_crecimiento' && (
                    <MercadoCrecimientoView data={scenarioData} />
                  )}
                  {activeTab === 'riesgos_estrategicos' && (
                    <RiesgosEstrategicosView data={scenarioData} />
                  )}
                  {activeTab === 'reporte' && (
                    <ExecutiveReport data={scenarioData} onExportDone={(msg) => addToast(msg, 'success')} />
                  )}

                  {activeTab === 'ops_dashboard' && stats && (
                    <DashboardView
                      stats={stats}
                      vuelos={vuelos}
                      onNavigateToView={handleNavigateWithAction}
                    />
                  )}
                  {activeTab === 'vuelos' && (
                    <VuelosView
                      vuelos={vuelos}
                      onAddVuelo={handleAddVuelo}
                      onUpdateEstadoVuelo={handleUpdateEstadoVuelo}
                      searchTerm={searchTerm}
                      openCreateImmediately={openCreateFlightModal}
                      onCloseCreateImmediately={() => setOpenCreateFlightModal(false)}
                    />
                  )}
                  {activeTab === 'pasajeros' && (
                    <PasajerosView
                      pasajeros={pasajeros}
                      onAddPasajero={handleAddPasajero}
                      searchTerm={searchTerm}
                      onNavigateToBoletosWithPasajeroId={handleNavigateToBoletosWithPasajero}
                    />
                  )}
                  {activeTab === 'boletos' && (
                    <BoletosView
                      boletos={boletos}
                      onAddBoleto={handleAddBoleto}
                      searchTerm={boletoSearchFilter || searchTerm}
                    />
                  )}
                  {activeTab === 'equipajes' && (
                    <EquipajesView
                      equipajes={equipajes}
                      onAddEquipaje={handleAddEquipaje}
                      onUpdateEstadoEquipaje={handleUpdateEstadoEquipaje}
                      searchTerm={searchTerm}
                    />
                  )}
                  {activeTab === 'incidencias' && <IncidenciasView />}
                  {activeTab === 'monitoreo' && <MonitoreoView vuelos={vuelos} />}
                {activeTab === 'config' && (
                  <div className="glass-card p-8 rounded-xl border border-white/5 max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                      <span className="material-symbols-outlined text-4xl text-gray-500 mb-4">settings</span>
                      <h3 className="text-lg font-semibold text-white">Ajustes de Sistema</h3>
                      <p className="text-sm text-gray-400 mt-1">Terminal AOCC Cusco — Configuración y estado.</p>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: 'Conexión Supabase', ok: Boolean((import.meta as any).env.VITE_SUPABASE_URL && (import.meta as any).env.VITE_SUPABASE_ANON_KEY) },
                        { label: 'API Gemini', ok: Boolean((import.meta as any).env.VITE_GEMINI_API_KEY) },
                        { label: 'Entorno', value: (import.meta as any).env.PROD ? 'Producción' : 'Desarrollo', ok: true },
                        { label: 'Versión App', value: '4.2.1', ok: true },
                        { label: 'Base de datos', value: 'PostgreSQL 15 (Supabase)', ok: true },
                        { label: 'Sincronización', value: 'Tiempo real vía WebSocket', ok: true },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2.5 px-4 bg-[#161618] rounded-lg border border-white/5">
                          <span className="text-xs font-mono text-gray-400">{item.label}</span>
                          <div className="flex items-center gap-2">
                            {item.value && <span className="text-xs font-mono text-gray-200">{item.value}</span>}
                            <span className={`w-2 h-2 rounded-full ${item.ok ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                </div>
              </Suspense>
            )}
          </main>

          {toasts.length > 0 && (
            <div className="fixed bottom-6 right-6 z-50 space-y-2 max-w-sm">
              {toasts.map(t => (
                <div
                  key={t.id}
                  className={`px-5 py-3 rounded-xl shadow-2xl border text-xs font-semibold font-mono backdrop-blur-sm animate-slide-up ${
                    t.type === 'success'
                      ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-300'
                      : t.type === 'error'
                      ? 'bg-red-500/15 border-red-500/25 text-red-300'
                      : 'bg-amber-500/15 border-amber-500/25 text-amber-300'
                  }`}
                >
                  {t.message}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ToastContext.Provider>
  );
}
