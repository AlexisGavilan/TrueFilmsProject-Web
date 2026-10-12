const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// --- Tipos de Datos (DTOs de Spring Boot) ---
export type MediaType = 'IMAGE' | 'VIDEO';

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: MediaType;
  displayOrder: number;
}

export interface Film {
  id: number;
  title: string;
  synopsis: string;
  videoUrl: string;
  thumbnailUrl: string;
  releaseYear: number;
  durationMinutes: number;
}

export interface GalleryEvent {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  accessCode: string;
  zipFileName?: string;
}

export interface AdminEvent {
  id: number;
  title: string;
  description?: string;
  eventDate: string;
  accessCode: string;
  createdAt: string;
}

export interface CreateEventPayload {
  title: string;
  description?: string;
  eventDate: string;
  accessCode: string;
}

// --- Peticiones HTTP ---

// HU-1.2: Obtener ítems del portfolio
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const res = await fetch(`${API_BASE_URL}/portfolio`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al cargar la galería de presentación');
  return res.json();
}

// HU-1.3: Obtener el catálogo de cortometrajes
export async function getFilms(): Promise<Film[]> {
  const res = await fetch(`${API_BASE_URL}/films`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al cargar los cortometrajes');
  return res.json();
}

// HU-1.3: Obtener el detalle de un cortometraje específico
export async function getFilmById(id: number): Promise<Film> {
  const res = await fetch(`${API_BASE_URL}/films/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al cargar la información del cortometraje');
  return res.json();
}

// 1. Consulta el evento por código de acceso privado (HU-2.1)
export async function getGalleryByCode(code: string): Promise<GalleryEvent> {
  const res = await fetch(`${API_BASE_URL}/gallery/${code}`, { 
    cache: 'no-store' 
  });
  
  if (!res.ok) {
    throw new Error('Código no válido o el evento no existe.');
  }
  
  return res.json();
}

// 2. Genera la URL para descargar el paquete .zip de fotos
export function getDownloadUrlByCode(code: string): string {
  return `${API_BASE_URL}/gallery/${code}/download`;
}


//HU-2.2: Obtener el listado de eventos para la vista admin
// Obtener eventos para la vista admin
export async function getAdminEvents(): Promise<AdminEvent[]> {
  const res = await fetch(`${API_BASE_URL}/admin/events`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener los eventos');
  return res.json();
}

// Crear un nuevo evento
export async function createAdminEvent(payload: CreateEventPayload): Promise<AdminEvent> {
  const res = await fetch(`${API_BASE_URL}/admin/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error al crear el evento');
  return res.json();
}

// Actualizar código de acceso
export async function updateEventAccessCode(id: number, newAccessCode: string): Promise<AdminEvent> {
  const res = await fetch(`${API_BASE_URL}/admin/events/${id}/code`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newAccessCode }),
  });
  if (!res.ok) throw new Error('Error al actualizar el código de acceso');
  return res.json();
}

// Eliminar un evento
export async function deleteAdminEvent(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/events/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar el evento');
}