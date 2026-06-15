/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import VuelosView from './components/VuelosView';
import PasajerosView from './components/PasajerosView';
import BoletosView from './components/BoletosView';
import EquipajesView from './components/EquipajesView';
import IncidenciasView from './components/IncidenciasView';

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

import { Vuelo, Pasajero, Boleto, Equipaje, DashboardStats } from './types';
import { Plane, AlertTriangle } from 'lucide-react';
import SupabaseMissingBanner from './components/SupabaseMissingBanner';

export default function App() {
  // Estado de Autenticación persistente
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('aerogest_auth_token') === 'true';
  });

  // Vista operacional activa
  const [activeView, setActiveView] = useState<string>('dashboard');

  // Estados de los datos del sistema
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [vuelos, setVuelos] = useState<Vuelo[]>([]);
  const [pasajeros, setPasajeros] = useState<Pasajero[]>([]);
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [equipajes, setEquipajes] = useState<Equipaje[]>([]);

  // Término de búsqueda compartido
  const [searchTerm, setSearchTerm] = useState('');

  // Indicadores de carga y sincronización
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [openCreateFlightModal, setOpenCreateFlightModal] = useState(false);

  // Filtro de boletos persistente para búsquedas cruzadas
  const [boletoSearchFilter, setBoletoSearchFilter] = useState('');

  // 1. Cargar datos desde Supabase con falla a Mock Database
  const fetchAllOperationalData = async () => {
    setIsLoading(true);
    setErrorStatus(null);
    if (!hasSupabaseConfig) {
      setErrorStatus('Falta configurar la conexión con Supabase');
      setIsLoading(false);
      return;
    }
    try {
      // Solicitar datos en paralelo para agilizar
      const [
        loadedStats,
        loadedVuelos,
        loadedPasajeros,
        loadedBoletos,
        loadedEquipajes
      ] = await Promise.all([
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
    } catch (err: any) {
      console.error('Error cargando Cusco AeroGest dataset:', err);
      setErrorStatus('No se pudo conectar debidamente a la base de datos de Cusco. Revise los logs.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos al autenticar
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllOperationalData();
    }
  }, [isAuthenticated]);

  // Restablecer búsqueda al cambiar de menú para evitar persistencia incómoda
  useEffect(() => {
    setSearchTerm('');
    setBoletoSearchFilter('');
  }, [activeView]);

  // Manejadores de autenticación
  const handleLoginSuccess = () => {
    localStorage.setItem('aerogest_auth_token', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    if (confirm('¿Está seguro que desea salir del Sistema de Información Cusco?')) {
      localStorage.removeItem('aerogest_auth_token');
      setIsAuthenticated(false);
      setActiveView('dashboard');
    }
  };

  // Transiciones inteligentes entre módulos operacionales
  const handleNavigateWithAction = (view: string, openCreateForm = false) => {
    setActiveView(view);
    if (openCreateForm && view === 'vuelos') {
      setOpenCreateFlightModal(true);
    }
  };

  const handleNavigateToBoletosWithPasajero = (pasajeroNombreCompleto: string) => {
    setBoletoSearchFilter(pasajeroNombreCompleto);
    setActiveView('boletos');
  };

  // --- MÉTODOS DE ESCRITURA INTEGRAL CON PERSISTENCIA ---

  const handleAddVuelo = async (nuevo: Omit<Vuelo, 'id'>) => {
    const salvado = await addVuelo(nuevo);
    setVuelos((prev) => [salvado, ...prev]);
    // Sincronizar estadísticas
    const updatedStats = await getDashboardStats();
    setStats(updatedStats);
    return salvado;
  };

  const handleAddPasajero = async (nuevo: Omit<Pasajero, 'id'>) => {
    const salvado = await addPasajero(nuevo);
    setPasajeros((prev) => [salvado, ...prev]);
    const updatedStats = await getDashboardStats();
    setStats(updatedStats);
    return salvado;
  };

  const handleAddBoleto = async (nuevo: Omit<Boleto, 'id' | 'pasajero_avatar_iniciales'>) => {
    const salvado = await addBoleto(nuevo);
    setBoletos((prev) => [salvado, ...prev]);
    const updatedStats = await getDashboardStats();
    setStats(updatedStats);
    return salvado;
  };

  const handleAddEquipaje = async (nuevo: Omit<Equipaje, 'id'>) => {
    const salvado = await addEquipaje(nuevo);
    setEquipajes((prev) => [salvado, ...prev]);
    const updatedStats = await getDashboardStats();
    setStats(updatedStats);
    return salvado;
  };

  // Handlers de actualización de estado
  const handleUpdateEstadoVuelo = useCallback(
    async (id: string, nuevoEstado: Vuelo['estado'], nuevaPuerta?: string) => {
      const actualizado = await updateEstadoVuelo(id, nuevoEstado, nuevaPuerta);
      setVuelos((prev) => prev.map((v) => (v.id === id ? actualizado : v)));
      const updatedStats = await getDashboardStats();
      setStats(updatedStats);
      return actualizado;
    },
    []
  );

  const handleUpdateEstadoEquipaje = useCallback(
    async (id: string, nuevoEstado: Equipaje['estado']) => {
      const actualizado = await updateEstadoEquipaje(id, nuevoEstado);
      setEquipajes((prev) => prev.map((eq) => (eq.id === id ? actualizado : eq)));
      const updatedStats = await getDashboardStats();
      setStats(updatedStats);
      return actualizado;
    },
    []
  );

  useRealtimeSync(
    useCallback(() => { fetchAllOperationalData(); }, [])
  );

  // Renderizar Login si no se encuentra autenticado
  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  // Definición de placeholder dinámico de búsqueda en base al módulo activo
  let searchPlaceholder = "Buscar en Cusco AeroGest...";
  if (activeView === 'vuelos') searchPlaceholder = "Filtrar por código de vuelo, aerolínea u origen...";
  else if (activeView === 'pasajeros') searchPlaceholder = "Filtrar por nombre, documento o nacionalidad...";
  else if (activeView === 'boletos') searchPlaceholder = "Filtrar por código de boleto o pasajero de Cusco...";
  else if (activeView === 'equipajes') searchPlaceholder = "Buscar equipaje por código de bulto o pasajero...";

  return (
    <div className="min-h-screen bg-gray-100/50 flex">
      {/* 1. Sidebar Fijo */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onLogout={handleLogout} 
      />

      {/* 2. Área del Canvas de Visualización Operativa */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        {/* Header Superior Conectado */}
        <Header 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          searchPlaceholder={searchPlaceholder}
          onRefreshData={fetchAllOperationalData}
        />

        {/* Workspace Principal con margen superior para el Header fijo */}
        <main className="pt-24 px-8 pb-10 flex-grow max-w-7xl w-full mx-auto">
          {isLoading ? (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4 animate-pulse">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200">
                <Plane className="w-6 h-6 text-blue-600 animate-spin" />
              </div>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                Cargando Vistas Cusco Sincronizadas...
              </p>
            </div>
          ) : errorStatus ? (
            errorStatus === 'Falta configurar la conexión con Supabase' ? (
              <SupabaseMissingBanner />
            ) : (
              <div className="bg-red-50 border border-red-200 p-6 rounded-2xl flex items-center gap-4 text-red-700">
                <AlertTriangle className="w-10 h-10 shrink-0" />
                <div>
                  <h4 className="font-bold">Error Operacional</h4>
                  <p className="text-sm mt-0.5">{errorStatus}</p>
                  <button
                    onClick={fetchAllOperationalData}
                    className="mt-3 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold cursor-pointer"
                  >
                    Reintentar sincronizar
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="animate-fade-in">
              {/* Vistas operacionales dinámicas */}
              {activeView === 'dashboard' && stats && (
                <DashboardView 
                  stats={stats} 
                  vuelos={vuelos} 
                  onNavigateToView={handleNavigateWithAction} 
                />
              )}

              {activeView === 'vuelos' && (
                <VuelosView
                  vuelos={vuelos}
                  onAddVuelo={handleAddVuelo}
                  onUpdateEstadoVuelo={handleUpdateEstadoVuelo}
                  searchTerm={searchTerm}
                  openCreateImmediately={openCreateFlightModal}
                  onCloseCreateImmediately={() => setOpenCreateFlightModal(false)}
                />
              )}

              {activeView === 'pasajeros' && (
                <PasajerosView
                  pasajeros={pasajeros}
                  onAddPasajero={handleAddPasajero}
                  searchTerm={searchTerm}
                  onNavigateToBoletosWithPasajeroId={handleNavigateToBoletosWithPasajero}
                />
              )}

              {activeView === 'boletos' && (
                <BoletosView
                  boletos={boletos}
                  onAddBoleto={handleAddBoleto}
                  searchTerm={boletoSearchFilter || searchTerm}
                />
              )}

              {activeView === 'equipajes' && (
                <EquipajesView
                  equipajes={equipajes}
                  onAddEquipaje={handleAddEquipaje}
                  onUpdateEstadoEquipaje={handleUpdateEstadoEquipaje}
                  searchTerm={searchTerm}
                />
              )}

              {activeView === 'incidencias' && <IncidenciasView />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
