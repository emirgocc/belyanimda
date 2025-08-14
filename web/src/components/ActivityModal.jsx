import React, { useState, useEffect } from 'react';

const ActivityModal = ({ activity, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        startDate: '',
        endDate: '',
        department: '',
        active: true
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (activity) {
            setFormData({
                name: activity.name || '',
                location: activity.location || '',
                startDate: activity.startDate || '',
                endDate: activity.endDate || '',
                department: activity.department || '',
                active: activity.active !== undefined ? activity.active : true
            });
        } else {
            // Yeni faaliyet için bugünün tarihini varsayılan olarak ayarla
            const today = new Date().toISOString().split('T')[0];
            setFormData({
                name: '',
                location: '',
                startDate: today,
                endDate: '',
                department: '',
                active: true
            });
        }
        setErrors({});
    }, [activity]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Faaliyet adı gereklidir';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Faaliyet yeri gereklidir';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Başlangıç tarihi gereklidir';
        }

        if (!formData.endDate) {
            newErrors.endDate = 'Bitiş tarihi gereklidir';
        }

        if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
            newErrors.endDate = 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır';
        }

        if (!formData.department.trim()) {
            newErrors.department = 'Müdürlük bilgisi gereklidir';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const setToday = () => {
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({ ...prev, startDate: today }));
        if (errors.startDate) {
            setErrors(prev => ({ ...prev, startDate: '' }));
        }
    };

    const departments = [
        'Fen İşleri Müdürlüğü',
        'Park ve Bahçeler Müdürlüğü',
        'İmar ve Şehircilik Müdürlüğü',
        'Çevre Koruma Müdürlüğü',
        'Sosyal Hizmetler Müdürlüğü',
        'Kültür ve Turizm Müdürlüğü',
        'Spor Müdürlüğü',
        'İtfaiye Müdürlüğü',
        'Zabıta Müdürlüğü',
        'Temizlik İşleri Müdürlüğü',
        'Diğer'
    ];

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            {activity ? 'Faaliyet Düzenle' : 'Yeni Faaliyet Ekle'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Faaliyet Adı */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Faaliyet Adı *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Örn: Yol Çalışması - Merkez Mahalle"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Faaliyet Yeri */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Faaliyet Yeri *
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.location ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Örn: Merkez Mahalle, Ana Caddesi"
                            />
                            {errors.location && (
                                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                            )}
                        </div>

                        {/* Başlangıç Tarihi */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Başlangıç Tarihi *
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.startDate ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={setToday}
                                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
                                >
                                    Bugün
                                </button>
                            </div>
                            {errors.startDate && (
                                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                            )}
                        </div>

                        {/* Bitiş Tarihi */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bitiş Tarihi *
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.endDate && (
                                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                            )}
                        </div>

                        {/* Müdürlük */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Müdürlük *
                            </label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.department ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Müdürlük seçiniz</option>
                                {departments.map((dept, index) => (
                                    <option key={index} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                            </select>
                            {errors.department && (
                                <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                            )}
                        </div>

                        {/* Aktif/Pasif */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">
                                Faaliyet aktif
                            </label>
                        </div>

                        {/* Butonlar */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
                            >
                                {activity ? 'Güncelle' : 'Ekle'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ActivityModal;
