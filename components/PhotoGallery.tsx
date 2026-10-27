'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Photo, getImageUrl } from '@/services/api';

interface PhotoGalleryProps {
  photos: Photo[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <div>
      {/* Grid de Miniaturas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative aspect-square bg-slate-800 rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img
              src={getImageUrl(photo.thumbnailUrl)}
              alt={photo.fileName}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full">
                🔍 Ver
              </span>
            </div>
          </div>
        ))}
      </div>

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