/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Definición de tipos para AeroGest Cusco

export interface DashboardStats {
  total_vuelos: number;
  vuelos_programados: number;
  vuelos_retrasados: number;
  vuelos_cancelados: number;
  vuelos_aterrizados: number;
  total_pasajeros: number;
  total_boletos: number;
  total_equipajes: number;
}

export interface Vuelo {
  id: string; // SKU / Código
  codigo: string;
  aerolina: string;
  origen: string;
  destino: string;
  salida: string;
  llegada: string;
  puerta: string;
  estado: 'Programado' | 'En Vuelo' | 'Retrasados' | 'Retrasado' | 'Aterrizado' | 'Completados' | 'Completado' | 'Cancelado';
  hora_salida_real?: string; // para casos de retraso
}

export interface Pasajero {
  id: string;
  nombres: string;
  apellidos: string;
  tipo_documento: 'DNI' | 'PASAPORTE' | 'C.E.';
  documento: string;
  nacionalidad: string;
  telefono: string;
  correo: string;
}

export interface Boleto {
  id: string; // Código boleto
  codigo_boleto: string;
  pasajero_id: string;
  pasajero_nombre: string;
  pasajero_avatar_iniciales: string;
  vuelo_codigo: string;
  asiento: string;
  precio: number;
  estado: 'Confirmado' | 'Pendiente' | 'Cancelado';
}

export interface Equipaje {
  id: string; // Código equipaje, ej. CUZ-8492-A
  codigo_equipaje: string;
  pasajero_id: string;
  pasajero_nombre: string;
  codigo_boleto: string;
  peso: number;
  estado: 'En Tránsito' | 'Entregado' | 'Perdido';
}

export interface Incidencia {
  id: string;
  vuelo_id?: string;
  equipaje_id?: string;
  descripcion: string;
  estado: 'Abierta' | 'En Proceso' | 'Resuelta';
  fecha_reporte: string;
  fecha_resolucion?: string;
}
