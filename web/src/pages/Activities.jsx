import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import ActivityModal from '../components/ActivityModal';

const Activities = () => {
    const { user } = useAuth();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/activities');
            if (response.data.success) {
                setActivities(response.data.data);
            }
        } catch (error) {
            setError('Faaliyetler yüklenirken hata oluştu');
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingActivity(null);
        setShowModal(true);
    };

    const handleEdit = (activity) => {
        setEditingActivity(activity);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu faaliyeti silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            const response = await api.delete(`/api/activities/${id}`);
            if (response.data.success) {
                fetchActivities();
            }
        } catch (error) {
            setError('Faaliyet silinirken hata oluştu');
            console.error('Error deleting activity:', error);
        }
    };

    const handleToggleActive = async (id) => {
        try {
            const response = await api.put(`/api/activities/${id}/toggle`);
            if (response.data.success) {
                fetchActivities();
            }
        } catch (error) {
            setError('Faaliyet durumu güncellenirken hata oluştu');
            console.error('Error toggling activity:', error);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingActivity(null);
    };

    const handleModalSubmit = async (activityData) => {
        try {
            if (editingActivity) {
                await api.put(`/api/activities/${editingActivity.id}`, activityData);
            } else {
                await api.post('/api/activities', activityData);
            }
            fetchActivities();
            handleModalClose();
        } catch (error) {
            setError('Faaliyet kaydedilirken hata oluştu');
            console.error('Error saving activity:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('tr-TR');
    };

    const getStatusBadge = (active) => {
        return active ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Aktif
            </span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Pasif
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Faaliyet Panosu</h1>
                    <button
                        onClick={handleCreate}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        Yeni Faaliyet Ekle
                    </button>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                        <button
                            onClick={() => setError('')}
                            className="float-right font-bold text-red-700 hover:text-red-900"
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {activities.length === 0 ? (
                            <li className="px-6 py-8 text-center text-gray-500">
                                Henüz faaliyet bulunmuyor
                            </li>
                        ) : (
                            activities.map((activity) => (
                                <li key={activity.id} className="px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    {getStatusBadge(activity.active)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {activity.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        📍 {activity.location}
                                                    </p>
                                                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                                        <span>📅 Başlangıç: {formatDate(activity.startDate)}</span>
                                                        <span>📅 Bitiş: {formatDate(activity.endDate)}</span>
                                                        <span>🏢 {activity.department}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleToggleActive(activity.id)}
                                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${
                                                    activity.active
                                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                }`}
                                            >
                                                {activity.active ? 'Pasif Yap' : 'Aktif Yap'}
                                            </button>
                                            <button
                                                onClick={() => handleEdit(activity)}
                                                className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors duration-200"
                                            >
                                                Düzenle
                                            </button>
                                            <button
                                                onClick={() => handleDelete(activity.id)}
                                                className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors duration-200"
                                            >
                                                Sil
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

            {showModal && (
                <ActivityModal
                    activity={editingActivity}
                    onClose={handleModalClose}
                    onSubmit={handleModalSubmit}
                />
            )}
        </div>
    );
};

export default Activities;
