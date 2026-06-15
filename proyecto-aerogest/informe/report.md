# AeroGest Cusco — AOCC Strategic Terminal

Sistema de gestión aeroportuaria integral para el Aeropuerto Internacional Alejandro Velasco Astete en Cusco. Combina un **panel ejecutivo estratégico** con **operaciones CRUD en tiempo real**, potenciado con **inteligencia artificial predictiva (Gemini)** y sincronización **WebSocket vía Supabase**.

---

## Stack Tecnológico

| Capa        | Tecnología                                         |
| ----------- | -------------------------------------------------- |
| Frontend    | React 19 + TypeScript + Vite 6                     |
| Estilos     | Tailwind CSS v4 — tema dark/amber glassmorphism    |
| Fuentes     | Inter (UI), JetBrains Mono (código), Material Symbols |
| Backend     | Supabase (PostgreSQL 15, REST, Realtime WebSocket) |
| AI          | Google Gemini 2.5 Flash (`@google/genai` v2)       |
| Deploy      | Vercel (SPA static, auto-build)                    |

---

## Arquitectura

```
src/
├── App.tsx                 ← Orquestador principal (auth, routing, datos)
├── main.tsx                ← Entry point React
├── index.css               ← Tema Tailwind + utilidades glassmorphism
├── types.ts                ← Tipos compartidos (ScenarioData, Vuelo, etc.)
├── supabase.ts             ← Cliente Supabase + funciones CRUD
├── data/
│   └── scenarios.ts        ← 3 escenarios de negocio con datos financieros
├── hooks/
│   └── useRealtimeSync.ts  ← Hook de suscripción WebSocket (vuelos + incidencias)
└── components/
    ├── Sidebar.tsx          ← Navegación (Centro de Mando + Operaciones)
    ├── Header.tsx           ← AOCC LIVE, selector escenarios, búsqueda
    ├── LoginScreen.tsx      ← Pantalla de ingreso cinematic dark/amber
    ├── Charts.tsx           ← Componentes SVG reutilizables (barras, líneas, radar)
    ├── PrincipalDashboardView.tsx  ← Dashboard ejecutivo principal
    ├── SaludEmpresarialView.tsx    ← Salud financiera y rentabilidad
    ├── MercadoCrecimientoView.tsx  ← Análisis de mercado y rutas
    ├── RiesgosEstrategicosView.tsx ← Matriz de riesgos
    ├── ExecutiveReport.tsx         ← Reporte de gobierno corporativo
    ├── DashboardView.tsx    ← KPIs operacionales (vista legacy)
    ├── VuelosView.tsx       ← CRUD vuelos + detección conflictos de puerta + CSV
    ├── PasajerosView.tsx    ← CRUD pasajeros
    ├── BoletosView.tsx      ← CRUD boletos
    ├── EquipajesView.tsx    ← CRUD equipajes + alertas SLA
    ├── IncidenciasView.tsx  ← Kanban 3 columnas (Pendiente/En Progreso/Resuelto)
    ├── MonitoreoView.tsx    ← Simulador Gemini + Proyección de personal
    ├── SimuladorGemini.tsx  ← Predicción de impacto operativo con IA
    └── ProyeccionStaffing.tsx ← Cálculo de personal de tierra
```

---

## Features

### 1. Panel Ejecutivo Estratégico
Tres escenarios de negocio seleccionables desde el header:

| Escenario               | Descripción                                      |
| ----------------------- | ------------------------------------------------ |
| 📈 Alta Demanda         | Pico turístico Inti Raymi — máxima expansión     |
| ⛈️ Estacional Lluvias   | Crisis climática y desvíos operativos            |
| 🚧 Reinversión Pista    | Obras CAPEX con cierre diario de pista           |

Cada escenario actualiza:
- KPIs financieros (EBITDA, ingresos, TUA)
- Gráficos de pasajeros mensuales (comparativa 2023–2024)
- Participación de aerolíneas y rentabilidad de rutas
- Matriz de riesgos estratégicos con estado y tendencia
- Reporte ejecutivo exportable (imprimible)

### 2. Operaciones CRUD en Tiempo Real
| Módulo     | Funcionalidades                                                      |
| ---------- | -------------------------------------------------------------------- |
| Vuelos     | Crear, filtrar, gestionar estado/puerta, detalle. Conflicto de slot (misma puerta < 45 min → `¡Conflicto de Slot!` + borde rojo + animación pulse). Exportar manifiesto de retrasos CSV (con BOM para Excel). |
| Pasajeros  | CRUD completo, navegación cruzada a boletos por pasajero.            |
| Boletos    | CRUD con asignación de asiento, precio, estado.                      |
| Equipajes  | CRUD con seguimiento de estado. **Alerta SLA**: si hay equipajes "En Tránsito" con código de faja, muestra banner `ALERTA SLA EXCEDIDA: Faja N`. |
| Incidencias| Kanban 3 columnas (Pendiente → En Progreso → Resuelto). Timer en vivo para incidencias en progreso. 7 tickets de semilla. |

### 3. Inteligencia Artificial (Gemini 2.5 Flash)
**Simulador de Impacto Operativo** — el usuario describe un evento o crisis y Gemini responde con:
- 📊 Impacto en puertas y fajas
- 👥 Recomendación de personal

**Mecanismo de respaldo:** si Gemini no responde en 15 segundos, el sistema cae a un fallback local basado en palabras clave (clima, personal, técnico, baja demanda) con banner `[FALLBACK OPERATIVO LOCAL]`.

### 4. Proyección de Personal de Tierra
Calcula automáticamente el staff necesario para los próximos 3 horas:
- 1 agente de rampa por cada 40 pasajeros
- 1 agente de seguridad por cada 75 pasajeros
- 5 + 1 por cada 100 pasajeros para limpieza

### 5. Sincronización en Tiempo Real
WebSocket vía Supabase Realtime — cualquier cambio en las tablas `vuelos` o `incidencias` dispara una recarga completa de datos en todos los componentes conectados.

### 6. Autenticación
Pantalla de login cinematic con diseño dark/amber. Persistencia de sesión vía `localStorage`. Perfil de director con avatar y nombre.

### 7. Sistema de Notificaciones (Toast)
Notificaciones temporales (4 segundos) para acciones CRUD exitosas o errores. Contexto global disponible via `useToast()`.

---

## Rutas de Navegación

### Centro de Mando
| Ruta                  | Vista                        |
| --------------------- | ---------------------------- |
| `dashboard`           | Dashboard ejecutivo          |
| `salud_empresarial`   | Salud financiera             |
| `mercado_crecimiento` | Análisis de mercado          |
| `riesgos_estrategicos`| Matriz de riesgos            |
| `reporte`             | Reporte ejecutivo            |

### Operaciones
| Ruta          | Vista                 |
| ------------- | --------------------- |
| `vuelos`      | Gestión de vuelos     |
| `pasajeros`   | Gestión de pasajeros  |
| `boletos`     | Gestión de boletos    |
| `equipajes`   | Gestión de equipajes  |
| `incidencias` | Consola Kanban        |
| `monitoreo`   | Simulación + Staffing |
| `config`      | Ajustes de sistema    |

---

## Variables de Entorno

| Variable                 | Descripción                          |
| ------------------------ | ------------------------------------ |
| `VITE_SUPABASE_URL`      | URL del proyecto Supabase            |
| `VITE_SUPABASE_ANON_KEY` | Clave anónima de Supabase            |
| `VITE_GEMINI_API_KEY`    | API key de Google Gemini             |

---

## Despliegue

Producción: [https://aerogest-cusco.vercel.app](https://aerogest-cusco.vercel.app)

Comandos:
```bash
npm run dev    # Servidor local :3000
npm run build  # Build producción → dist/
npx vercel --prod  # Deploy a Vercel
```
