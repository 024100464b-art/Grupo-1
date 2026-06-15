import { createClient } from '@supabase/supabase-js';
import { Vuelo, Pasajero, Boleto, Equipaje, Incidencia, DashboardStats } from './types';

// Obtener las credenciales desde las variables de entorno
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// Inicializar de manera segura para evitar caídas si faltan las variables de entorno
export const hasSupabaseConfig = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey.trim() !== '' &&
  !supabaseUrl.includes('YOUR_SUPABASE_URL') &&
  !supabaseAnonKey.includes('YOUR_ANON_KEY')
);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Logs de estado de la conexión en Cusco AeroGest
console.log(
  hasSupabaseConfig
    ? '📡 [AeroGest Cusco] Conectado exitosamente al servicio de base de datos Supabase.'
    : '⚠️ [AeroGest Cusco] Credenciales de Supabase no configuradas.'
);

// --- SISTEMA DE CONSULTA POR VISTAS DE SUPABASE SIN CONEXIÓN DE RESPALDO MOCK ---

// Mapeadores defensivos para evitar caídas catastróficas de tipos en Cusco AeroGest
function mapVuelo(item: any): Vuelo {
  const aerolinaVal = item.aerolina || item.aerolinea || item.aerolínea || 'Desconocida';
  return {
    id: String(item.id || item.codigo || ''),
    codigo: String(item.codigo || item.codigo_vuelo || item.vuelo_codigo || ''),
    aerolina: aerolinaVal,
    origen: String(item.origen || 'CUS'),
    destino: String(item.destino || 'LIM'),
    salida: String(item.salida || item.hora_salida || item.fecha_salida || '--:--'),
    llegada: String(item.llegada || item.hora_llegada || item.fecha_llegada || '--:--'),
    puerta: String(item.puerta || item.puerta_embarque || '-'),
    estado: item.estado || item.estado_vuelo || 'Programado',
    hora_salida_real: item.hora_salida_real || undefined,
  };
}

function mapPasajero(item: any): Pasajero {
  return {
    id: String(item.id || ''),
    nombres: String(item.nombres || item.nombre || ''),
    apellidos: String(item.apellidos || item.apellido || ''),
    tipo_documento: item.tipo_documento || 'DNI',
    documento: String(item.documento || item.num_documento || ''),
    nacionalidad: String(item.nacionalidad || ''),
    telefono: String(item.telefono || item.celular || ''),
    correo: String(item.correo || item.email || ''),
  };
}

function mapBoleto(item: any): Boleto {
  const pNombre = String(item.pasajero_nombre || item.pasajero_nombres || item.nombre_pasajero || 'Pasajero');
  const iniciales = pNombre
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'PS';

  return {
    id: String(item.id || item.codigo_boleto || ''),
    codigo_boleto: String(item.codigo_boleto || item.id || ''),
    pasajero_id: String(item.pasajero_id || ''),
    pasajero_nombre: pNombre,
    pasajero_avatar_iniciales: item.pasajero_avatar_iniciales || iniciales,
    vuelo_codigo: String(item.vuelo_codigo || item.codigo_vuelo || ''),
    asiento: String(item.asiento || '-'),
    precio: Number(item.precio || 0),
    estado: item.estado || 'Confirmado',
  };
}

function mapEquipaje(item: any): Equipaje {
  return {
    id: String(item.id || item.codigo_equipaje || ''),
    codigo_equipaje: String(item.codigo_equipaje || item.id || ''),
    pasajero_id: String(item.pasajero_id || ''),
    pasajero_nombre: String(item.pasajero_nombre || item.pasajero_nombres || item.nombre_pasajero || 'Pasajero'),
    codigo_boleto: String(item.codigo_boleto || ''),
    peso: Number(item.peso || 0),
    estado: item.estado || 'En Tránsito',
  };
}

/**
 * Obtiene el resumen para el dashboard.
 * Utiliza la vista 'vista_dashboard'.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error('Falta configurar la conexión con Supabase');
  }

  const { data, error } = await supabase.from('vista_dashboard').select('*');
  if (error) {
    console.error('Error al obtener vista_dashboard:', error);
    throw error;
  }

  // Manejar si retorna array o un solo objeto
  const item = Array.isArray(data) ? data[0] : data;
  if (!item) {
    return {
      total_vuelos: 0,
      vuelos_programados: 0,
      vuelos_retrasados: 0,
      vuelos_cancelados: 0,
      vuelos_aterrizados: 0,
      total_pasajeros: 0,
      total_boletos: 0,
      total_equipajes: 0,
    };
  }

  return {
    total_vuelos: Number(item.total_vuelos || 0),
    vuelos_programados: Number(item.vuelos_programados || item.programados || 0),
    vuelos_retrasados: Number(item.vuelos_retrasados || item.retrasados || 0),
    vuelos_cancelados: Number(item.vuelos_cancelados || item.cancelados || 0),
    vuelos_aterrizados: Number(item.vuelos_aterrizados || item.aterrizados || 0),
    total_pasajeros: Number(item.total_pasajeros || item.pasajeros || 0),
    total_boletos: Number(item.total_boletos || item.boletos || 0),
    total_equipajes: Number(item.total_equipajes || item.equipajes || 0),
  };
}

/**
 * Obtiene la lista de vuelos.
 * Utiliza la vista 'vista_vuelos'.
 */
export async function getVuelos(): Promise<Vuelo[]> {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error('Falta configurar la conexión con Supabase');
  }

  const { data, error } = await supabase.from('vista_vuelos').select('*');
  if (error) {
    console.error('Error al obtener vista_vuelos:', error);
    throw error;
  }
  return (data || []).map(mapVuelo);
}

/**
 * Obtiene los pasajeros.
 * Utiliza la vista 'vista_pasajeros'.
 */
export async function getPasajeros(): Promise<Pasajero[]> {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error('Falta configurar la conexión con Supabase');
  }

  const { data, error } = await supabase.from('vista_pasajeros').select('*');
  if (error) {
    console.error('Error al obtener vista_pasajeros:', error);
    throw error;
  }
  return (data || []).map(mapPasajero);
}

/**
 * Obtiene los boletos.
 * Utiliza la vista 'vista_boletos'.
 */
export async function getBoletos(): Promise<Boleto[]> {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error('Falta configurar la conexión con Supabase');
  }

  const { data, error } = await supabase.from('vista_boletos').select('*');
  if (error) {
    console.error('Error al obtener vista_boletos:', error);
    throw error;
  }
  return (data || []).map(mapBoleto);
}

/**
 * Obtiene el equipaje.
 * Utiliza la vista 'vista_equipajes'.
 */
export async function getEquipajes(): Promise<Equipaje[]> {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error('Falta configurar la conexión con Supabase');
  }

  const { data, error } = await supabase.from('vista_equipajes').select('*');
  if (error) {
    console.error('Error al obtener vista_equipajes:', error);
    throw error;
  }
  return (data || []).map(mapEquipaje);
}

// --- OPERACIONES DE CREACIÓN EN TABLAS REALES ---

export async function addVuelo(vuelo: Omit<Vuelo, 'id'>): Promise<Vuelo> {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error('Falta configurar la conexión con Supabase');
  }

  const { data, error } = await supabase.from('vuelos').insert([vuelo]).select().single();
  if (error) {
    console.error('Error al insertar vuelo:', error);
    throw error;
  }
  return data as Vuelo;
}

export async function addPasajero(pasajero: Omit<Pasajero, 'id'>): Promise<Pasajero> {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error('Falta configurar la conexión con Supabase');
  }

  const { data, error } = await supabase.from('pasajeros').insert([pasajero]).select().single();
  if (error) {
    console.error('Error al insertar pasajero:', error);
    throw error;
  }
  return data as Pasajero;
}

export async function addBoleto(boleto: Omit<Boleto, 'id' | 'pasajero_avatar_iniciales'>): Promise<Boleto> {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error('Falta configurar la conexión con Supabase');
  }

  const { data, error } = await supabase.from('boletos').insert([boleto]).select().single();
  if (error) {
    console.error('Error al insertar boleto:', error);
    throw error;
  }
  // Enriquecer con avatar de ser necesario en el cliente
  const iniciales = (data.pasajero_nombre || '')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return {
    ...data,
    pasajero_avatar_iniciales: data.pasajero_avatar_iniciales || iniciales
  } as Boleto;
}

export async function addEquipaje(equipaje: Omit<Equipaje, 'id'>): Promise<Equipaje> {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error('Falta configurar la conexión con Supabase');
  }

  const { data, error } = await supabase.from('equipajes').insert([equipaje]).select().single();
  if (error) {
    console.error('Error al insertar equipaje:', error);
    throw error;
  }
  return data as Equipaje;
}

// --- OPERACIONES DE ACTUALIZACIÓN ---

export async function updateEstadoVuelo(
  id: string,
  nuevoEstado: Vuelo['estado'],
  nuevaPuerta?: string
): Promise<Vuelo> {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error('Falta configurar la conexión con Supabase');
  }

  const payload: Partial<Pick<Vuelo, 'estado' | 'puerta'>> = { estado: nuevoEstado };
  if (nuevaPuerta !== undefined) {
    payload.puerta = nuevaPuerta;
  }

  const { data, error } = await supabase
    .from('vuelos')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar estado del vuelo:', error);
    throw error;
  }
  return data as Vuelo;
}

export async function updateEstadoEquipaje(
  id: string,
  nuevoEstado: Equipaje['estado']
): Promise<Equipaje> {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error('Falta configurar la conexión con Supabase');
  }

  const { data, error } = await supabase
    .from('equipajes')
    .update({ estado: nuevoEstado })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar estado del equipaje:', error);
    throw error;
  }
  return data as Equipaje;
}

export async function resolverIncidencia(id: string): Promise<Incidencia> {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error('Falta configurar la conexión con Supabase');
  }

  const { data, error } = await supabase
    .from('incidencias')
    .update({
      estado: 'Resuelta',
      fecha_resolucion: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error al resolver incidencia:', error);
    throw error;
  }
  return data as Incidencia;
}

export function resetLocalDatabase() {
  console.log('Restablecimiento desactivado para base de datos Supabase.');
}
