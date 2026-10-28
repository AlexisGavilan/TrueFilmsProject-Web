'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Photo, getImageUrl, downloadSelectedPhotos } from '@/services/api';

interface PhotoGalleryProps {
  photos: Photo[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);

  const toggleSelectAll = () => {
    if (selectedIds.length === photos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(photos.map((p) => p.id));
    }
  };

  const toggleSelectPhoto = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDownloadSelection = async () => {
    if (selectedIds.length === 0) return;

    try {
      setIsDownloading(true);
      const blob = await downloadSelectedPhotos(selectedIds);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'selected-photos.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || 'Error downloading selection');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="pb-20">
      {/* Botón de selección masiva */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleSelectAll}
          className="text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg transition"
        >
          {selectedIds.length === photos.length ? 'Deseleccionar todas' : 'Seleccionar todas'}
        </button>
      </div>

      {/* Grid de Miniaturas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {photos.map((photo) => {
          const isSelected = selectedIds.includes(photo.id);
          return (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className={`group relative aspect-square bg-slate-800 rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 border-2 ${
                isSelected ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-transparent'
              }`}
            >
              <img
                src={getImageUrl(photo.thumbnailUrl)}
                alt={photo.fileName}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Checkbox de selección */}
              <div className="absolute top-2 left-2 z-10" onClick={(e) => toggleSelectPhoto(photo.id, e)}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}} // Manejado por el onClick del contenedor superior
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer shadow-md"
                />
              </div>

              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full">
                  🔍 Ver
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Barra Flotante de Acciones */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-neutral-900 border border-neutral-700 text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-6 z-50 animate-fade-in">
          <span className="text-sm font-medium text-neutral-300">
            <strong className="text-white">{selectedIds.length}</strong> foto(s) seleccionada(s)
          </span>
          <button
            onClick={handleDownloadSelection}
            disabled={isDownloading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-full text-sm transition shadow disabled:opacity-50"
          >
            {isDownloading ? 'Generando ZIP...' : '📦 Descargar Selección (.zip)'}
          </button>
        </div>
      )}

      {/* Modal / Lightbox para Previsualización en Alta Calidad */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón Cerrar */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl font-bold"
            >
              ✕ Cerrar
            </button>

            {/* Imagen Principal */}
            <img
              src={getImageUrl(selectedPhoto.originalUrl)}
              alt={selectedPhoto.fileName}
              className="max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl"
            />

            {/* Info Pie de Foto */}
            <div className="mt-3 text-slate-300 text-sm font-mono">
              {selectedPhoto.fileName}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}