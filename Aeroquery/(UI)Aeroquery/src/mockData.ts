import { Aeropuerto, Aerolinea, Vuelo, Ruta, Pasajero, Equipaje, Empleado, Avion, Ticket, TableMeta } from './types';

export const mockAeropuertos: Aeropuerto[] = [
  { ID_Aeropuerto: 1, Nombre_Aero: 'Alejandro Velasco Astete', Ciudad: 'Cusco', Codigo_IATA: 'CUZ' },
  { ID_Aeropuerto: 2, Nombre_Aero: 'Jorge Chávez', Ciudad: 'Lima', Codigo_IATA: 'LIM' },
  { ID_Aeropuerto: 3, Nombre_Aero: 'Alfredo Rodríguez Ballón', Ciudad: 'Arequipa', Codigo_IATA: 'AQP' },
  { ID_Aeropuerto: 4, Nombre_Aero: 'Padre Aldamiz', Ciudad: 'Puerto Maldonado', Codigo_IATA: 'PEM' },
  { ID_Aeropuerto: 5, Nombre_Aero: 'Inca Manco Cápac', Ciudad: 'Juliaca', Codigo_IATA: 'JUL' }
];

export const mockAerolineas: Aerolinea[] = [
  { ID_Aerolinea: 1, Nombre_AeroLineae: 'LATAM Perú', Pais: 'Perú', Codigo_IATA: 'LA' },
  { ID_Aerolinea: 2, Nombre_AeroLineae: 'Sky Airline Perú', Pais: 'Chile', Codigo_IATA: 'H2' },
  { ID_Aerolinea: 3, Nombre_AeroLineae: 'JetSMART Perú', Pais: 'Chile', Codigo_IATA: 'JA' },
  { ID_Aerolinea: 4, Nombre_AeroLineae: 'Star Perú', Pais: 'Perú', Codigo_IATA: '2I' }
];

export const mockAviones: Avion[] = [
  { ID_Avion: 1, Modelo: 'Airbus A320neo', Capacidad_Pasajeros: 186, Aerolinea_Propietaria: 'LATAM Perú', Estado_Mantenimiento: 'Operativo' },
  { ID_Avion: 2, Modelo: 'Airbus A321neo', Capacidad_Pasajeros: 224, Aerolinea_Propietaria: 'Sky Airline Perú', Estado_Mantenimiento: 'Operativo' },
  { ID_Avion: 3, Modelo: 'Boeing 737-800', Capacidad_Pasajeros: 162, Aerolinea_Propietaria: 'Star Perú', Estado_Mantenimiento: 'Revisión Necesaria' },
  { ID_Avion: 4, Modelo: 'Airbus A320neo', Capacidad_Pasajeros: 186, Aerolinea_Propietaria: 'JetSMART Perú', Estado_Mantenimiento: 'En Mantenimiento' }
];

export const mockVuelos: Vuelo[] = [
  { ID_Vuelo: 1, Numero_Vuelo: 'LA2021', ID_Aeropuerto_Origen: 2, ID_Aeropuerto_Destino: 1, ID_Aerolinea: 1, ID_Avion: 1, Hora_Salida: '08:30', Hora_Llegada: '09:45', Estado: 'Aterrizado', Puerta_Embarque: '02' },
  { ID_Vuelo: 2, Numero_Vuelo: 'H23015', ID_Aeropuerto_Origen: 1, ID_Aeropuerto_Destino: 2, ID_Aerolinea: 2, ID_Avion: 2, Hora_Salida: '10:15', Hora_Llegada: '11:35', Estado: 'A tiempo', Puerta_Embarque: '05' },
  { ID_Vuelo: 3, Numero_Vuelo: 'JA4012', ID_Aeropuerto_Origen: 3, ID_Aeropuerto_Destino: 1, ID_Aerolinea: 3, ID_Avion: 4, Hora_Salida: '11:00', Hora_Llegada: '11:55', Estado: 'Retrasado', Puerta_Embarque: '03' },
  { ID_Vuelo: 4, Numero_Vuelo: 'LA2154', ID_Aeropuerto_Origen: 1, ID_Aeropuerto_Destino: 4, ID_Aerolinea: 1, ID_Avion: 1, Hora_Salida: '12:30', Hora_Llegada: '13:15', Estado: 'Abordando', Puerta_Embarque: '01' },
  { ID_Vuelo: 5, Numero_Vuelo: '2I1102', ID_Aeropuerto_Origen: 2, ID_Aeropuerto_Destino: 1, ID_Aerolinea: 4, ID_Avion: 3, Hora_Salida: '14:20', Hora_Llegada: '15:40', Estado: 'A tiempo', Puerta_Embarque: '04' },
  { ID_Vuelo: 6, Numero_Vuelo: 'LA2035', ID_Aeropuerto_Origen: 1, ID_Aeropuerto_Destino: 2, ID_Aerolinea: 1, ID_Avion: 1, Hora_Salida: '16:05', Hora_Llegada: '17:25', Estado: 'A tiempo', Puerta_Embarque: '02' },
  { ID_Vuelo: 7, Numero_Vuelo: 'JA4033', ID_Aeropuerto_Origen: 1, ID_Aeropuerto_Destino: 5, ID_Aerolinea: 3, ID_Avion: 4, Hora_Salida: '18:15', Hora_Llegada: '19:00', Estado: 'A tiempo', Puerta_Embarque: '05' },
  { ID_Vuelo: 8, Numero_Vuelo: 'LA2088', ID_Aeropuerto_Origen: 5, ID_Aeropuerto_Destino: 1, ID_Aerolinea: 1, ID_Avion: 1, Hora_Salida: '19:35', Hora_Llegada: '20:20', Estado: 'A tiempo', Puerta_Embarque: '03' }
];

export const mockRutas: Ruta[] = [
  { ID_Ruta: 1, ID_Aeropuerto_Origen: 2, ID_Aeropuerto_Destino: 1, Distancia_Millas: 362, Tiempo_Estimado_Minutos: 75 },
  { ID_Ruta: 2, ID_Aeropuerto_Origen: 1, ID_Aeropuerto_Destino: 2, Distancia_Millas: 362, Tiempo_Estimado_Minutos: 80 },
  { ID_Ruta: 3, ID_Aeropuerto_Origen: 3, ID_Aeropuerto_Destino: 1, Distancia_Millas: 201, Tiempo_Estimado_Minutos: 55 },
  { ID_Ruta: 4, ID_Aeropuerto_Origen: 1, ID_Aeropuerto_Destino: 4, Distancia_Millas: 196, Tiempo_Estimado_Minutos: 45 },
  { ID_Ruta: 5, ID_Aeropuerto_Origen: 1, ID_Aeropuerto_Destino: 5, Distancia_Millas: 154, Tiempo_Estimado_Minutos: 45 }
];

export const mockPasajeros: Pasajero[] = [
  { ID_Pasajero: 1, Nombre: 'Alejandro', Apellido: 'Poma', Nacionalidad: 'Peruana', Nro_Pasaporte: 'PAS99818', Fecha_Nacimiento: '1992-04-12' },
  { ID_Pasajero: 2, Nombre: 'John', Apellido: 'Miller', Nacionalidad: 'Estadounidense', Nro_Pasaporte: 'US948381', Fecha_Nacimiento: '1985-09-24' },
  { ID_Pasajero: 3, Nombre: 'María Elena', Apellido: 'Quiroga', Nacionalidad: 'Peruana', Nro_Pasaporte: 'PAS54321', Fecha_Nacimiento: '1990-11-05' },
  { ID_Pasajero: 4, Nombre: 'Sophie', Apellido: 'Dubois', Nacionalidad: 'Francesa', Nro_Pasaporte: 'FR847291', Fecha_Nacimiento: '1995-07-18' },
  { ID_Pasajero: 5, Nombre: 'Carlos', Apellido: 'Vargas', Nacionalidad: 'Boliviana', Nro_Pasaporte: 'BOL39921', Fecha_Nacimiento: '1988-02-14' },
  { ID_Pasajero: 6, Nombre: 'Luciana', Apellido: 'Mendoza', Nacionalidad: 'Peruana', Nro_Pasaporte: 'PAS12345', Fecha_Nacimiento: '2001-08-30' }
];

export const mockEquipaje: Equipaje[] = [
  { ID_Equipaje: 101, ID_Pasajero: 1, ID_Vuelo: 1, Peso_KG: 23.5, Color: 'Rojo', Estado: 'Entregado' },
  { ID_Equipaje: 102, ID_Pasajero: 2, ID_Vuelo: 1, Peso_KG: 15.2, Color: 'Negro', Estado: 'Entregado' },
  { ID_Equipaje: 103, ID_Pasajero: 3, ID_Vuelo: 2, Peso_KG: 21.8, Color: 'Azul', Estado: 'Registrado' },
  { ID_Equipaje: 104, ID_Pasajero: 4, ID_Vuelo: 3, Peso_KG: 18.0, Color: 'Gris', Estado: 'Retenido' },
  { ID_Equipaje: 105, ID_Pasajero: 5, ID_Vuelo: 4, Peso_KG: 24.1, Color: 'Verde', Estado: 'En Tránsito' },
  { ID_Equipaje: 106, ID_Pasajero: 6, ID_Vuelo: 5, Peso_KG: 12.5, Color: 'Rojo', Estado: 'Registrado' }
];

export const mockEmpleados: Empleado[] = [
  { ID_Empleado: 1, Nombre: 'Jorge', Apellido: 'Chávez Jr', Puesto: 'Supervisor de Tráfico Aéreo', Turno: 'Mañana', ID_Aeropuerto: 1 },
  { ID_Empleado: 2, Nombre: 'Susana', Apellido: 'Vilca', Puesto: 'Operadora de Migración', Turno: 'Tarde', ID_Aeropuerto: 1 },
  { ID_Empleado: 3, Nombre: 'Mariano', Apellido: 'Melgar', Puesto: 'Jefe de Operadora de Equipaje', Turno: 'Noche', ID_Aeropuerto: 1 },
  { ID_Empleado: 4, Nombre: 'Carmen', Apellido: 'Díaz', Puesto: 'Atención al Cliente', Turno: 'Mañana', ID_Aeropuerto: 1 }
];

export const mockTickets: Ticket[] = [
  { ID_Ticket: 501, ID_Pasajero: 1, ID_Vuelo: 1, Asiento: '12A', Clase: 'Económica', Precio: 120.00 },
  { ID_Ticket: 502, ID_Pasajero: 2, ID_Vuelo: 1, Asiento: '03C', Clase: 'Ejecutiva', Precio: 350.00 },
  { ID_Ticket: 503, ID_Pasajero: 3, ID_Vuelo: 2, Asiento: '15F', Clase: 'Económica', Precio: 95.00 },
  { ID_Ticket: 504, ID_Pasajero: 4, ID_Vuelo: 3, Asiento: '02B', Clase: 'Primera', Precio: 550.00 },
  { ID_Ticket: 505, ID_Pasajero: 5, ID_Vuelo: 4, Asiento: '22D', Clase: 'Económica', Precio: 110.00 },
  { ID_Ticket: 506, ID_Pasajero: 6, ID_Vuelo: 5, Asiento: '18C', Clase: 'Económica', Precio: 85.00 }
];

export const tableMetadata: TableMeta[] = [
  {
    name: 'Aeropuerto',
    description: 'Registra los aeropuertos vinculados al sistema con sus códigos IATA de 3 caracteres.',
    icon: 'database',
    columns: [
      { name: 'ID_Aeropuerto', type: 'INT', constraint: 'PRIMARY KEY', description: 'Identificador único' },
      { name: 'Nombre_Aero', type: 'VARCHAR(100)', constraint: 'NOT NULL', description: 'Nombre oficial del aeropuerto' },
      { name: 'Ciudad', type: 'VARCHAR(50)', constraint: 'NULL', description: 'Ubicación física' },
      { name: 'Codigo_IATA', type: 'CHAR(3)', constraint: 'UNIQUE', description: 'Código aeronáutico estandarizado' }
    ]
  },
  {
    name: 'Aerolinea',
    description: 'Catálogo de líneas aéreas nacionales e internacionales autorizadas.',
    icon: 'hub',
    columns: [
      { name: 'ID_Aerolinea', type: 'INT', constraint: 'PRIMARY KEY', description: 'Identificador secuencia' },
      { name: 'Nombre_AeroLineae', type: 'VARCHAR(100)', constraint: 'NOT NULL', description: 'Nombre comercial' },
      { name: 'Pais', type: 'VARCHAR(50)', constraint: 'NOT NULL', description: 'País de origen de la patente' },
      { name: 'Codigo_IATA', type: 'CHAR(2)', constraint: 'UNIQUE', description: 'Prefijo IATA de aerolínea' }
    ]
  },
  {
    name: 'Vuelo',
    description: 'Contiene los itinerarios diarios, estados operativos y puertas de embarque de Cusco.',
    icon: 'airplanemode_active',
    columns: [
      { name: 'ID_Vuelo', type: 'INT', constraint: 'PRIMARY KEY', description: 'Identificador único de vuelo' },
      { name: 'Numero_Vuelo', type: 'VARCHAR(10)', constraint: 'UNIQUE', description: 'Código único de vuelo (ej: LA2021)' },
      { name: 'ID_Aeropuerto_Origen', type: 'INT', constraint: 'FOREIGN KEY REFERENCES Aeropuerto', description: 'Aeropuerto de origen' },
      { name: 'ID_Aeropuerto_Destino', type: 'INT', constraint: 'FOREIGN KEY REFERENCES Aeropuerto', description: 'Aeropuerto de destino' },
      { name: 'ID_Aerolinea', type: 'INT', constraint: 'FOREIGN KEY REFERENCES Aerolinea', description: 'Compañía operadora' },
      { name: 'ID_Avion', type: 'INT', constraint: 'FOREIGN KEY REFERENCES Avion', description: 'Equipo asignado' },
      { name: 'Hora_Salida', type: 'VARCHAR(5)', constraint: 'NOT NULL', description: 'Formato HH:MM' },
      { name: 'Hora_Llegada', type: 'VARCHAR(5)', constraint: 'NOT NULL', description: 'Formato HH:MM' },
      { name: 'Estado', type: 'VARCHAR(30)', constraint: 'DEFAULT \'A tiempo\'', description: 'A tiempo, Retrasado, Abordando, etc.' },
      { name: 'Puerta_Embarque', type: 'VARCHAR(5)', constraint: 'NULL', description: 'Gate asignado en Cusco/Origen' }
    ]
  },
  {
    name: 'Ruta',
    description: 'Planos de vuelo, distancias del trayecto en millas náuticas y tiempos base.',
    icon: 'filter_alt',
    columns: [
      { name: 'ID_Ruta', type: 'INT', constraint: 'PRIMARY KEY', description: 'Identificador de la aerovía' },
      { name: 'ID_Aeropuerto_Origen', type: 'INT', constraint: 'FOREIGN KEY', description: 'Conexión desde' },
      { name: 'ID_Aeropuerto_Destino', type: 'INT', constraint: 'FOREIGN KEY', description: 'Conexión hacia' },
      { name: 'Distancia_Millas', type: 'NUMBER', constraint: 'NOT NULL', description: 'Distancia en millas' },
      { name: 'Tiempo_Estimado_Minutos', type: 'INTEGER', constraint: 'NOT NULL', description: 'Tiempo típico de vuelo' }
    ]
  },
  {
    name: 'Pasajero',
    description: 'Almacena la identidad, nacionalidad y pasaportes de cada usuario.',
    icon: 'person',
    columns: [
      { name: 'ID_Pasajero', type: 'INT', constraint: 'PRIMARY KEY', description: 'ID autogenerable' },
      { name: 'Nombre', type: 'VARCHAR(100)', constraint: 'NOT NULL', description: 'Nombres del pasajero' },
      { name: 'Apellido', type: 'VARCHAR(100)', constraint: 'NOT NULL', description: 'Apellidos del pasajero' },
      { name: 'Nacionalidad', type: 'VARCHAR(50)', constraint: 'NOT NULL', description: 'País del pasaporte' },
      { name: 'Nro_Pasaporte', type: 'VARCHAR(30)', constraint: 'UNIQUE', description: 'Número de documento de viaje' },
      { name: 'Fecha_Nacimiento', type: 'DATE', constraint: 'NULL', description: 'Historial de edad' }
    ]
  },
  {
    name: 'Equipaje',
    description: 'Control de pesaje, balizas del equipaje y tracking de seguridad de bodega.',
    icon: 'luggage',
    columns: [
      { name: 'ID_Equipaje', type: 'INT', constraint: 'PRIMARY KEY', description: 'ID de etiqueta de equipaje' },
      { name: 'ID_Pasajero', type: 'INT', constraint: 'FOREIGN KEY REFERENCES Pasajero', description: 'Dueño del equipaje' },
      { name: 'ID_Vuelo', type: 'INT', constraint: 'FOREIGN KEY REFERENCES Vuelo', description: 'Vuelo asignado' },
      { name: 'Peso_KG', type: 'DECIMAL(5,2)', constraint: 'NOT NULL', description: 'Pesaje oficial báscula' },
      { name: 'Color', type: 'VARCHAR(30)', constraint: 'NULL', description: 'Referencia visual' },
      { name: 'Estado', type: 'VARCHAR(30)', constraint: 'DEFAULT \'Registrado\'', description: 'Registrado, En Tránsito, Entregado, Retenido' }
    ]
  },
  {
    name: 'Empleado',
    description: 'Registra los funcionarios aeroportuarios de Cusco, roles y turnos rotativos.',
    icon: 'badge',
    columns: [
      { name: 'ID_Empleado', type: 'INT', constraint: 'PRIMARY KEY', description: 'Identificador del personal' },
      { name: 'Nombre', type: 'VARCHAR(50)', constraint: 'NOT NULL', description: 'Nombres' },
      { name: 'Apellido', type: 'VARCHAR(50)', constraint: 'NOT NULL', description: 'Apellidos' },
      { name: 'Puesto', type: 'VARCHAR(100)', constraint: 'NOT NULL', description: 'Cargo oficial administrativo' },
      { name: 'Turno', type: 'VARCHAR(20)', constraint: 'NOT NULL', description: 'Mañana, Tarde, Noche' },
      { name: 'ID_Aeropuerto', type: 'INT', constraint: 'FOREIGN KEY REFERENCES Aeropuerto', description: 'Sede laboral asignada' }
    ]
  },
  {
    name: 'Avion',
    description: 'Catálogo físico de las aeronaves asignadas y su estatus de mantenimiento preventivo.',
    icon: 'flight',
    columns: [
      { name: 'ID_Avion', type: 'INT', constraint: 'PRIMARY KEY', description: 'Identificador único de cola' },
      { name: 'Modelo', type: 'VARCHAR(50)', constraint: 'NOT NULL', description: 'Ej: Airbus A320neo / Boeing' },
      { name: 'Capacidad_Pasajeros', type: 'INT', constraint: 'NOT NULL', description: 'Número de asientos disponibles' },
      { name: 'Aerolinea_Propietaria', type: 'VARCHAR(100)', constraint: 'NOT NULL', description: 'Operador afiliado' },
      { name: 'Estado_Mantenimiento', type: 'VARCHAR(30)', constraint: 'DEFAULT \'Operativo\'', description: 'Estatus del avión' }
    ]
  },
  {
    name: 'Ticket',
    description: 'Monitoreo de boletaje, reservas y tarifas de abordaje.',
    icon: 'confirmation_number',
    columns: [
      { name: 'ID_Ticket', type: 'INT', constraint: 'PRIMARY KEY', description: 'Identificador único de ticket' },
      { name: 'ID_Pasajero', type: 'INT', constraint: 'FOREIGN KEY REFERENCES Pasajero', description: 'Pasajero asignado' },
      { name: 'ID_Vuelo', type: 'INT', constraint: 'FOREIGN KEY REFERENCES Vuelo', description: 'Vuelo reservado' },
      { name: 'Asiento', type: 'VARCHAR(5)', constraint: 'NOT NULL', description: 'Estructura fila/letra (ej: 12A)' },
      { name: 'Clase', type: 'VARCHAR(20)', constraint: 'NOT NULL', description: 'Económica, Ejecutiva, Primera' },
      { name: 'Precio', type: 'DECIMAL(10,2)', constraint: 'NOT NULL', description: 'Precio de venta al pasajero' }
    ]
  }
];

export interface LiveStats {
  occupancy: number;
  activeFlights: number;
  dailyRevenue: number;
  flightData24h: number[];
  latestEvents: { id: string; flightNo: string; event: string; minsAgo: number; type: 'success' | 'error' | 'info' }[];
}

export const initialLiveStats: LiveStats = {
  occupancy: 87.4,
  activeFlights: 24,
  dailyRevenue: 124500,
  flightData24h: [40, 60, 80, 50, 90, 30, 70, 100, 60, 45, 55, 75],
  latestEvents: [
    { id: 'ev_1', flightNo: 'LA2021', event: 'Aterrizó con éxito en Pista 01 (Cusco)', minsAgo: 2, type: 'success' },
    { id: 'ev_2', flightNo: 'JA4012', event: 'Retraso de 40 mins reportado en Puerta 05', minsAgo: 15, type: 'error' },
    { id: 'ev_3', flightNo: 'LA2154', event: 'Pasajeros de clase Ejecutiva abordando en Puerta 03', minsAgo: 22, type: 'info' }
  ]
};
