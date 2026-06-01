import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '') {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return aiClient;
}

// 1. Endpoint lists status of Gemini integration
app.get('/api/aero-status', (req, res) => {
  const customKeySet = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' && process.env.GEMINI_API_KEY.trim() !== '');
  res.json({
    appName: 'AeroQuery Cusco Command Center',
    version: '1.0.0',
    geminiActive: customKeySet,
    message: customKeySet 
      ? 'Inteligencia de consulta conectada a Gemini v3.5-flash.' 
      : 'Asistente de Inteligencia operando en modo local. (Configure GEMINI_API_KEY en Secrets para habilitar consultas libres).'
  });
});

// 2. Intelligent SQL & LINQ Generator via Gemini v3.5-flash
app.post('/api/gemini/query', async (req, res) => {
  const { question, currentTable } = req.body;
  
  if (!question) {
    return res.status(400).json({ error: 'La pregunta o consulta es requerida.' });
  }

  const ai = getGeminiClient();

  if (!ai) {
    // Elegant system-driven fallback simulation so the application works even without an API key
    return res.json(simulateLocalSmartResponse(question, currentTable));
  }

  try {
    const systemPrompt = `
      Eres el motor inteligente de base de datos "AeroQuery Cusco AI Assistant", un administrador experto de bases de datos relacionales en SQL Server y Entity Framework Core (EF Core) para el Aeropuerto Internacional Alejandro Velasco Astete de Cusco.
      
      Tenemos un esquema relacional con las siguientes 9 entidades:
      1. Aeropuerto: ID_Aeropuerto (PK), Nombre_Aero, Ciudad, Codigo_IATA
      2. Aerolinea: ID_Aerolinea (PK), Nombre_AeroLineae, Pais, Codigo_IATA
      3. Vuelo: ID_Vuelo (PK), Numero_Vuelo, ID_Aeropuerto_Origen (FK), ID_Aeropuerto_Destino (FK), ID_Aerolinea (FK), ID_Avion (FK), Hora_Salida, Hora_Llegada, Estado ('A tiempo', 'Retrasado', 'Abordando', 'Cancelado', 'Aterrizado'), Puerta_Embarque
      4. Ruta: ID_Ruta (PK), ID_Aeropuerto_Origen (FK), ID_Aeropuerto_Destino (FK), Distancia_Millas, Tiempo_Estimado_Minutos
      5. Pasajero: ID_Pasajero (PK), Nombre, Apellido, Nacionalidad, Nro_Pasaporte, Fecha_Nacimiento
      6. Equipaje: ID_Equipaje (PK), ID_Pasajero (FK), ID_Vuelo (FK), Peso_KG, Color, Estado ('Registrado', 'En Tránsito', 'Entregado', 'Retenido')
      7. Empleado: ID_Empleado (PK), Nombre, Apellido, Puesto, Turno ('Mañana', 'Tarde', 'Noche'), ID_Aeropuerto (FK)
      8. Avion: ID_Avion (PK), Modelo, Capacidad_Pasajeros, Aerolinea_Propietaria, Estado_Mantenimiento ('Operativo', 'En Mantenimiento', 'Revisión Necesaria')
      9. Ticket: ID_Ticket (PK), ID_Pasajero (FK), ID_Vuelo (FK), Asiento, Clase ('Económica', 'Ejecutiva', 'Primera'), Precio
      
      Dada la siguiente pregunta o requerimiento del usuario respecto a cómo consultar o analizar estos datos de forma aeroportuaria: "${question}" (Tabla sugerida de contexto: "${currentTable || 'Vuelo'}"), genera un objeto JSON con las siguientes llaves estrictas:
      1. "sql": La consulta SQL (T-SQL estandarizado para SQL Server) correspondiente que une las tablas necesarias y extrae la información requerida. Debe ser sintácticamente correcta e impecable.
      2. "linq": El código C# utilizando Entity Framework Core (EF Core) y LINQ para ejecutar la misma consulta contra el DbContext cargado con estas entidades.
      3. "explanation": Explicación detallada en español de la consulta relacional, qué tablas se están uniendo (INNER JOINs), qué filtros se aplican, y por qué se estructuró así.
      4. "insights": Comentarios operativos específicos para la realidad del Cusco. En Cusco, el aeropuerto Alejandro Velasco Astete tiene restricciones de altitud extrema (3,400 msnm), vuelos comerciales limitados a luz natural, constantes flujos de turistas extranjeros hacia Machu Picchu, y la presencia crítica de equipaje pesado por senderismo/trekking. Relaciona la consulta con estas condiciones operativas reales de Cusco.
      
      Entrega únicamente el JSON plano listo para parsear, sin rodeos de markdown \`\`\`json o texto adicional.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: question,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['sql', 'explanation', 'linq', 'insights'],
          properties: {
            sql: { type: Type.STRING },
            linq: { type: Type.STRING },
            explanation: { type: Type.STRING },
            insights: { type: Type.STRING }
          }
        }
      }
    });

    const parsedJson = JSON.parse(response.text || '{}');
    return res.json(parsedJson);

  } catch (error: any) {
    console.error('Gemini query processing error:', error);
    return res.status(500).json({
      error: 'Error al procesar la inteligencia con Gemini.',
      details: error.message,
      fallback: simulateLocalSmartResponse(question, currentTable)
    });
  }
});

function simulateLocalSmartResponse(question: string, currentTable?: string) {
  const norm = question.toLowerCase();
  
  if (norm.includes('ingreso') || norm.includes('rentabil') || norm.includes('precio') || norm.includes('pag')) {
    return {
      sql: `SELECT al.Nombre_AeroLineae, SUM(t.Precio) AS Ingresos_Totales,\nCOUNT(t.ID_Ticket) AS Boletos_Vendidos\nFROM Ticket t\nINNER JOIN Vuelo v ON t.ID_Vuelo = v.ID_Vuelo\nINNER JOIN Aerolinea al ON v.ID_Aerolinea = al.ID_Aerolinea\nGROUP BY al.Nombre_AeroLineae\nORDER BY Ingresos_Totales DESC;`,
      linq: `var ingresosPorAerolinea = dbContext.Tickets\n    .GroupBy(t => t.Vuelo.Aerolinea.Nombre_AeroLineae)\n    .Select(g => new {\n        Aerolinea = g.Key,\n        IngresosTotales = g.Sum(t => t.Precio),\n        BoletosVendidos = g.Count()\n    })\n    .OrderByDescending(res => res.IngresosTotales)\n    .ToList();`,
      explanation: 'Esta consulta agrupa todos los tickets emitidos asociándolos a su respectivo vuelo y este a su vez a la aerolínea operadora. Se calcula la suma del precio cobrado por cada ticket y el conteo de pasajes vendidos para clasificar los mayores generadores de ingresos en la terminal.',
      insights: 'En el aeropuerto de Cusco, LATAM y Sky registran los mayores ingresos unitarios debido a la alta demanda estacional. Los precios de los boletos fluctúan enormemente según las horas de vuelo visual (VFR), siendo las de la mañana las más caras debido a la estabilidad meteorológica de Cusco.'
    };
  } else if (norm.includes('retraso') || norm.includes('demor') || norm.includes('tard') || norm.includes('incidenc')) {
    return {
      sql: `SELECT Numero_Vuelo, Hora_Salida, Hora_Llegada, Puerta_Embarque, Estado\nFROM Vuelo\nWHERE Estado = 'Retrasado'\nORDER BY Hora_Salida;`,
      linq: `var vuelosRetrasados = dbContext.Vuelos\n    .Where(v => v.Estado == "Retrasado")\n    .OrderBy(v => v.Hora_Salida)\n    .ToList();`,
      explanation: 'Selecciona de manera directa todos los registros de la entidad Vuelo cuyo estado operativo es "Retrasado", ordenándolos cronológicamente por la hora de salida para prever demoras en cadena.',
      insights: 'Cusco experimenta condiciones de vientos cruzados de cola por las tardes, lo que suspende despegues. Esta consulta en tiempo real permite reorganizar las puertas 02 y 05 que concentran la mayor congestión e informar inmediatamente a los guías turísticos.'
    };
  } else if (norm.includes('equipaje') || norm.includes('malet') || norm.includes('peso') || norm.includes('carg')) {
    return {
      sql: `SELECT v.Numero_Vuelo, COUNT(e.ID_Equipaje) AS Total_Piezas, AVG(e.Peso_KG) AS Peso_Promedio\nFROM Equipaje e\nINNER JOIN Vuelo v ON e.ID_Vuelo = v.ID_Vuelo\nGROUP BY v.Numero_Vuelo\nHAVING AVG(e.Peso_KG) > 20;`,
      linq: `var cargasCriticas = dbContext.Equipajes\n    .GroupBy(e => e.Vuelo.Numero_Vuelo)\n    .Select(g => new {\n        Vuelo = g.Key,\n        TotalPiezas = g.Count(),\n        PesoPromedio = g.Average(e => e.Peso_KG)\n    })\n    .Where(x => x.PesoPromedio > 20)\n    .ToList();`,
      explanation: 'Realiza el acoplamiento entre Equipaje y Vuelo para clasificar los vuelos que transportan más carga por pasajero, aplicando el filtro condicional HAVING para identificar aquellos vuelos con un peso promedio superior a 20 kg por maleta.',
      insights: 'La altitud de Cusco (3,400 metros) disminuye la densidad del aire, reduciendo la sustentación de la aeronave en despegues. Monitorear promedios pesados de equipaje (turistas regresando del Camino Inca con equipos de montaña) es crucial para evitar sobrecargar los Airbus A320 y calcular la descompresión de combustible.'
    };
  } else if (norm.includes('pasajero') || norm.includes('nacion') || norm.includes('extranj')) {
    return {
      sql: `SELECT Nacionalidad, COUNT(ID_Pasajero) AS Total_Pasajeros\nFROM Pasajero\nGROUP BY Nacionalidad\nORDER BY Total_Pasajeros DESC;`,
      linq: `var pasajerosPorOrigen = dbContext.Pasajeros\n    .GroupBy(p => p.Nacionalidad)\n    .Select(g => new {\n        Nacionalidad = g.Key,\n        Cantidad = g.Count()\n    })\n    .OrderByDescending(x => x.Cantidad)\n    .ToList();`,
      explanation: 'Agrupa el universo total de pasajeros según su nacionalidad declarada en sus pasaportes y los ordena de forma descendente para mapear el perfil migratorio del aeropuerto.',
      insights: 'Más del 65% de los pasajeros de fin de semana en Cusco provienen de EE.UU., Francia y Brasil. Esto exige activar traductores y señalética multilingüe en la aduana cusqueña para mitigar demoras de escala.'
    };
  } else if (norm.includes('avion') || norm.includes('mantenim') || norm.includes('operat')) {
    return {
      sql: `SELECT ID_Avion, Modelo, Aerolinea_Propietaria, Estado_Mantenimiento\nFROM Avion\nWHERE Estado_Mantenimiento != 'Operativo';`,
      linq: `var avionesNoOperativos = dbContext.Aviones\n    .Where(a => a.Estado_Mantenimiento != "Operativo")\n    .ToList();`,
      explanation: 'Consulta la flota aérea filtrando las unidades que requieren revisión técnica o que están en mantenimiento prioritario.',
      insights: 'Debido a la aproximación visual compleja por la geografía montañosa del Cusco (W-015 Cusco Approach), los alerones, flaps y frenos de los reactores sufren mayor desgaste térmico. Cualquier aeronave NO operativa debe resolverse antes del cierre nocturno del Velasco Astete.'
    };
  }

  // Generic schema-appropriate simulation response
  return {
    sql: `SELECT v.Numero_Vuelo, ao.Ciudad AS Origen, ad.Ciudad AS Destino, v.Hora_Salida, v.Estado\nFROM Vuelo v\nINNER JOIN Aeropuerto ao ON v.ID_Aeropuerto_Origen = ao.ID_Aeropuerto\nINNER JOIN Aeropuerto ad ON v.ID_Aeropuerto_Destino = ad.ID_Aeropuerto\nWHERE ao.Ciudad = 'Cusco' OR ad.Ciudad = 'Cusco'\nORDER BY v.Hora_Salida;`,
    linq: `var CuscoScheduler = dbContext.Vuelos\n    .Where(v => v.AeropuertoOrigen.Ciudad == "Cusco" || v.AeropuertoDestino.Ciudad == "Cusco")\n    .OrderBy(v => v.Hora_Salida)\n    .Select(v => new { v.Numero_Vuelo, Origen = v.AeropuertoOrigen.Ciudad, Destino = v.AeropuertoDestino.Ciudad, v.Hora_Salida })\n    .ToList();`,
    explanation: `Análisis de la tabla de Vuelos cruzando información con la lista de aeropuertos de Origen y Destino para extraer todos los arribos y partidas de la estación Cusco.`,
    insights: 'Consultas generales relativas a Cusco. Se aconseja filtrar específicamente los vuelos del amanecer (05:00 - 08:00 AM) que acumulan el 45% del rendimiento diario de pistas antes de las nubes estacionales de mediodía.'
  };
}

// Vite and static build setup
startServer();

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AeroQuery Cusco full-stack server running on http://localhost:${PORT}`);
  });
}
