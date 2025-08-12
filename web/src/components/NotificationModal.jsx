import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { notificationsAPI } from '../services/api';
import { validateNotification } from '@belyanimda/shared';

const NotificationModal = ({ isOpen, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
  });
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        url: '',
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
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
    
    const validation = validateNotification(formData);
    if (!validation.valid) {
      if (formData.title.trim().length === 0) {
        newErrors.title = 'Başlık gereklidir';
      }
      if (formData.url && formData.url.trim().length > 0) {
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

    setSending(true);
    
    try {
      // Only send non-empty fields
      const payload = {
        title: formData.title.trim(),
      };
      
      if (formData.description.trim()) {
        payload.description = formData.description.trim();
      }
      
      if (formData.url.trim()) {
        payload.url = formData.url.trim();
      }

      const response = await notificationsAPI.create(payload);
      
      if (response.success) {
        toast.success('Bildirim başarıyla gönderildi');
        onSaved();
      } else {
        toast.error(response.message || 'Bildirim gönderilemedi');
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
      toast.error('Bildirim gönderilirken hata oluştu');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    if (!sending) {
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
              Yeni Bildirim Gönder
            </h2>
            <button
              onClick={handleClose}
              disabled={sending}
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
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Başlık *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`input-field ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Bildirim başlığını girin"
              disabled={sending}
              maxLength={100}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.title.length}/100 karakter
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="input-field resize-none"
              placeholder="Opsiyonel açıklama girin"
              disabled={sending}
              maxLength={300}
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.description.length}/300 karakter
            </p>
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              Bağlantı URL
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              className={`input-field ${errors.url ? 'border-red-500' : ''}`}
              placeholder="https://example.com"
              disabled={sending}
            />
            {errors.url && (
              <p className="mt-1 text-sm text-red-600">{errors.url}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Kullanıcılar bildirimi tıkladığında açılacak sayfa (opsiyonel)
            </p>
          </div>

          {/* Preview */}
          {formData.title && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Önizleme</h4>
              <div className="bg-white p-3 rounded border shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-blue-100 rounded">
                    <span className="text-blue-600 text-sm">🔔</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {formData.title}
                    </p>
                    {formData.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {formData.description}
                      </p>
                    )}
                    {formData.url && (
                      <p className="text-xs text-blue-600 mt-1">
                        Detayları görüntüle →
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={sending}
              className="btn-secondary"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={sending || !formData.title.trim()}
              className="btn-primary min-w-[120px]"
            >
              {sending ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Gönderiliyor...
                </div>
              ) : (
                '📢 Gönder'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationModal;
