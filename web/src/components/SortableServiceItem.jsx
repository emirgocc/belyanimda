import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatDate } from '@belyanimda/shared';

const SortableServiceItem = ({ service, onEdit, onDelete, onToggleActive, disabled }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-gray-200 rounded-lg p-4 ${
        isDragging ? 'shadow-lg z-10' : 'hover:shadow-sm'
      } transition-shadow`}
    >
      <div className="flex items-center space-x-4">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className={`cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-gray-600 ${
            disabled ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4a1 1 0 011-1h4m0 0V2m0 1h3m0 0V2m0 1h4a1 1 0 011 1v4M9 9h6m-6 4h6" />
          </svg>
        </div>

        {/* Service Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            {service.icon ? (
              <img
                src={service.icon}
                alt={service.name}
                className="w-8 h-8 rounded"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : null}
            <span
              className={`text-gray-400 text-lg ${service.icon ? 'hidden' : ''}`}
            >
              🛠️
            </span>
          </div>
        </div>

        {/* Service Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {service.name}
            </h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                service.active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {service.active ? 'Aktif' : 'Pasif'}
            </span>
            <span className="text-xs text-gray-500">
              Sıra: {service.order}
            </span>
          </div>
          <p className="text-sm text-gray-600 truncate mt-1">
            {service.url}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Son güncelleme: {formatDate(service.updatedAt)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleActive(service)}
            className={`p-2 rounded-lg text-sm font-medium transition-colors ${
              service.active
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
            title={service.active ? 'Devre dışı bırak' : 'Etkinleştir'}
          >
            {service.active ? '❌' : '✅'}
          </button>
          
          <button
            onClick={() => onEdit(service)}
            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            title="Düzenle"
          >
            ✏️
          </button>
          
          <button
            onClick={() => onDelete(service)}
            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            title="Sil"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortableServiceItem;
