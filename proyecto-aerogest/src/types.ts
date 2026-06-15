export type ScenarioType = 'alta_demanda' | 'mal_clima' | 'mantenimiento_pista';

export interface MonthlyPassengerData {
  month: string;
  year2023: number;
  year2024: number;
}

export interface QuarterlyRevenue {
  quarter: string;
  revenue: number;
  margin: number;
}

export interface AirlineShare {
  name: string;
  share: number;
  passCount: string;
  ebitdaPct: number;
  health: 'Estable' | 'Bajo Alerta' | 'Excelente';
}

export interface MainRoute {
  name: string;
  passengers: string;
  sharePct: number;
  loadFactor: number;
  status: 'Alta Rentabilidad' | 'Estable' | 'En Crecimiento';
}

export interface StrategicRisk {
  id: string;
  name: string;
  description: string;
  category: 'Dependencia de Aerolíneas' | 'Saturación de Capacidad' | 'Riesgos Financieros' | 'Riesgos de Mercado' | 'Riesgos de Crecimiento';
  impact: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
  probability: 'Baja' | 'Media' | 'Alta';
  state: 'Activo' | 'Monitoreado' | 'Mitigado';
  trend: 'Creciente' | 'Estable' | 'Decreciente';
}

export interface FinancialKpi {
  label: string;
  value: string;
  detail: string;
  status: 'favorable' | 'estable' | 'restringido';
}

export interface HistoricYear {
  year: string;
  revenue: number;
  margin: number;
  passengers: number;
}

export interface StrategicConclusion {
  title: string;
  description: string;
  category: 'Mercado' | 'Finanzas' | 'Riesgos' | 'Infraestructura' | 'Directorio';
  value: string;
}

export interface ScenarioData {
  id: ScenarioType;
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  estadoGeneral: 'Favorable' | 'Estable' | 'Bajo Monitoreo';
  estadoGeneralDesc: string;
  ingresosAnuales: string;
  ingresosAnualesTrend: string;
  pasajerosAnuales: string;
  pasajerosAnualesTrend: string;
  crecimientoAnual: string;
  crecimientoAnualTrend: string;
  riesgosSummary: string;
  activeRiesgosCount: number;
  passengersList: MonthlyPassengerData[];
  quarterlyRevenue: QuarterlyRevenue[];
  airlineShares: AirlineShare[];
  mainRoutes: MainRoute[];
  financialKpis: FinancialKpi[];
  historicYears: HistoricYear[];
  risks: StrategicRisk[];
  conclusiones: StrategicConclusion[];
}

export interface DashboardStats {
  total_vuelos: number;
  vuelos_programados: number;
  vuelos_retrasados: number;
  vuelos_cancelados: number;
  vuelos_aterrizados: number;
  total_pasajeros: number;
  total_boletos: number;
  total_equipajes: number;
}

export interface Vuelo {
  id: string;
  codigo: string;
  aerolina: string;
  origen: string;
  destino: string;
  salida: string;
  llegada: string;
  puerta: string;
  estado: 'Programado' | 'En Vuelo' | 'Retrasados' | 'Retrasado' | 'Aterrizado' | 'Completados' | 'Completado' | 'Cancelado';
  hora_salida_real?: string;
}

export interface Pasajero {
  id: string;
  nombres: string;
  apellidos: string;
  tipo_documento: 'DNI' | 'PASAPORTE' | 'C.E.';
  documento: string;
  nacionalidad: string;
  telefono: string;
  correo: string;
}

export interface Boleto {
  id: string;
  codigo_boleto: string;
  pasajero_id: string;
  pasajero_nombre: string;
  pasajero_avatar_iniciales: string;
  vuelo_codigo: string;
  asiento: string;
  precio: number;
  estado: 'Confirmado' | 'Pendiente' | 'Cancelado';
}

export interface Equipaje {
  id: string;
  codigo_equipaje: string;
  pasajero_id: string;
  pasajero_nombre: string;
  codigo_boleto: string;
  peso: number;
  estado: 'En Tránsito' | 'Entregado' | 'Perdido';
}

export interface Incidencia {
  id: string;
  vuelo_id?: string;
  equipaje_id?: string;
  descripcion: string;
  estado: 'Abierta' | 'En Proceso' | 'Resuelta';
  fecha_reporte: string;
  fecha_resolucion?: string;
}
