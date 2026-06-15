# AeroGest Cusco — AOCC Strategic Terminal

Sistema de gestión aeroportuaria integral para el **Aeropuerto Internacional Alejandro Velasco Astete** en Cusco. Combina un panel ejecutivo estratégico con operaciones CRUD en tiempo real, potenciado con inteligencia artificial predictiva (Gemini) y sincronización WebSocket vía Supabase.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + TypeScript + Vite 6 |
| Estilos | Tailwind CSS v4 — tema dark/amber glassmorphism |
| Backend | Supabase (PostgreSQL 15, REST, Realtime WebSocket) |
| AI | Google Gemini 2.5 Flash |
| Deploy | Vercel |

## Funcionalidades Principales

- **Panel Ejecutivo Estratégico** — 3 escenarios de negocio (Alta Demanda, Estacional Lluvias, Reinversión Pista) con KPIs financieros, gráficos y matriz de riesgos
- **Operaciones CRUD en Tiempo Real** — Vuelos, Pasajeros, Boletos, Equipajes con detección de conflictos de puerta y alertas SLA
- **Kanban de Incidencias** — Tablero 3 columnas (Pendiente / En Progreso / Resuelto) con timer en vivo
- **Simulador IA (Gemini 2.5)** — Predicción de impacto operativo ante eventos o crisis con fallback local
- **Proyección de Personal** — Cálculo automático de staff necesario para operaciones de tierra
- **Sincronización WebSocket** — Actualización en vivo de vuelos e incidencias vía Supabase Realtime

## Despliegue

- **Producción (Vercel):** [https://aerogest-cusco.vercel.app](https://aerogest-cusco.vercel.app)
- **GitHub Pages:** [https://024100464b-art.github.io/Grupo-1/](https://024100464b-art.github.io/Grupo-1/)
- **Repositorio:** `proyecto-aerogest/`
- **Informe (PDF):** [proyecto-aerogest/informe/AeroGest_Cusco_Informe.pdf](./proyecto-aerogest/informe/AeroGest_Cusco_Informe.pdf)
- **Informe Completo (DOCX):** [proyecto-aerogest/informe/Informe Completo AeroGest.docx](./proyecto-aerogest/informe/Informe%20Completo%20AeroGest.docx)
- **Informe Completo (PDF):** [proyecto-aerogest/informe/Informe Completo AeroGest.pdf](./proyecto-aerogest/informe/Informe%20Completo%20AeroGest.pdf)

## Variables de Entorno

| Variable | Descripción |
|----------|------------|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave anónima de Supabase |
| `VITE_GEMINI_API_KEY` | API key de Google Gemini |

## Comandos

```bash
npm run dev    # Servidor local :3000
npm run build  # Build producción → dist/
```

---

*Trabajo académico — Universidad Andina del Cusco · Ingeniería de Sistemas · Modelado de Base de Datos 2026*
