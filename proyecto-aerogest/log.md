# Reporte Completo — AeroGest Cusco

## Descripción General

**AeroGest Cusco** es un Sistema de Información Web para la Gestión de Vuelos, Pasajeros y Equipajes del Aeropuerto Internacional Alejandro Velasco Astete (CUZ) en Cusco, Perú. Es una aplicación de una sola página (SPA) construida con React 19, TypeScript y Vite, con pers
istencia en Supabase y una interfaz de estilo aeronáutico/HUD.

---

## Stack Tecnológico

| Capa          | Tecnología                                |
|---------------|--------------------------------------------|
| Frontend      | React 19, TypeScript 5.8, Vite 6          |
| Estilos       | Tailwind CSS v4, Google Fonts (Inter, Space Grotesk, JetBrains Mono) |
| Iconos        | Lucide React                               |
| Animaciones   | Motion (Framer Motion), CSS animations     |
| Backend/DB    | Supabase (PostgreSQL vía `@supabase/supabase-js`) |
| Server (opt.) | Express 4 (instalado, sin integrar)        |
| AI            | Google Gemini API (`@google/genai`) (instalado, sin integrar) |
| Origen        | Generado desde Google AI Studio            |

---

## Arquitectura del Proyecto

```
aerogest-cusco/
├── assets/.aistudio/          # Metadatos de AI Studio
├── src/
│   ├── components/
│   │   ├── LoginView.tsx           # Pantalla de inicio de sesión
│   │   ├── Sidebar.tsx             # Navegación lateral (menú principal)
│   │   ├── Header.tsx              # Barra superior (búsqueda, notificaciones, config)
│   │   ├── DashboardView.tsx       # Panel de control con KPIs y tabla de vuelos
│   │   ├── VuelosView.tsx          # Gestión de vuelos (lista + crear + detalle)
│   │   ├── PasajerosView.tsx       # Gestión de pasajeros (lista + crear + export)
│   │   ├── BoletosView.tsx         # Gestión de boletos/tickets (lista + emitir + detalle)
│   │   ├── EquipajesView.tsx       # Gestión de equipajes (lista + registrar + detalle)
│   │   └── SupabaseMissingBanner.tsx  # Banner de error de conexión
│   ├── App.tsx                     # Orquestador principal (estado global, routing interno)
│   ├── main.tsx                    # Punto de entrada React
│   ├── index.css                   # Tailwind + animaciones + scroll custom
│   ├── supabase.ts                 # Capa de abstracción de base de datos (consultas + escritura)
│   └── types.ts                    # Interfaces del dominio (Vuelo, Pasajero, Boleto, Equipaje, DashboardStats)
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example                   # Plantilla de variables de entorno
├── metadata.json                  # Metadatos para Google AI Studio
└── README.md                      # Instrucciones de ejecución local
```

---

## Funcionalidad Actual — Módulo por Módulo

### 1. Autenticación (`LoginView.tsx`)
- Pantalla de login con temática HUD aeronáutico (cuadrícula de radar, círculos concéntricos, colores azul oscuro)
- Formulario con campos de correo y contraseña con iconos
- Botón "Autenticar Operador Cusco" con estado de carga
- Validación básica (campos no vacíos)
- Persistencia de sesión vía `localStorage` con flag `aerogest_auth_token`
- Botón "¿La olvidó?" que muestra alert con datos de soporte técnico
- Panel informativo del aeropuerto (altitud 3,310m, sistemas integrados)
- **No implementa autenticación real** — cualquier credencial pasa tras 850ms simulados

### 2. Dashboard (`DashboardView.tsx`)
- Banner principal "Estación Cusco Velasco Astete" con indicador de estado en línea
- Botón de acción rápida "Programar Vuelo" que navega al módulo de vuelos y abre el modal de creación
- 6 tarjetas KPI con iconos y efectos hover:
  - **Total Vuelos** (icono avión azul)
  - **Programados** (icono calendario verde)
  - **Retrasados** (icono advertencia naranja con indicador de tendencia +3)
  - **Pasajeros** (icono usuarios índigo, formato K para miles)
  - **Boletos** (icono ticket púrpura, formato K)
  - **Equipajes** (icono maleta celeste, formato K)
- Tabla "Despacho de Próximos Vuelos" con columnas: código, aerolínea, origen, destino, hora, estado
- Badges de estado con colores semánticos (verde=Programado, naranja=Retrasado, azul=En Vuelo/Aterrizado, rojo=Cancelado)
- Indicador de retraso con hora tachada y hora real alternativa
- Enlace "Monitorear Todo" que navega al módulo de vuelos
- Fondo decorativo SVG con patrón de cuadrícula y trayectorias de vuelo

### 3. Gestión de Vuelos (`VuelosView.tsx`)
- Tabla completa con columnas: Código, Aerolínea (con avatar de iniciales), Origen, Destino, Salida, Llegada, Puerta, Estado, Acciones
- Filtros de estado tipo pills: Todos, Programados, En Vuelo, Retrasados, Completados
- Barra de búsqueda textual en el header (filtra por código, aerolínea, origen, destino)
- Botón "Nuevo Vuelo" con fondo oscuro
- **Modal de creación** con formulario:
  - Código de vuelo (texto, mayúsculas automáticas)
  - Aerolínea (select con LATAM, Avianca, Sky Airline, JetSMART, Aerolíneas Argentinas)
  - Origen y Destino (texto, destino prellenado "Cusco (CUZ)")
  - Hora salida y llegada estimadas
  - Puerta de embarque (select G1-G5)
  - Estado operativo (Programado, En Vuelo, Retrasado, Completado, Cancelado)
  - Validación de campos obligatorios
  - Persistencia vía `onAddVuelo` → Supabase
- **Modal de detalle** "Ficha Técnica" con: aerolínea, código, ruta con icono mapa, salida/llegada, puerta, estado
- Footer con contador de registros y botones de paginación (deshabilitados)
- Indicador visual de filas pares (zebra striping)
- Manejo de error con reintento

### 4. Gestión de Pasajeros (`PasajerosView.tsx`)
- Tabla con columnas: Nombres (con avatar de iniciales con color variante), Apellidos, Documento (tipo + número), Nacionalidad (badge), Contacto (teléfono + email con iconos), Acciones
- Barra de búsqueda textual (filtra por nombres, apellidos, documento, nacionalidad, correo)
- Indicador "SISTEMA SEGURO Cusco" con icono de escudo verde
- Botón de filtros avanzados (alert informativo)
- Botón de exportación a JSON (descarga del listado completo)
- Botón "Nuevo Pasajero" con icono UserPlus
- **Modal de creación** con formulario:
  - Nombres y Apellidos
  - Tipo Documento (select: DNI, PASAPORTE, C.E.)
  - Número de Documento
  - Nacionalidad
  - Teléfono y Email (opcionales)
  - Validación de campos obligatorios
  - Persistencia vía `onAddPasajero` → Supabase
- Botón "Boletos" por pasajero que navega al módulo de boletos con filtro pre-aplicado por nombre

### 5. Gestión de Boletos / Tickets (`BoletosView.tsx`)
- Tabla con columnas: Código Boleto, Pasajero (con avatar de iniciales), Vuelo (badge con icono avión), Asiento, Precio ($), Estado, Acciones
- Indicador de seguridad "ACCESO SEGURO AUTORIZADO"
- Filtros de estado: Todos, Confirmado, Pendiente, Cancelado
- Barra de búsqueda textual en el header
- Botón "Auditoría Cusco" (alert informativo)
- Botón "Nuevo Boleto"
- **Modal de emisión** con formulario:
  - Nombre completo del pasajero
  - Código de vuelo
  - Asiento asignado
  - Precio cobrado ($)
  - Estado de emisión (Confirmado/Pendiente/Cancelado)
  - Generación automática de código de boleto (TKT-XXXX)
  - Validación de precio numérico
- **Modal de detalle** "Boleto Electrónico" con: pasajero, código vuelo, asiento, estado, total cobrado
- Tickets cancelados se muestran con opacidad reducida y texto tachado
- Botón de acciones con menú vertical (MoreVertical)

### 6. Gestión de Equipajes (`EquipajesView.tsx`)
- Tabla con columnas: Código Equipaje (con icono de código de barras), Pasajero Titular, Código Boleto, Peso (kg), Estado, Acciones
- Panel de búsqueda específica con icono de escáner (ScanLine) para código de equipaje o nombre de pasajero
- Filtros de estado tipo chips con indicadores circulares de color:
  - Todos (con contador numérico)
  - En Tránsito (azul)
  - Entregado (verde)
  - Perdido (rojo, con anillo de enfoque)
- Botón "Registrar Equipaje"
- **Modal de registro** con formulario:
  - Nombre completo del pasajero
  - Código de boleto asociado
  - Peso estimado (kg)
  - Estado de recepción (En Tránsito/Entregado/Perdido)
  - Generación automática de código CUZ-XXXX-X
- **Modal de detalle** "Equipaje Facturado" con: pasajero, boleto asociado, peso, estado de rastreo
- Equipajes perdidos destacados con fondo rosado y animación pulse

### 7. UI Compartida — Sidebar (`Sidebar.tsx`)
- Fija en el lado izquierdo (w-64), fondo azul profundo (#000c24)
- Logo: avión estilizado en gradiente azul
- Título "AeroGest Cusco" + subtítulo "Terminal Velasco Astete"
- Divider decorativo con gradiente
- 5 ítems de navegación con iconos:
  - Dashboard (LayoutDashboard)
  - Vuelos (PlaneTakeoff)
  - Pasajeros (Users)
  - Boletos (Ticket)
  - Equipajes (Luggage)
- Ítem activo con borde izquierdo celeste y resaltado
- Sección inferior con:
  - Ayuda / Soporte (muestra alert con datos de contacto)
  - Cerrar Sesión (icono rojo, confirma antes de cerrar)

### 8. UI Compartida — Header (`Header.tsx`)
- Barra superior fija (top-0, ancho ajustado al sidebar: calc(100%-16rem))
- **Campo de búsqueda** con placeholder contextual que cambia según el módulo activo:
  - Dashboard: "Buscar en Cusco AeroGest..."
  - Vuelos: "Filtrar por código de vuelo, aerolínea u origen..."
  - Pasajeros: "Filtrar por nombre, documento o nacionalidad..."
  - Boletos: "Filtrar por código de boleto o pasajero de Cusco..."
  - Equipajes: "Buscar equipaje por código de bulto o pasajero..."
- **Panel de notificaciones**: botón con badge rojo, dropdown con 3 notificaciones simuladas (vuelo retrasado, equipaje extraviado, boleto confirmado), indicador de leídas/no leídas
- **Menú de configuración**: botón de engranaje, dropdown con opción "Restablecer Datos Cusco" (llama a función que no hace nada)
- **Avatar de usuario**: imagen desde Google, nombre "Admin User", rol "Operador Base"
- Estilo glassmorphism (fondo blanco con blur y bordes sutiles)

### 9. Manejo de Estados Globales (App.tsx)
- Estado de autenticación persistente (localStorage)
- 5 arreglos de datos: vuelos, pasajeros, boletos, equipajes, stats
- Carga paralela de todos los módulos via `Promise.all`
- Indicador de carga (spinner con icono de avión animado)
- Manejo de error con mensaje y botón "Reintentar sincronizar"
- Banner especial cuando Supabase no está configurado
- Búsqueda compartida que se resetea al cambiar de vista
- Navegación cruzada: Dashboard→Vuelos(modal), Pasajeros→Boletos(filtrado)

### 10. Capa de Datos (supabase.ts)
- 4 vistas Supabase: `vista_dashboard`, `vista_vuelos`, `vista_pasajeros`, `vista_boletos`, `vista_equipajes`
- 4 tablas de escritura: `vuelos`, `pasajeros`, `boletos`, `equipajes`
- Funciones de lectura: `getDashboardStats()`, `getVuelos()`, `getPasajeros()`, `getBoletos()`, `getEquipajes()`
- Funciones de creación: `addVuelo()`, `addPasajero()`, `addBoleto()`, `addEquipaje()`
- Mapeadores defensivos (`mapVuelo`, `mapPasajero`, `mapBoleto`, `mapEquipaje`) que normalizan variaciones de nombres de campos
- Verificación de configuración via `hasSupabaseConfig` (valida que URL y key no estén vacíos ni contengan placeholders)
- Generación de iniciales de avatar para boletos

### 11. Sistema de Tipos (types.ts)
```typescript
DashboardStats  — total_vuelos, vuelos_programados, vuelos_retrasados,
                   vuelos_cancelados, vuelos_aterrizados, total_pasajeros,
                   total_boletos, total_equipajes
Vuelo           — id, codigo, aerolina, origen, destino, salida, llegada,
                   puerta, estado (Programado|En Vuelo|Retrasados|Retrasado|
                   Aterrizado|Completados|Completado|Cancelado),
                   hora_salida_real?
Pasajero        — id, nombres, apellidos, tipo_documento (DNI|PASAPORTE|C.E.),
                   documento, nacionalidad, telefono, correo
Boleto          — id, codigo_boleto, pasajero_id, pasajero_nombre,
                   pasajero_avatar_iniciales, vuelo_codigo, asiento,
                   precio, estado (Confirmado|Pendiente|Cancelado)
Equipaje        — id, codigo_equipaje, pasajero_id, pasajero_nombre,
                   codigo_boleto, peso, estado (En Tránsito|Entregado|Perdido)
```

### 12. Estilos Globales (index.css + Tailwind)
- 3 familias tipográficas: Inter (sans), JetBrains Mono (mono), Space Grotesk (display)
- Animaciones: `fade-in` (0.25s), `slide-up` (0.35s cubic-bezier), `spin-hover` (10s linear)
- Scrollbar personalizada (6px, thumb redondeado semitransparente)
- Tema oscuro para paneles administrativos (#000c24, #001c4a, #023e8a)
- Efectos glassmorphism (backdrop-blur, bordes semitransparentes)
- Valores de color atípicos referenciados (ej. `slate-250`, `blue-150`, `sky-650`, `text-rose-850`) que sugieren extensión de la paleta Tailwind

---

## Estados de la Aplicación

| Estado         | Comportamiento                                              |
|----------------|--------------------------------------------------------------|
| **No autenticado** | Muestra LoginView. No hay acceso a ningún módulo.          |
| **Autenticado + Cargando** | Spinner con icono de avión girando y texto "Cargando Vistas Cusco Sincronizadas..." |
| **Autenticado + Error Supabase** | Muestra SupabaseMissingBanner con instrucciones de configuración |
| **Autenticado + Error genérico** | Panel rojo con mensaje de error y botón "Reintentar sincronizar" |
| **Autenticado + Sin datos** | Tablas vacías con mensaje "Ningún vuelo/pasajero/boleto/equipaje coincide" |
| **Autenticado + Datos OK** | Visualización completa de tablas, KPIs y funcionalidades CRUD (solo lectura + creación) |

---

## Limitaciones Conocidas

Ver sección "Funcionalidades Faltantes" a continuación.

---

# Log de Funcionalidades Faltantes — AeroGest Cusco

## 1. Base de datos
- [ ] **Datos Mock/Local** — Sin credenciales Supabase no hay datos de respaldo; las vistas se quedan vacías
- [ ] **Editar registros** — No hay update para vuelos, pasajeros, boletos ni equipajes
- [ ] **Eliminar registros** — No hay delete en ninguna entidad

## 2. Autenticación
- [ ] **Auth real** — El login es solo un flag en localStorage; cualquier credencial pasa
- [ ] **Registro de usuarios** — No existe flujo de registro
- [ ] **Recuperación de contraseña** — El link "¿La olvidó?" solo muestra un alert

## 3. Funcionalidades operativas
- [ ] **Cambio de estado** — No se puede marcar vuelo como "Aterrizado", equipaje como "Entregado", etc.
- [ ] **Paginación real** — Botones de paginación están deshabilitados en todas las tablas
- [ ] **Notificaciones dinámicas** — Las notificaciones son datos quemados, no provienen de eventos reales
- [ ] **Exportación** — Solo pasajeros tiene export JSON; faltan exportaciones para vuelos, boletos, equipajes

## 4. Integraciones no utilizadas
- [ ] **Google Gemini API** — Paquete `@google/genai` instalado pero sin implementar
- [ ] **Express server** — Dependencia instalada pero sin integración en el frontend

## 5. UI/UX
- [ ] **Edición en línea** — No hay forma de editar datos directamente en las tablas
- [ ] **Responsive** — Algunas vistas tienen adaptación parcial pero no está probado en mobile
- [ ] **Confirmaciones** — Faltan diálogos de confirmación en acciones destructivas (ya existe en logout y reset)

## 6. Desempeño y calidad
- [ ] **Tipos inconsistentes** — `Vuelo.estado` tiene valores duplicados (ej. "Retrasados" y "Retrasado", "Completados" y "Completado")
- [ ] **Código muerto** — `resetLocalDatabase()` no hace nada
- [ ] **Sin pruebas** — No hay tests unitarios ni de integración
- [ ] **Sin CI/CD** — No hay configuración de despliegue automatizado
