export interface Aeropuerto {
  ID_Aeropuerto: number;
  Nombre_Aero: string;
  Ciudad: string;
  Codigo_IATA: string;
}

export interface Aerolinea {
  ID_Aerolinea: number;
  Nombre_AeroLineae: string;
  Pais: string;
  Codigo_IATA: string;
}

export interface Vuelo {
  ID_Vuelo: number;
  Numero_Vuelo: string;
  ID_Aeropuerto_Origen: number;
  ID_Aeropuerto_Destino: number;
  ID_Aerolinea: number;
  ID_Avion: number;
  Hora_Salida: string;
  Hora_Llegada: string;
  Estado: 'A tiempo' | 'Retrasado' | 'Abordando' | 'Cancelado' | 'Aterrizado';
  Puerta_Embarque: string;
}

export interface Ruta {
  ID_Ruta: number;
  ID_Aeropuerto_Origen: number;
  ID_Aeropuerto_Destino: number;
  Distancia_Millas: number;
  Tiempo_Estimado_Minutos: number;
}

export interface Pasajero {
  ID_Pasajero: number;
  Nombre: string;
  Apellido: string;
  Nacionalidad: string;
  Nro_Pasaporte: string;
  Fecha_Nacimiento: string;
}

export interface Equipaje {
  ID_Equipaje: number;
  ID_Pasajero: number;
  ID_Vuelo: number;
  Peso_KG: number;
  Color: string;
  Estado: 'Registrado' | 'En Tránsito' | 'Entregado' | 'Retenido';
}

export interface Empleado {
  ID_Empleado: number;
  Nombre: string;
  Apellido: string;
  Puesto: string;
  Turno: 'Mañana' | 'Tarde' | 'Noche';
  ID_Aeropuerto: number;
}

export interface Avion {
  ID_Avion: number;
  Modelo: string;
  Capacidad_Pasajeros: number;
  Aerolinea_Propietaria: string;
  Estado_Mantenimiento: 'Operativo' | 'En Mantenimiento' | 'Revisión Necesaria';
}

export interface Ticket {
  ID_Ticket: number;
  ID_Pasajero: number;
  ID_Vuelo: number;
  Asiento: string;
  Clase: 'Económica' | 'Ejecutiva' | 'Primera';
  Precio: number;
}

export interface TableMeta {
  name: string;
  description: string;
  icon: string;
  columns: { name: string; type: string; constraint: string; description: string }[];
}

export interface LogEvent {
  id: string;
  timestamp: string;
  title: string;
  type: 'info' | 'warning' | 'success' | 'error';
  category: string;
}

export interface AISuggestionResponse {
  sql: string;
  explanation: string;
  linq: string;
  insights: string;
}
