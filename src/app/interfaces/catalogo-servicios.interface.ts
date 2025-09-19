export interface Orden {
  id: number;
  order_name: string;
  required_points: number;
}

export interface ServicioCatalogo {
  id: number;
  service_name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  order: Orden;
}

export interface CrearServicioRequest {
  service_name: string;
  orden_id: number;
}

export interface ActualizarServicioRequest {
  service_name?: string;
  orden_id?: number;
}
