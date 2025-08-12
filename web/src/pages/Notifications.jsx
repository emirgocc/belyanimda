import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { notificationsAPI } from '../services/api';
import { formatDate } from '@belyanimda/shared';
import NotificationModal from '../components/NotificationModal';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationsAPI.getAll();
      if (response.success) {
        const sortedNotifications = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sortedNotifications);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      toast.error('Bildirimler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = () => {
    setModalOpen(true);
  };

  const handleDeleteNotification = async (notification) => {
    if (!window.confirm(`"${notification.title}" bildirimini silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      const response = await notificationsAPI.delete(notification.id);
      if (response.success) {
        toast.success('Bildirim başarıyla silindi');
        loadNotifications();
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Bildirim silinirken hata oluştu');
    }
  };

  const handleNotificationSaved = () => {
    setModalOpen(false);
    loadNotifications();
  };

  const NotificationItem = ({ notification }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-medium text-gray-900">
              {notification.title}
            </h3>
            {notification.url && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                🔗 Link var
              </span>
            )}
          </div>
          
          {notification.description && (
            <p className="text-gray-600 mb-3">
              {notification.description}
            </p>
          )}
          
          {notification.url && (
            <div className="mb-3">
              <p className="text-sm text-gray-500">Bağlantı:</p>
              <a
                href={notification.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
              >
                {notification.url}
              </a>
            </div>
          )}
          
          <p className="text-sm text-gray-500">
            Gönderildi: {formatDate(notification.createdAt)}
          </p>
        </div>
        
        <button
          onClick={() => handleDeleteNotification(notification)}
          className="ml-4 p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          title="Bildirim Sil"
        >
          🗑️
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bildirimler</h1>
          <p className="text-gray-600 mt-1">
            Mobil uygulama kullanıcılarına gönderilen bildirimler
          </p>
        </div>
        <button
          onClick={handleCreateNotification}
          className="btn-primary"
        >
          📢 Yeni Bildirim
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600">📊</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Toplam</p>
              <p className="text-lg font-semibold">{notifications.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600">📅</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Bu Ay</p>
              <p className="text-lg font-semibold">
                {notifications.filter(n => {
                  const notifDate = new Date(n.createdAt);
                  const now = new Date();
                  return notifDate.getMonth() === now.getMonth() && 
                         notifDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-purple-600">🔗</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Bağlantılı</p>
              <p className="text-lg font-semibold">
                {notifications.filter(n => n.url).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-3xl">🔔</span>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Henüz bildirim gönderilmemiş
            </h3>
            <p className="mt-2 text-gray-600">
              İlk bildiriminizi göndermek için yukarıdaki butona tıklayın.
            </p>
            <button
              onClick={handleCreateNotification}
              className="mt-4 btn-primary"
            >
              Bildirim Gönder
            </button>
          </div>
        )}
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleNotificationSaved}
      />
    </div>
  );
};

export default Notifications;
