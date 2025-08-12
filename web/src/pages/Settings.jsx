import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { APP_CONFIG } from '../config/config';

const Settings = () => {
  const { user } = useAuth();

  const SettingCard = ({ title, children }) => (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>
        <p className="text-gray-600 mt-1">
          Sistem ayarları ve kullanıcı bilgileri
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Information */}
        <SettingCard title="Kullanıcı Bilgileri">
          <div className="space-y-1">
            <InfoRow label="Kullanıcı Adı" value={user?.username || 'N/A'} />
            <InfoRow label="Rol" value="Administrator" />
            <InfoRow label="Durum" value="Aktif" />
          </div>
        </SettingCard>

        {/* System Information */}
        <SettingCard title="Sistem Bilgileri">
          <div className="space-y-1">
            <InfoRow label="Uygulama Adı" value={APP_CONFIG.APP_NAME} />
            <InfoRow label="Versiyon" value={APP_CONFIG.VERSION} />
            <InfoRow label="Ortam" value={import.meta.env.MODE || 'development'} />
            <InfoRow label="API URL" value={import.meta.env.VITE_API_URL || 'http://localhost:3000'} />
          </div>
        </SettingCard>

        {/* Quick Actions */}
        <SettingCard title="Hızlı İşlemler">
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full btn-secondary text-left"
            >
              🔄 Sayfayı Yenile
            </button>
            <button
              onClick={() => {
                if (window.confirm('Tarayıcı önbelleğini temizlemek istediğinizden emin misiniz?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="w-full btn-secondary text-left"
            >
              🧹 Önbelleği Temizle
            </button>
          </div>
        </SettingCard>

        {/* Help & Support */}
        <SettingCard title="Yardım & Destek">
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                📱 Mobil Uygulama
              </h4>
              <p className="text-sm text-blue-700">
                Mobil uygulama kullanıcıları hizmetlere erişmek için{' '}
                <code className="bg-blue-100 px-1 rounded">Ana Sayfa</code> sekmesini,{' '}
                bildirimler için <code className="bg-blue-100 px-1 rounded">Bildirimler</code>{' '}
                sekmesini kullanabilir.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-green-900 mb-2">
                🛠️ Hizmet Yönetimi
              </h4>
              <p className="text-sm text-green-700">
                Hizmetleri <code className="bg-green-100 px-1 rounded">Hizmetler</code> sayfasından{' '}
                yönetebilir, sürükle-bırak ile sıralama yapabilirsiniz.
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-900 mb-2">
                🔔 Bildirim Gönderimi
              </h4>
              <p className="text-sm text-yellow-700">
                <code className="bg-yellow-100 px-1 rounded">Bildirimler</code> sayfasından{' '}
                kullanıcılara anlık bildirim gönderebilirsiniz.
              </p>
            </div>
          </div>
        </SettingCard>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          © 2024 Emir Göç. Tüm hakları saklıdır.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Bu panel belediye personeli tarafından kullanılmak üzere tasarlanmıştır.
        </p>
      </div>
    </div>
  );
};

export default Settings;
