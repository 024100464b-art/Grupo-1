import { ScenarioData } from '../types';

export const SCENARIOS: Record<string, ScenarioData> = {
  alta_demanda: {
    id: 'alta_demanda',
    name: 'Escenario A: Alta Demanda Turística e Inti Raymi',
    badge: 'Máxima Expansión',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description: 'Pico estacional extraordinario impulsado por el turismo internacional e Inti Raymi. Flujo de capitales al alza, altos márgenes de concesiones comerciales y óptimo factor de ocupación de slots.',
    
    estadoGeneral: 'Favorable',
    estadoGeneralDesc: 'Posición financiera sólida con ingresos comerciales de retail en niveles récord. Máxima conversión turística por pasajero (TUA).',
    ingresosAnuales: '$148.5M',
    ingresosAnualesTrend: '+12.4% vs trim. anterior',
    pasajerosAnuales: '3.98M',
    pasajerosAnualesTrend: '+14.2% interanual',
    crecimientoAnual: '+15.8%',
    crecimientoAnualTrend: 'Supera el promedio nacional de CORPAC (+8.4%)',
    riesgosSummary: '1 Crítico, 2 Mitigados',
    activeRiesgosCount: 1,

    passengersList: [
      { month: 'ENE', year2023: 200000, year2024: 215000 },
      { month: 'FEB', year2023: 150000, year2024: 140000 },
      { month: 'MAR', year2023: 180000, year2024: 195000 },
      { month: 'ABR', year2023: 220000, year2024: 245000 },
      { month: 'MAY', year2023: 250000, year2024: 280000 },
      { month: 'JUN', year2023: 310000, year2024: 355000 },
      { month: 'JUL', year2023: 340000, year2024: 395000 },
      { month: 'AGO', year2023: 300000, year2024: 330000 },
      { month: 'SET', year2023: 240000, year2024: 275000 },
      { month: 'OCT', year2023: 230000, year2024: 255000 },
      { month: 'NOV', year2023: 210000, year2024: 220000 },
      { month: 'DIC', year2023: 230000, year2024: 260000 },
    ],

    quarterlyRevenue: [
      { quarter: 'Q1 2024', revenue: 31.2, margin: 48.5 },
      { quarter: 'Q2 2024', revenue: 38.5, margin: 52.1 },
      { quarter: 'Q3 2024', revenue: 47.8, margin: 58.4 },
      { quarter: 'Q4 2024', revenue: 31.0, margin: 49.0 },
    ],

    airlineShares: [
      { name: 'LATAM Airlines', share: 45.2, passCount: '1.79M pax', ebitdaPct: 55, health: 'Excelente' },
      { name: 'Sky Airline', share: 26.5, passCount: '1.05M pax', ebitdaPct: 24, health: 'Estable' },
      { name: 'JetSmart Perú', share: 15.3, passCount: '608K pax', ebitdaPct: 15, health: 'Excelente' },
      { name: 'Star Perú', share: 8.0, passCount: '318K pax', ebitdaPct: 4, health: 'Estable' },
      { name: 'Otros (Chárters/VIP)', share: 5.0, passCount: '199K pax', ebitdaPct: 2, health: 'Estable' },
    ],

    mainRoutes: [
      { name: 'Cusco - Lima (CUZ-LIM)', passengers: '3.1M', sharePct: 78.0, loadFactor: 91.2, status: 'Alta Rentabilidad' },
      { name: 'Cusco - Arequipa (CUZ-AQP)', passengers: '450K', sharePct: 11.3, loadFactor: 86.5, status: 'Estable' },
      { name: 'Cusco - Santiago (Directo CUZ-SCL)', passengers: '240K', sharePct: 6.0, loadFactor: 84.2, status: 'En Crecimiento' },
      { name: 'Cusco - Puerto Maldonado (CUZ-PEM)', passengers: '190K', sharePct: 4.7, loadFactor: 79.8, status: 'Estable' },
    ],

    financialKpis: [
      { label: 'EBITDA Operativo', value: '$72.5M USD', detail: 'Margen EBITDA del 48.8%, +3.1pp vs presupuesto', status: 'favorable' },
      { label: 'Ingresos No Aeronáuticos', value: '$34.2M USD', detail: 'Retail, Duty Free y Alquileres VIP representan 23% del total', status: 'favorable' },
      { label: 'Tasa TUA Promedio', value: '$31.80 USD', detail: 'Eficiencia de cobro del 99.8% vía check-in digital', status: 'favorable' },
      { label: 'Costo de Concesión CORPAC', value: '$18.4M USD', detail: 'Comisión reguladora estable según volumen contractual', status: 'estable' },
    ],

    historicYears: [
      { year: '2021', revenue: 78.5, margin: 31.2, passengers: 2.10 },
      { year: '2022', revenue: 104.2, margin: 38.4, passengers: 2.95 },
      { year: '2023', revenue: 128.6, margin: 44.1, passengers: 3.52 },
      { year: '2024 (Proy)', revenue: 148.5, margin: 48.8, passengers: 3.98 },
    ],

    risks: [
      {
        id: 'risk_1',
        name: 'Concentración / Dependencia Extrema de LATAM',
        description: 'LATAM controla el 45.2% de los pasajeros y genera más de la mitad del EBITDA directo del aeropuerto, dejándonos expuestos ante variaciones en su flota o reestructuraciones de rutas.',
        category: 'Dependencia de Aerolíneas',
        impact: 'Alto',
        probability: 'Media',
        state: 'Monitoreado',
        trend: 'Estable',
      },
      {
        id: 'risk_2',
        name: 'Saturación en Horas Pico en Sala de Embarque',
        description: 'La infraestructura física alcanza su límite de diseño entre las 11:00 AM y 01:00 PM. El cuello de botella en controles y accesos limita el gasto comercial y presiona los niveles de satisfacción del pasajero.',
        category: 'Saturación de Capacidad',
        impact: 'Crítico',
        probability: 'Alta',
        state: 'Activo',
        trend: 'Creciente',
      },
      {
        id: 'risk_3',
        name: 'Presión Cambiaria e Inflación de Insumos',
        description: 'El encarecimiento de repuestos e insumos de asfalto importados para mantenimiento rutinario de pista genera una leve presión de márgenes a largo plazo.',
        category: 'Riesgos Financieros',
        impact: 'Bajo',
        probability: 'Baja',
        state: 'Mitigado',
        trend: 'Decreciente',
      },
      {
        id: 'risk_4',
        name: 'Regulaciones de Capacidad de Carga de Vuelo Flotante',
        description: 'Potenciales cambios gubernamentales en las cuotas de visitas guiadas diarias al Santuario de Machu Picchu reducen instantáneamente los load factors de aerolíneas.',
        category: 'Riesgos de Mercado',
        impact: 'Crítico',
        probability: 'Media',
        state: 'Monitoreado',
        trend: 'Estable',
      },
    ],

    conclusiones: [
      {
        title: 'Liderazgo Consolidado de Rutas',
        description: 'La ruta troncal Cusco-Lima continúa siendo la principal columna económica y operacional con más de 3M de pasajeros.',
        category: 'Mercado',
        value: '78% Share',
      },
      {
        title: 'Desempeño EBITDA Excepcional',
        description: 'Márgenes de rentabilidad favorecidos notablemente por las tarifas comerciales y la consolidación de tarifas de estacionamiento reguladas.',
        category: 'Finanzas',
        value: '48.8% Margen',
      },
      {
        title: 'Riesgo Crítico de Cuello de Botella',
        description: 'La saturación física en salas de embarque limita el potencial del área comercial y pone en riesgo el cumplimiento de acuerdos de nivel de servicio (SLA).',
        category: 'Riesgos',
        value: 'Pico Máximo',
      },
    ],
  },
  
  mal_clima: {
    id: 'mal_clima',
    name: 'Escenario B: Temporada de Lluvias e Incertidumbre Operativa',
    badge: 'Desviación Operativa',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold',
    description: 'Periodo de alta estacionalidad por precipitaciones y nubosidad baja persistente en el umbral 28. Crecimiento de demanda moderado por reprogramaciones e incrementos imprevistos en costos de soporte a pasajeros desviados.',
    
    estadoGeneral: 'Bajo Monitoreo',
    estadoGeneralDesc: 'Gastos de contingencia y desvío de aeronaves erosionando el EBITDA mensual de Q1. Factor de ocupación de las aerolíneas se mantiene estable pero con reprogramaciones.',
    ingresosAnuales: '$128.6M',
    ingresosAnualesTrend: '-8.5% vs presupuesto proyectado',
    pasajerosAnuales: '3.42M',
    pasajerosAnualesTrend: '-3.2% vs año previo',
    crecimientoAnual: '+8.2%',
    crecimientoAnualTrend: 'Impacto directo por desvío estacional de 140 vuelos',
    riesgosSummary: '2 Críticos, 1 Activo, 1 Mitigado',
    activeRiesgosCount: 2,

    passengersList: [
      { month: 'ENE', year2023: 200000, year2024: 170000 },
      { month: 'FEB', year2023: 150000, year2024: 110000 },
      { month: 'MAR', year2023: 180000, year2024: 155000 },
      { month: 'ABR', year2023: 220000, year2024: 210000 },
      { month: 'MAY', year2023: 250000, year2024: 260000 },
      { month: 'JUN', year2023: 310000, year2024: 315000 },
      { month: 'JUL', year2023: 340000, year2024: 350000 },
      { month: 'AGO', year2023: 300000, year2024: 310000 },
      { month: 'SET', year2023: 240000, year2024: 245000 },
      { month: 'OCT', year2023: 230000, year2024: 240000 },
      { month: 'NOV', year2023: 210000, year2024: 195000 },
      { month: 'DIC', year2023: 230000, year2024: 210000 },
    ],

    quarterlyRevenue: [
      { quarter: 'Q1 2024', revenue: 24.1, margin: 38.2 },
      { quarter: 'Q2 2024', revenue: 32.2, margin: 43.5 },
      { quarter: 'Q3 2024', revenue: 41.5, margin: 51.0 },
      { quarter: 'Q4 2024', revenue: 30.8, margin: 41.2 },
    ],

    airlineShares: [
      { name: 'LATAM Airlines', share: 44.5, passCount: '1.52M pax', ebitdaPct: 53, health: 'Estable' },
      { name: 'Sky Airline', share: 28.2, passCount: '964K pax', ebitdaPct: 26, health: 'Excelente' },
      { name: 'JetSmart Perú', share: 14.8, passCount: '506K pax', ebitdaPct: 14, health: 'Estable' },
      { name: 'Star Perú', share: 8.5, passCount: '290K pax', ebitdaPct: 4, health: 'Bajo Alerta' },
      { name: 'Otros (Chárters/VIP)', share: 4.0, passCount: '136K pax', ebitdaPct: 3, health: 'Estable' },
    ],

    mainRoutes: [
      { name: 'Cusco - Lima (CUZ-LIM)', passengers: '2.68M', sharePct: 78.3, loadFactor: 83.5, status: 'Estable' },
      { name: 'Cusco - Arequipa (CUZ-AQP)', passengers: '380K', sharePct: 11.1, loadFactor: 79.4, status: 'Estable' },
      { name: 'Cusco - Santiago (Directo CUZ-SCL)', passengers: '190K', sharePct: 5.5, loadFactor: 75.8, status: 'Estable' },
      { name: 'Cusco - Puerto Maldonado (CUZ-PEM)', passengers: '170K', sharePct: 5.1, loadFactor: 71.2, status: 'Estable' },
    ],

    financialKpis: [
      { label: 'EBITDA Operativo', value: '$55.8M USD', detail: 'Margen baja al 42.1%, presionado por indemnizaciones y cuellos de botella', status: 'restringido' },
      { label: 'Ingresos No Aeronáuticos', value: '$26.4M USD', detail: 'Caída de consumo de retail por cancelaciones físicas de vuelos', status: 'estable' },
      { label: 'Tasa TUA Promedio', value: '$29.40 USD', detail: 'Devoluciones y compensaciones imprevistas restan $1.8M anuales', status: 'restringido' },
      { label: 'Costo por Vuelo Desviado', value: '$1.4M USD', detail: 'Soporte, alimentación terrestre y costos logísticos adicionales directos', status: 'restringido' },
    ],

    historicYears: [
      { year: '2021', revenue: 78.5, margin: 31.2, passengers: 2.10 },
      { year: '2022', revenue: 104.2, margin: 38.4, passengers: 2.95 },
      { year: '2023', revenue: 128.6, margin: 44.1, passengers: 3.52 },
      { year: '2024 (Proy)', revenue: 122.1, margin: 42.1, passengers: 3.42 },
    ],

    risks: [
      {
        id: 'risk_201',
        name: 'Estacionalidad Extrema y Costos de Compensaciones',
        description: 'La elevada tasa de cancelación invernal afecta las proyecciones anuales fijadas con los arrendatarios comerciales, quienes solicitan descuentos por disminución de tráfico.',
        category: 'Riesgos Financieros',
        impact: 'Alto',
        probability: 'Alta',
        state: 'Activo',
        trend: 'Creciente',
      },
      {
        id: 'risk_202',
        name: 'Saturación en Capacidad Terminal por Pasajeros Varados',
        description: 'Al suspenderse vuelos durante más de 6 horas, la densidad del terminal terrestre triplica su capacidad óptima de diseño, creando problemas de seguridad y un alto riesgo de reputación corporativa.',
        category: 'Saturación de Capacidad',
        impact: 'Crítico',
        probability: 'Alta',
        state: 'Activo',
        trend: 'Creciente',
      },
      {
        id: 'risk_203',
        name: 'Insolvencia Financiera en Operadoras Regionales',
        description: 'Aerolíneas de menor envergadura, como Star Perú, experimentan fuertes pérdidas por demoras recurrentes, elevando el riesgo corporativo de default en los cobros de tasas de rampa.',
        category: 'Dependencia de Aerolíneas',
        impact: 'Medio',
        probability: 'Media',
        state: 'Monitoreado',
        trend: 'Estable',
      },
      {
        id: 'risk_204',
        name: 'Migración a Destinos Alternativos',
        description: 'A nivel regional, la inestabilidad de aterrizaje en Cusco durante febrero impulsa a agencias a desviar contingentes de turistas directamente hacia Arequipa o Puno sin pasar por Cusco.',
        category: 'Riesgos de Mercado',
        impact: 'Alto',
        probability: 'Media',
        state: 'Monitoreado',
        trend: 'Estable',
      },
    ],

    conclusiones: [
      {
        title: 'Estacionalidad de Facturación',
        description: 'El primer trimestre se consolida históricamente como el de menor rentabilidad debido a factores climáticos y estacionales.',
        category: 'Finanzas',
        value: 'Q1 -20% Rev',
      },
      {
        title: 'Resiliencia de Flota Satelital',
        description: 'Sky Airline mitiga demoras climáticas operando Airbus con aviónica RNP-AR de aproximaciones por satélite.',
        category: 'Mercado',
        value: 'Resiliencia Sky',
      },
      {
        title: 'Necesidad de Habilitar Terminal de Contingencia',
        description: 'Se requiere un plan de contingencia multicanal para reubicaciones turísticas físicas y evitar sobrepasar la capacidad de salas.',
        category: 'Infraestructura',
        value: '300% Satura',
      },
    ],
  },
  
  mantenimiento_pista: {
    id: 'mantenimiento_pista',
    name: 'Escenario C: Período de Reinversión de Infraestructura y Bacheo',
    badge: 'Mantenimiento Activo',
    badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    description: 'Cierre diario programado de 3 horas para la rehabilitación asfáltica en cabecera de pista 10. Reducción temporal de capacidad comercial de slots coordinada con las aerolíneas líderes.',
    
    estadoGeneral: 'Estable',
    estadoGeneralDesc: 'Operaciones comerciales impactadas de forma controlada. Estrategia de consolidación de fuselaje ancho para mitigar la menor frecuencia diaria.',
    ingresosAnuales: '$131.4M',
    ingresosAnualesTrend: '-2.1% debido a menor volumen de despegues',
    pasajerosAnuales: '3.62M',
    pasajerosAnualesTrend: '-3.2% vs proyección base',
    crecimientoAnual: '+10.4%',
    crecimientoAnualTrend: 'Crecimiento atenuado temporalmente por las obras físicas',
    riesgosSummary: '1 Crítico, 3 Monitoreados',
    activeRiesgosCount: 1,

    passengersList: [
      { month: 'ENE', year2023: 200000, year2024: 195000 },
      { month: 'FEB', year2023: 150000, year2024: 130000 },
      { month: 'MAR', year2023: 180000, year2024: 185000 },
      { month: 'ABR', year2023: 220000, year2024: 215000 },
      { month: 'MAY', year2023: 250000, year2024: 245000 },
      { month: 'JUN', year2023: 310000, year2024: 290000 },
      { month: 'JUL', year2023: 320000, year2024: 320000 },
      { month: 'AGO', year2023: 300000, year2024: 295000 },
      { month: 'SET', year2023: 240000, year2024: 255000 },
      { month: 'OCT', year2023: 230000, year2024: 250000 },
      { month: 'NOV', year2023: 210000, year2024: 225000 },
      { month: 'DIC', year2023: 230000, year2024: 245000 },
    ],

    quarterlyRevenue: [
      { quarter: 'Q1 2024', revenue: 29.5, margin: 44.5 },
      { quarter: 'Q2 2024', revenue: 31.8, margin: 45.2 },
      { quarter: 'Q3 2024', revenue: 40.0, margin: 41.5 }, // Maintenance period Q3
      { quarter: 'Q4 2024', revenue: 30.1, margin: 45.8 },
    ],

    airlineShares: [
      { name: 'LATAM Airlines', share: 41.0, passCount: '1.48M pax', ebitdaPct: 50, health: 'Estable' },
      { name: 'Sky Airline', share: 25.0, passCount: '905K pax', ebitdaPct: 22, health: 'Estable' },
      { name: 'JetSmart Perú', share: 15.0, passCount: '543K pax', ebitdaPct: 15, health: 'Excelente' },
      { name: 'Star Perú', share: 11.0, passCount: '398K pax', ebitdaPct: 8, health: 'Estable' },
      { name: 'Otros (Chárters/VIP)', share: 8.0, passCount: '290K pax', ebitdaPct: 5, health: 'Estable' },
    ],

    mainRoutes: [
      { name: 'Cusco - Lima (CUZ-LIM)', passengers: '2.93M', sharePct: 81.0, loadFactor: 94.5, status: 'Alta Rentabilidad' },
      { name: 'Cusco - Arequipa (CUZ-AQP)', passengers: '360K', sharePct: 10.0, loadFactor: 82.3, status: 'Estable' },
      { name: 'Cusco - Santiago (Directo CUZ-SCL)', passengers: '180K', sharePct: 5.0, loadFactor: 80.1, status: 'En Crecimiento' },
      { name: 'Cusco - Puerto Maldonado (CUZ-PEM)', passengers: '150K', sharePct: 4.1, loadFactor: 76.5, status: 'Estable' },
    ],

    financialKpis: [
      { label: 'Capex Comprometido', value: '$12.5M USD', detail: 'Reasfaltado estructural completo, financiado con fondos de reserva', status: 'estable' },
      { label: 'EBITDA Operativo', value: '$58.2M USD', detail: 'Margen EBITDA del 44.3%, amortiguado por mayor rentabilidad de chárters', status: 'estable' },
      { label: 'Ingresos por Tasa de Aterrizaje', value: '$14.2M USD', detail: 'Descenso temporal del 8% en facturación de tasas de aterrizajes', status: 'restringido' },
      { label: 'Rendimiento de Obras Pistas', value: '45% Ejecución', detail: 'Desviación temporal de cronograma de 4 días por lluvias ligeras', status: 'estable' },
    ],

    historicYears: [
      { year: '2021', revenue: 78.5, margin: 31.2, passengers: 2.10 },
      { year: '2022', revenue: 104.2, margin: 38.4, passengers: 2.95 },
      { year: '2023', revenue: 128.6, margin: 44.1, passengers: 3.52 },
      { year: '2024 (Proy)', revenue: 131.4, margin: 44.3, passengers: 3.62 },
    ],

    risks: [
      {
        id: 'risk_301',
        name: 'Congestión Recurrente tras Reapertura Diaria de Pista',
        description: 'La suspensión diaria de 3 horas concentra los aterrizajes comerciales en ventanas horarias muy estrechas. Esto genera picos de fatiga operacional y demoras acumulativas de vuelo hacia el fin del día.',
        category: 'Saturación de Capacidad',
        impact: 'Crítico',
        probability: 'Alta',
        state: 'Activo',
        trend: 'Creciente',
      },
      {
        id: 'risk_302',
        name: 'Deslizamiento Financiero de Costos de Obra (CAPEX)',
        description: 'La fluctuación internacional en el costo del asfalto asfáltico modificado por polímeros puede causar un sobrecosto no previsto de hasta 15% sobre el presupuesto de inversión inicial.',
        category: 'Riesgos Financieros',
        impact: 'Medio',
        probability: 'Media',
        state: 'Monitoreado',
        trend: 'Estable',
      },
      {
        id: 'risk_303',
        name: 'Multas Reguladoras de la DGAC',
        description: 'Si las ventanas diarias de mantenimiento se extienden más allá de las 16:00 PM, el aeropuerto enfrenta multas por violar las reservas de espacio aéreo notificadas vía NOTAM.',
        category: 'Riesgos de Mercado',
        impact: 'Alto',
        probability: 'Baja',
        state: 'Mitigado',
        trend: 'Estable',
      },
      {
        id: 'risk_304',
        name: 'Reducción de Ocupación por Consolidación Defectuosa',
        description: 'Riesgo de que las aerolíneas aliadas no logren consolidar de manera eficiente sus vuelos, resultando en pérdidas de ingresos TUA no compensadas.',
        category: 'Riesgos de Crecimiento',
        impact: 'Medio',
        probability: 'Media',
        state: 'Monitoreado',
        trend: 'Estable',
      },
    ],

    conclusiones: [
      {
        title: 'Garantía de Vida Útil de Pista',
        description: 'Las inversiones de Capex aseguran la prolongación de la operatividad vial y el despegue seguro durante 5 años adicionales.',
        category: 'Infraestructura',
        value: '+5 Años Vida',
      },
      {
        title: 'Estabilidad Financiera de Reservas',
        description: 'Obras autofinanciadas mediante depósitos devengados del Fideicomiso Comercial del aeropuerto sin recurrir a deuda externa.',
        category: 'Finanzas',
        value: 'Estructura Robusta',
      },
      {
        title: 'Control de Ventanas de Slots',
        description: 'Negociaciones fructíferas con CORPAC mantienen los niveles mínimos de servicio operacional estipulados por contrato.',
        category: 'Directorio',
        value: 'NOTAM Respetado',
      },
    ],
  },
};

export default SCENARIOS;
