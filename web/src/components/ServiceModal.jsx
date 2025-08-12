import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { servicesAPI } from '../services/api';
import { validateService } from '@belyanimda/shared';

const ServiceModal = ({ isOpen, onClose, service, onSaved }) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    url: '',
    active: true,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        icon: service.icon || '',
        url: service.url || '',
        active: service.active !== undefined ? service.active : true,
      });
    } else {
      setFormData({
        name: '',
        icon: '',
        url: '',
        active: true,
      });
    }
    setErrors({});
  }, [service, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const validation = validateService(formData);
    if (!validation.valid) {
      if (formData.name.trim().length === 0) {
        newErrors.name = 'Hizmet adı gereklidir';
      }
      if (formData.url.trim().length === 0) {
        newErrors.url = 'Hizmet URL\'si gereklidir';
      } else {
        try {
          new URL(formData.url);
        } catch {
          newErrors.url = 'Geçerli bir URL girin';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    
    try {
      let response;
      if (service) {
        response = await servicesAPI.update(service.id, formData);
      } else {
        response = await servicesAPI.create(formData);
      }
      
      if (response.success) {
        toast.success(service ? 'Hizmet güncellendi' : 'Hizmet eklendi');
        onSaved();
      } else {
        toast.error(response.message || 'İşlem başarısız');
      }
    } catch (error) {
      console.error('Failed to save service:', error);
      toast.error('Hizmet kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {service ? 'Hizmet Düzenle' : 'Yeni Hizmet Ekle'}
            </h2>
            <button
              onClick={handleClose}
              disabled={saving}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Hizmet Adı *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`input-field ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Örn: Güngören Akademi"
              disabled={saving}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-2">
              İkon URL
            </label>
            <input
              type="url"
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              className="input-field"
              placeholder="https://example.com/icon.png"
              disabled={saving}
            />
            <p className="mt-1 text-xs text-gray-500">
              Önerilen boyut: 64x64 piksel
            </p>
            {formData.icon && (
              <div className="mt-2">
                <img
                  src={formData.icon}
                  alt="İkon önizleme"
                  className="w-16 h-16 rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              Hizmet URL *
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              className={`input-field ${errors.url ? 'border-red-500' : ''}`}
              placeholder="https://example.com"
              disabled={saving}
            />
            {errors.url && (
              <p className="mt-1 text-sm text-red-600">{errors.url}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              disabled={saving}
            />
            <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
              Hizmet aktif
            </label>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="btn-secondary"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary min-w-[100px]"
            >
              {saving ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Kaydediliyor...
                </div>
              ) : (
                service ? 'Güncelle' : 'Ekle'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;
