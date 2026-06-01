import React, { useState } from 'react';
import { Terminal, Copy, Check, Search, Library, Sparkles, Filter, ChevronRight, CornerDownRight } from 'lucide-react';

interface AlertRouteConfig {
  prompt: string;
  sql: string;
  linq: string;
  insights: string;
  resultHeaders: string[];
  resultRows: Record<string, string | number>[];
}

const PRESET_QUERIES: Record<string, AlertRouteConfig> = {
  vuelos_retrasados: {
    prompt: 'Obtener vuelos demorados y sus aerolíneas asociadas',
    sql: `SELECT V.Numero_Vuelo, A.Nombre_AeroLineae, V.Hora_Salida, V.Estado, V.Puerta_Embarque
FROM Vuelo V
INNER JOIN Aerolinea A ON V.ID_Aerolinea = A.ID_Aerolinea
WHERE V.Estado = 'Retrasado';`,
    linq: `var vuelosRetrasados = _context.Vuelos
    .Where(v => v.Estado == "Retrasado")
    .Join(_context.Aerolineas, 
          v => v.ID_Aerolinea, 
          al => al.ID_Aerolinea, 
          (v, al) => new { 
              v.Numero_Vuelo, 
              Aerolinea = al.Nombre_AeroLineae, 
              v.Hora_Salida, 
              v.Estado 
          })
    .ToList();`,
    insights: 'En el Aeropuerto Velasco Astete (SPZO), los retrasos matutinos son atribuidos principalmente a la niebla de cuenca andina, mientras que por la tarde se asocian con vientos cruzados de cola que exceden los 10 nudos.',
    resultHeaders: ['Vuelo', 'Aerolínea', 'Hora', 'Estado', 'Puerta'],
    resultRows: [
      { Vuelo: 'JA4012', Aerolínea: 'JetSMART Perú', Hora: '11:00', Estado: 'Retrasado', Puerta: '03' }
    ]
  },
  equipaje_sobrepeso: {
    prompt: 'Buscar pasajeros con maletas que superan los 23 Kg reglamentarios',
    sql: `SELECT P.Nombre, P.Apellido, E.Peso_KG, V.Numero_Vuelo, E.Estado AS Equipaje_Estado
FROM Equipaje E
INNER JOIN Pasajero P ON E.ID_Pasajero = P.ID_Pasajero
INNER JOIN Vuelo V ON E.ID_Vuelo = V.ID_Vuelo
WHERE E.Peso_KG > 23.0;`,
    linq: `var equipajeExceso = _context.Equipajes
    .Where(e => e.Peso_KG > 23.0f)
    .Select(e => new {
        Pasajero = e.Pasajero.Nombre + " " + e.Pasajero.Apellido,
        e.Peso_KG,
        e.Vuelo.Numero_Vuelo,
        Estatus = e.Estado
    })
    .ToList();`,
    insights: 'Debido a la altitud extrema (3,400 metros) y la baja densidad de la atmósfera de Cusco, las naves comerciales restringen estrictamente el peso del equipaje en bodega para garantizar la tasa de ascenso mínima admisible.',
    resultHeaders: ['Pasajero', 'Peso maleta', 'Vuelo', 'Estatus'],
    resultRows: [
      { Pasajero: 'Alejandro Poma', 'Peso maleta': '23.5 Kg', Vuelo: 'LA2021', Estatus: 'Entregado' },
      { Pasajero: 'Carlos Vargas', 'Peso maleta': '24.1 Kg', Vuelo: 'LA2154', Estatus: 'En Tránsito' }
    ]
  },
  pasajeros_premium: {
    prompt: 'Listar boletos de primera clase y ejecutiva de vuelos activos',
    sql: `SELECT T.Asiento, T.Clase, T.Precio, P.Nombre, P.Apellido, V.Numero_Vuelo
FROM Ticket T
INNER JOIN Pasajero P ON T.ID_Pasajero = P.ID_Pasajero
INNER JOIN Vuelo V ON T.ID_Vuelo = V.ID_Vuelo
WHERE T.Clase IN ('Primera', 'Ejecutiva');`,
    linq: `var boletosPremium = _context.Tickets
    .Where(t => t.Clase == "Primera" || t.Clase == "Ejecutiva")
    .Select(t => new {
        t.Asiento,
        t.Clase,
        PrecioUSD = t.Precio,
        Pasajero = t.Pasajero.Nombre + " " + t.Pasajero.Apellido,
        vueloNo = t.Vuelo.Numero_Vuelo
    })
    .ToList();`,
    insights: 'Los tickets de primera clase con destino Cusco tienen alta demanda turística internacional. Las aerolíneas calibran el peso base de combustible versus la capacidad ejecutiva según las ventanas de viento.',
    resultHeaders: ['Asiento', 'Clase', 'Precio', 'Pasajero', 'Vuelo'],
    resultRows: [
      { Asiento: '03C', Clase: 'Ejecutiva', Precio: 'USD 350.00', Pasajero: 'John Miller', Vuelo: 'LA2021' },
      { Asiento: '02B', Clase: 'Primera', Precio: 'USD 550.00', Pasajero: 'Sophie Dubois', Vuelo: 'JA4012' }
    ]
  },
  flota_mantenimiento: {
    prompt: 'Auditoría de aeronaves fuera de rango operativo o revisión',
    sql: `SELECT M.Modelo, M.Aerolinea_Propietaria, M.Capacidad_Pasajeros, M.Estado_Mantenimiento
FROM Avion M
WHERE M.Estado_Mantenimiento != 'Operativo';`,
    linq: `var navesMantenimiento = _context.Aviones
    .Where(a => a.Estado_Mantenimiento != "Operativo")
    .ToList();`,
    insights: 'Las pendientes andinas que rodean el cañón de aproximación visual (VFR) en Cusco demandan precisión en flaps y reversores de empuje hidráulico, limitando operaciones si hay naves bajo sospecha de fatiga.',
    resultHeaders: ['Modelo', 'Propietaria', 'Capacidad', 'Estado Mantenimiento'],
    resultRows: [
      { Modelo: 'Boeing 737-800', Propietaria: 'Star Perú', Capacidad: '162 Pax', 'Estado Mantenimiento': 'Revisión Necesaria' },
      { Modelo: 'Airbus A320neo', Propietaria: 'JetSMART Perú', Capacidad: '186 Pax', 'Estado Mantenimiento': 'En Mantenimiento' }
    ]
  }
};

export default function Queries() {
  const [selectedKey, setSelectedKey] = useState<string>('vuelos_retrasados');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [copiedTab, setCopiedTab] = useState<'sql' | 'linq' | null>(null);
  const [activeQueryTab, setActiveQueryTab] = useState<'sql' | 'linq' | 'insights'>('sql');

  // Interactive dynamic translation generator
  const [dynamicResult, setDynamicResult] = useState<AlertRouteConfig | null>(null);

  const handleCopy = (text: string, type: 'sql' | 'linq') => {
    navigator.clipboard.writeText(text);
    setCopiedTab(type);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const handleTranslateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    const lower = customPrompt.toLowerCase();
    
    // Parse the string and generate a tailored response!
    let sqlQuery = '';
    let linqQuery = '';
    let categoryInsights = '';
    let headers: string[] = [];
    let rows: Record<string, string | number>[] = [];

    if (lower.includes('latam') || lower.includes('sky') || lower.includes('perú')) {
      const aerolineaFiltro = lower.includes('latam') ? 'LATAM Perú' : lower.includes('sky') ? 'Sky Airline Perú' : 'Aerolíneas Locales';
      sqlQuery = `SELECT AE.Nombre_AeroLineae, AE.Pais, V.Numero_Vuelo, V.Estado
FROM Aerolinea AE
INNER JOIN Vuelo V ON AE.ID_Aerolinea = V.ID_Aerolinea
WHERE AE.Nombre_AeroLineae LIKE '%${lower.includes('latam') ? 'LATAM' : 'Sky'}%';`;

      linqQuery = `var query = _context.Aerolineas
    .Where(a => a.Nombre_AeroLineae.Contains("${lower.includes('latam') ? 'LATAM' : 'Sky'}"))
    .SelectMany(a => a.Vuelos, (a, v) => new {
        a.Nombre_AeroLineae,
        v.Numero_Vuelo,
        v.Estado
    })
    .ToList();`;

      categoryInsights = `Inspección de las asignaciones de slots aéreos para ${aerolineaFiltro} en Cusco. Los despachadores aéreos optimizan el empuje de turbina para el ascenso empinado saliendo de la quebrada rumbo a Lima.`;
      headers = ['Aerolínea', 'País', 'Vuelo Nro', 'Estado'];
      rows = [
        { 'Aerolínea': aerolineaFiltro, 'País': 'Perú', 'Vuelo Nro': lower.includes('latam') ? 'LA2021' : 'H23015', 'Estado': 'A tiempo' },
        { 'Aerolínea': aerolineaFiltro, 'País': 'Perú', 'Vuelo Nro': lower.includes('latam') ? 'LA2035' : 'H23015', 'Estado': 'En aproximación' }
      ];
    } else if (lower.includes('equipaje') || lower.includes('maleta') || lower.includes('peso') || lower.includes('kg')) {
      const weightKgs = lower.match(/\d+/) ? lower.match(/\d+/)![0] : '20';
      sqlQuery = `SELECT E.ID_Equipaje, P.Nombre, P.Apellido, E.Peso_KG, E.Estado
FROM Equipaje E
INNER JOIN Pasajero P ON E.ID_Pasajero = P.ID_Pasajero
WHERE E.Peso_KG > ${weightKgs}.0;`;

      linqQuery = `var query = _context.Equipajes
    .Where(e => e.Peso_KG > ${weightKgs}.0f)
    .Select(e => new {
        e.ID_Equipaje,
        NombrePasajero = e.Pasajero.Nombre + " " + e.Pasajero.Apellido,
        e.Peso_KG,
        EstadoEquipaje = e.Estado
    }).ToList();`;

      categoryInsights = `Filtro dinámico de bodegas para equipajes con umbral mayor a ${weightKgs} Kg. Las balanzas automáticas del counters de Cusco alertan cargos extras si supera el peso estipulado para evitar sobrecalentamientos en despegues empinados.`;
      headers = ['Báscula ID', 'Pasajero', 'Peso', 'Estatus'];
      rows = [
        { 'Báscula ID': '103', 'Pasajero': 'María Elena Quiroga', 'Peso': '21.8 Kg', 'Estatus': 'Registrado' },
        { 'Báscula ID': '105', 'Pasajero': 'Carlos Vargas', 'Peso': '24.1 Kg', 'Estatus': 'Retenido por báscula' }
      ];
    } else if (lower.includes('empleado') || lower.includes('personal') || lower.includes('puesto')) {
      sqlQuery = `SELECT Nombre, Apellido, Puesto, Turno 
FROM Empleado 
WHERE Turno = 'Mañana';`;

      linqQuery = `var personalCusco = _context.Empleados
    .Where(emp => emp.Turno == "Mañana")
    .Select(emp => new { emp.Nombre, emp.Apellido, emp.Puesto })
    .ToList();`;

      categoryInsights = 'El personal de rampa, oficiales de abordaje y supervisores de Cusco asumen sus operaciones a partir de las 05:00 AM para recibir la primera oleada de vuelos salientes de Lima.';
      headers = ['Colaborador', 'Cargo', 'Turno'];
      rows = [
        { 'Colaborador': 'Jorge Chávez Jr', 'Cargo': 'Supervisor de Tráfico Aéreo', 'Turno': 'Mañana' },
        { 'Colaborador': 'Carmen Díaz', 'Cargo': 'Atención al Cliente', 'Turno': 'Mañana' }
      ];
    } else {
      // General fall-back matching the schema smartly!
      sqlQuery = `SELECT V.Numero_Vuelo, A.Nombre_Aero, V.Hora_Salida, V.Estado
FROM Vuelo V
INNER JOIN Aeropuerto A ON V.ID_Aeropuerto_Destino = A.ID_Aeropuerto
WHERE A.Codigo_IATA = 'CUZ';`;

      linqQuery = `var query = _context.Vuelos
    .Where(v => v.AeropuertoDestino.Codigo_IATA == "CUZ")
    .Select(v => new {
        v.Numero_Vuelo,
        Origen = v.AeropuertoOrigen.Nombre_Aero,
        v.Hora_Salida,
        v.Estado
    }).ToList();`;

      categoryInsights = 'Consulta general proyectada para Alejandro Velasco Astete de Cusco. Unifica itinerarios coordinando la sustentación en pista andina.';
      headers = ['Vuelo', 'Aero Origen', 'Hora', 'Estado'];
      rows = [
        { 'Vuelo': 'LA2021', 'Aero Origen': 'Jorge Chávez (Lima)', 'Hora': '08:30', 'Estado': 'Aterrizado' },
        { 'Vuelo': '2I1102', 'Aero Origen': 'Jorge Chávez (Lima)', 'Hora': '14:20', 'Estado': 'A tiempo' }
      ];
    }

    setDynamicResult({
      prompt: customPrompt,
      sql: sqlQuery,
      linq: linqQuery,
      insights: categoryInsights,
      resultHeaders: headers,
      resultRows: rows
    });

    // Automatically highlight the SQL tab
    setActiveQueryTab('sql');
  };

  const getActiveData = (): AlertRouteConfig => {
    if (dynamicResult) return dynamicResult;
    return PRESET_QUERIES[selectedKey] || PRESET_QUERIES['vuelos_retrasados'];
  };

  const activeData = getActiveData();

  return (
    <section className="py-20 px-6 md:px-12 bg-[#F4F1EE] text-[#121212]" id="queries">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Title */}
        <div className="text-center mb-16 max-w-xl mx-auto space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C05D38] block">
            Diccionario de Traducción de Datos
          </span>
          <h2 className="font-serif text-3xl md:text-4xl italic font-light text-[#121212] tracking-tight">
            Consultas Inteligentes & LINQ
          </h2>
          <p className="font-sans text-sm text-[#121212]/70 leading-relaxed pt-2 border-t border-black/5">
            Analice código nativo SQL Server y queries LINQ en C#. Seleccione una plantilla predeterminada o redacte un enunciado en lenguaje humano para evaluar la lógica relacional.
          </p>
        </div>

        {/* Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left Panel: Query Library Presets */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-black/10">
              <Library className="w-4 h-4 text-[#C05D38]" />
              <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-black/50">
                Librería de Casos Comunes
              </span>
            </div>

            {Object.entries(PRESET_QUERIES).map(([key, item]) => {
              const belongs = selectedKey === key && !dynamicResult;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedKey(key);
                    setDynamicResult(null); // Clear custom result
                    setActiveQueryTab('sql');
                  }}
                  className={`w-full text-left p-5 transition-all duration-300 border rounded-none flex items-start gap-4 ${
                    belongs 
                      ? 'border-[#C05D38] bg-white shadow-sm' 
                      : 'border-black/5 bg-white/60 hover:bg-white hover:border-black/20'
                  }`}
                  id={`preset_query_${key}`}
                >
                  <span className={`p-2 border rounded-none text-xs font-mono font-bold flex-shrink-0 ${
                    belongs ? 'bg-[#121212] text-white border-black' : 'bg-[#E5E2DE] text-[#121212] border-black/10'
                  }`}>
                    {key.toUpperCase().slice(0, 3)}
                  </span>
                  <div className="space-y-1">
                    <h4 className={`font-serif font-bold text-sm ${belongs ? 'text-[#C05D38]' : 'text-black'}`}>
                      {item.prompt}
                    </h4>
                    <p className="font-sans text-[10px] text-black/40 uppercase tracking-tight font-semibold">
                      Campos: {item.resultHeaders.slice(0, 3).join(', ')}...
                    </p>
                  </div>
                </button>
              );
            })}

            {/* Simulated Live prompt input box */}
            <form onSubmit={handleTranslateCustom} className="p-5 bg-white border border-black/10 rounded-none shadow-sm space-y-3 mt-6">
              <div className="flex justify-between items-center pb-2 border-b border-black/5">
                <span className="font-sans text-[9px] font-bold uppercase tracking-wider text-[#C05D38] flex items-center gap-1.5Packed">
                  <Sparkles className="w-3.5 h-3.5" /> Traductor Inteligente
                </span>
                <span className="font-sans text-[8px] font-semibold text-black/30 uppercase">Local Parser</span>
              </div>
              
              <label className="block text-[10px] font-sans text-black/60 leading-relaxed">
                Escriba una instrucción en lenguaje natural para deducir el esquema relacionable de Cusco:
              </label>

              <div className="relative">
                <input 
                  type="text" 
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Ej: Equipajes pesados mayores a 20 Kg..." 
                  className="w-full bg-[#F4F1EE] text-[#121212] font-sans text-xs border border-black/10 rounded-none px-3.5 py-2.5 focus:border-[#C05D38] outline-none"
                  id="query_natural_input"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-[#121212] text-white font-sans font-bold text-[10px] tracking-widest uppercase hover:bg-[#C05D38] transition-colors"
                id="query_btn_execute_natural"
              >
                TRADUCIR A T-SQL / LINQ
              </button>
            </form>
          </div>

          {/* Right Panel: Output Tabs & Live Executions */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
            
            {/* Visualizer header tabs */}
            <div className="border border-black/10 bg-white shadow-sm p-6 rounded-none">
              
              {/* Input trace display if custom */}
              {dynamicResult && (
                <div className="mb-4 p-3 bg-[#C05D38]/5 border border-[#C05D38]/20 flex items-center justify-between text-xs">
                  <span className="font-sans text-black/70 italic">
                    Prompt traducido: <strong>"{activeData.prompt}"</strong>
                  </span>
                  <button 
                    onClick={() => {
                      setDynamicResult(null);
                      setSelectedKey('vuelos_retrasados');
                    }}
                    className="font-mono text-[9px] text-[#C05D38] underline uppercase font-bold"
                  >
                    Restablecer
                  </button>
                </div>
              )}

              {/* Tab Selector bar */}
              <div className="flex border-b border-black/10">
                <button
                  onClick={() => setActiveQueryTab('sql')}
                  className={`pb-4 px-6 font-sans text-xs font-bold uppercase tracking-widest transition-all ${
                    activeQueryTab === 'sql' 
                      ? 'border-b-2 border-[#C05D38] text-[#C05D38]' 
                      : 'text-black/50 hover:text-black'
                  }`}
                  id="query_tab_btn_sql"
                >
                  Transact-SQL
                </button>
                <button
                  onClick={() => setActiveQueryTab('linq')}
                  className={`pb-4 px-6 font-sans text-xs font-bold uppercase tracking-widest transition-all ${
                    activeQueryTab === 'linq' 
                      ? 'border-b-2 border-[#C05D38] text-[#C05D38]' 
                      : 'text-black/50 hover:text-black'
                  }`}
                  id="query_tab_btn_linq"
                >
                  C# LINQ (.NET)
                </button>
                <button
                  onClick={() => setActiveQueryTab('insights')}
                  className={`pb-4 px-6 font-sans text-xs font-bold uppercase tracking-widest transition-all ${
                    activeQueryTab === 'insights' 
                      ? 'border-b-2 border-[#C05D38] text-[#C05D38]' 
                      : 'text-black/50 hover:text-black'
                  }`}
                  id="query_tab_btn_insights"
                >
                  Contexto Cusco (SPZO)
                </button>
              </div>

              {/* Code visual rendering box */}
              <div className="mt-6">
                {activeQueryTab === 'sql' && (
                  <div className="relative">
                    <button 
                      onClick={() => handleCopy(activeData.sql, 'sql')}
                      className="absolute top-2 right-2 p-2 bg-white border border-black/10 hover:bg-[#F4F1EE] text-black transition-colors"
                      title="Copiar código SQL"
                      id="btn_copy_sql"
                    >
                      {copiedTab === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <pre className="p-4 bg-[#F4F1EE] rounded-none text-xs font-mono text-black overflow-x-auto leading-relaxed border border-black/5">
                      <code>{activeData.sql}</code>
                    </pre>
                  </div>
                )}

                {activeQueryTab === 'linq' && (
                  <div className="relative">
                    <button 
                      onClick={() => handleCopy(activeData.linq, 'linq')}
                      className="absolute top-2 right-2 p-2 bg-white border border-black/10 hover:bg-[#F4F1EE] text-black transition-colors"
                      title="Copiar código LINQ"
                      id="btn_copy_linq"
                    >
                      {copiedTab === 'linq' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <pre className="p-4 bg-[#F4F1EE] rounded-none text-xs font-mono text-black overflow-x-auto leading-relaxed border border-black/5">
                      <code>{activeData.linq}</code>
                    </pre>
                  </div>
                )}

                {activeQueryTab === 'insights' && (
                  <div className="p-5 bg-amber-50/50 border border-[#C05D38]/15 text-xs text-[#121212]/80 leading-relaxed font-sans">
                    <h5 className="font-serif italic text-sm font-bold text-[#C05D38] mb-2">Particularidades Operacionales Andinas</h5>
                    <p>{activeData.insights}</p>
                    <div className="mt-4 pt-3 border-t border-black/5 text-[10px] uppercase font-bold text-black/50 tracking-wide">
                      Métrica de Seguridad: Gradiente de Ascenso Min: 5.4%
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Live Data Simulation results based on queried row sets */}
            <div className="border border-black/10 bg-white p-6 rounded-none shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-black/15">
                <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-[#C05D38]" /> Respuesta del Servidor (Datos Simulados)
                </span>
                <span className="font-mono text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                  ESTADO 200 OK — TRANSACCIÓN COMPLETADA
                </span>
              </div>

              {/* Simulated execution rows */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-black/10 text-black/40 font-sans uppercase text-[10px] font-bold tracking-wider">
                      {activeData.resultHeaders.map((header) => (
                        <th key={header} className="pb-3.5 pt-1 px-2 font-bold">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeData.resultRows.map((row, idx) => (
                      <tr key={idx} className="border-b border-black/5 last:border-0 hover:bg-[#F4F1EE]/50 transition-colors">
                        {activeData.resultHeaders.map((header) => (
                          <td key={header} className="py-3 px-2 font-sans font-medium text-black">
                            {row[header]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
