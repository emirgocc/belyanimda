import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { servicesAPI, notificationsAPI } from '../services/api';
import { formatDate } from '@belyanimda/shared';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalServices: 0,
    activeServices: 0,
    totalNotifications: 0,
    recentNotifications: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [servicesResponse, notificationsResponse] = await Promise.all([
        servicesAPI.getAll(),
        notificationsAPI.getAll(),
      ]);

      if (servicesResponse.success && notificationsResponse.success) {
        const services = servicesResponse.data;
        const notifications = notificationsResponse.data;
        
        setStats({
          totalServices: services.length,
          activeServices: services.filter(s => s.active).length,
          totalNotifications: notifications.length,
          recentNotifications: notifications
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5),
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, link }) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        {link && (
          <Link
            to={link}
            className="text-primary-500 hover:text-primary-600 text-sm font-medium"
          >
            Görüntüle →
          </Link>
        )}
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Belediye yönetim paneline hoş geldiniz.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Hizmet"
          value={stats.totalServices}
          icon="🛠️"
          color="bg-blue-100"
          link="/services"
        />
        <StatCard
          title="Aktif Hizmet"
          value={stats.activeServices}
          icon="✅"
          color="bg-green-100"
          link="/services"
        />
        <StatCard
          title="Toplam Bildirim"
          value={stats.totalNotifications}
          icon="🔔"
          color="bg-yellow-100"
          link="/notifications"
        />
        <StatCard
          title="Bu Ay"
          value={stats.recentNotifications.filter(n => {
            const notifDate = new Date(n.createdAt);
            const now = new Date();
            return notifDate.getMonth() === now.getMonth() && 
                   notifDate.getFullYear() === now.getFullYear();
          }).length}
          icon="📅"
          color="bg-purple-100"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Notifications */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Son Bildirimler</h2>
            <Link
              to="/notifications"
              className="text-primary-500 hover:text-primary-600 text-sm font-medium"
            >
              Tümünü Görüntüle
            </Link>
          </div>
          
          <div className="space-y-4">
            {stats.recentNotifications.length > 0 ? (
              stats.recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <span className="text-primary-600">🔔</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {notification.title}
                    </p>
                    {notification.description && (
                      <p className="text-sm text-gray-600 truncate">
                        {notification.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                Henüz bildirim gönderilmemiş
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Hızlı İşlemler</h2>
          
          <div className="space-y-4">
            <Link
              to="/services"
              className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="p-2 bg-blue-500 rounded-lg">
                <span className="text-white">➕</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Yeni Hizmet Ekle</p>
                <p className="text-sm text-gray-600">Sisteme yeni hizmet ekleyin</p>
              </div>
            </Link>

            <Link
              to="/notifications"
              className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <div className="p-2 bg-green-500 rounded-lg">
                <span className="text-white">📢</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Bildirim Gönder</p>
                <p className="text-sm text-gray-600">Kullanıcılara yeni bildirim gönderin</p>
              </div>
            </Link>

            <Link
              to="/services"
              className="flex items-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
            >
              <div className="p-2 bg-yellow-500 rounded-lg">
                <span className="text-white">🔄</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Hizmet Sıralaması</p>
                <p className="text-sm text-gray-600">Hizmetlerin görünüm sırasını düzenleyin</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
