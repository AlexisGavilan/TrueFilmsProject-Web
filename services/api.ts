const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const BACKEND_ORIGIN = RAW_API_URL.replace(/\/api\/?$/, '').replace(/\/+$/, '');
const API_BASE_URL = `${BACKEND_ORIGIN}/api`;

// --- Tipos de Datos (DTOs de Spring Boot) ---
export type MediaType = 'IMAGE' | 'VIDEO';
export type AboutMeImageSlot = 'hero' | 'gallery-1' | 'gallery-2' | 'gallery-3' | 'gallery-4';

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
  bannerImageUrl?: string | null;
  zipFileName?: string;
  expiresAt: string;
}

export interface AdminEvent {
  id: number;
  title: string;
  description?: string;
  eventDate: string;
  accessCode: string;
  bannerImageUrl?: string | null;
  createdAt: string;
  expiresAt: string;
}

export interface CreateEventPayload {
  title: string;
  description?: string;
  eventDate: string;
  accessCode: string;
  expiresAt?: number;
}

export interface Photo {
  id: number;
  fileName: string;
  thumbnailUrl: string;
  originalUrl: string;
  fileSize: number;
}

export interface DiskSpace {
  totalSpaceBytes: number;
  freeSpaceBytes: number;
  usableSpaceBytes: number;
  usedSpaceBytes: number;
  usagePercentage: number;
}


export interface AboutMeData {
  id?: number;
  heroImageUrl: string;
  title: string;
  subtitle: string;
  description: string;
  galleryImages: string[];
}

export interface UpdateAboutMePayload {
  heroImageUrl?: string;
  title: string;
  subtitle?: string;
  description?: string;
  galleryImages: string[];
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
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Código no válido o el evento no existe.');
  }

  return res.json();
}

export async function getEventById(id: string | number): Promise<GalleryEvent> {
  const res = await fetch(`${API_BASE_URL}/events/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Evento no encontrado');
  return res.json();
}

// 2. Genera la URL para descargar el paquete .zip de fotos
export function getDownloadUrlByCode(code: string): string {
  return `${API_BASE_URL}/gallery/${code}/download`;
}

// HU-2.2: Obtener el listado de eventos para la vista admin
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

// HU-3.1: Previsualizacion de Fotos
export async function getEventPhotos(eventId: string | number): Promise<Photo[]> {
  const res = await fetch(`${API_BASE_URL}/events/${eventId}/photos`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al cargar la galería del evento');
  return res.json();
}

// Obtener la URL completa de la imagen desde el backend
export function getImageUrl(endpointPath?: string | null): string {
  if (!endpointPath) return '';
  if (endpointPath.startsWith('http://') || endpointPath.startsWith('https://')) {
    return endpointPath;
  }
  const normalizedPath = endpointPath.startsWith('/') ? endpointPath : `/${endpointPath}`;
  return `${BACKEND_ORIGIN}${normalizedPath}`;
}

// HU-3.2: Seleccion de Fotos
export async function downloadSelectedPhotos(photoIds: number[]): Promise<Blob> {
  const res = await fetch(`${API_BASE_URL}/photos/download-selection`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ photoIds }),
  });

  if (!res.ok) throw new Error('Error al generar el archivo ZIP con la selección');
  return res.blob();
}

// HU3.3: Descarga Personalizada
export async function downloadSinglePhoto(photoId: number): Promise<Blob> {
  const res = await fetch(`${API_BASE_URL}/photos/${photoId}/download`);
  if (!res.ok) throw new Error('Error al descargar la fotografía');
  return res.blob();
}

// HU-4.3
export async function getDiskSpace(): Promise<DiskSpace> {
  const res = await fetch(`${API_BASE_URL}/admin/events/disk-space`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener el espacio en disco');
  return res.json();
}

export async function uploadEventZipFile(eventId: number, file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/admin/events/${eventId}/file`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Error al subir el paquete de fotos');
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Obtener listado público de eventos para las franjas de /events
export async function getEvents(): Promise<GalleryEvent[]> {
  const res = await fetch(`${API_BASE_URL}/events`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al cargar los eventos');
  return res.json();
}

// Asignar o cambiar la imagen del banner de un evento ya creado
export async function uploadEventBannerFile(
  id: number | string,
  file: File
): Promise<AdminEvent> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/events/${id}/banner`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Error al subir la imagen del banner');
  }

  return res.json();
}

// Sprint 6: Obtener la configuración pública de "Sobre mí"
export async function getAboutMe(): Promise<AboutMeData> {
  const res = await fetch(`${API_BASE_URL}/about-me`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al cargar la información de Sobre mí');
  return res.json();
}

// Sprint 6 (Admin): Actualizar textos y/o URLs de "Sobre mí"
export async function updateAboutMe(payload: UpdateAboutMePayload): Promise<AboutMeData> {
  const res = await fetch(`${API_BASE_URL}/admin/about-me`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error al actualizar la información de Sobre mí');
  return res.json();
}

// Sprint 6 (Admin): Subir imagen para uno de los 5 slots (hero, gallery-1..4)
export async function uploadAboutMeImage(
  slot: AboutMeImageSlot,
  file: File
): Promise<AboutMeData> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/admin/about-me/images/${slot}`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Error al subir la imagen del slot ${slot}`);
  }

  return res.json();
}