export interface OrdenDisponible {
  id: number;
  order_name: string;
  required_points: number;
  services: ServicioDisponible[];
}

export interface ServicioDisponible {
  id: number;
  service_name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ServicioCompleto {
  id: number;
  service_name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  order: {
    id: number;
    order_name: string;
    required_points: number;
  };
}

export interface AsignacionServicio {
  ciudadano_id: number;
  service_id: number;
  start_date: string;
  service_status: 'en_curso' | 'completado' | 'inconcluso';
  observations: string;
}

export interface FinalizacionServicio {
  service_status: 'completado' | 'inconcluso';
  end_date: string;
}
