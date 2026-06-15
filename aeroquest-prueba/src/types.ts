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
  share: number; // Market share percentage
  passCount: string; // Passenger count representation
  ebitdaPct: number; // EBITDA margin contribution
  health: 'Estable' | 'Bajo Alerta' | 'Excelente';
}

export interface MainRoute {
  name: string;
  passengers: string;
  sharePct: number;
  loadFactor: number; // Ocupación media%
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
  
  // Core Business Metrics for Dashboard Panel
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

  // Chart data sets
  passengersList: MonthlyPassengerData[];
  quarterlyRevenue: QuarterlyRevenue[];
  airlineShares: AirlineShare[];
  mainRoutes: MainRoute[];

  // Strategic indicators & financial metrics
  financialKpis: FinancialKpi[];
  historicYears: HistoricYear[];

  // Risks & Corporate Conclusions
  risks: StrategicRisk[];
  conclusiones: StrategicConclusion[];
}
