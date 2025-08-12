import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Linking,
  AppState,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    loadNotifications();
    
    // App state değişikliklerini dinle (arka plan -> ön plan)
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('Uygulama ön plana geldi, bildirimler güncelleniyor...');
        loadNotifications();
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Periyodik güncelleme (her 1 dakikada bir)
    const interval = setInterval(() => {
      console.log('Periyodik bildirim güncellemesi...');
      loadNotifications();
    }, 60000); // 1 dakika

    return () => {
      subscription?.remove();
      clearInterval(interval);
    };
  }, [appState]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // Önce mobile data endpoint'ini dene (daha verimli)
      try {
        const mobileData = await apiService.getMobileData();
        if (mobileData.success && mobileData.data.notifications) {
          setNotifications(mobileData.data.notifications);
          return;
        }
      } catch (error) {
        console.log('Mobile data endpoint başarısız, fallback kullanılıyor...');
      }
      
      // Fallback: ayrı ayrı bildirim çağrısı
      const data = await apiService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Bildirimler yüklenirken hata:', error);
      // Hata durumunda mevcut verileri koru, sadece loading'i kapat
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  const handleNotificationPress = (notification) => {
    if (notification.url) {
      // ServiceWebView'da aç
      navigation.navigate('ServiceWebView', { 
        service: {
          name: notification.title,
          url: notification.url
        }
      });
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.notificationCard}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={item.url ? 0.7 : 1}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationIcon}>
          <Ionicons 
            name={item.url ? "link" : "notifications"} 
            size={20} 
            color={item.url ? "#2563eb" : "#6b7280"} 
          />
        </View>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationDate}>{formatDate(item.createdAt)}</Text>
        </View>
        {item.url && (
          <View style={styles.linkIndicator}>
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </View>
        )}
      </View>
      <Text style={styles.notificationMessage}>{item.description}</Text>
      
      {/* Link varsa şık link göstergesi */}
      {item.url && (
        <View style={styles.linkContainer}>
          <View style={styles.linkIconContainer}>
            <Ionicons name="open-outline" size={14} color="#6b7280" />
          </View>
          <Text style={styles.linkText} numberOfLines={1}>
            {item.url}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-outline" size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>Henüz bildirim yok</Text>
      <Text style={styles.emptyMessage}>
        Yeni bildirimler burada görünecek
      </Text>
    </View>
  );

  if (loading) {
    return (
      <LinearGradient
        colors={['#f8fafc', '#e2e8f0', '#cbd5e1']}
        style={styles.container}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Bildirimler</Text>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Bildirimler yükleniyor...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#f8fafc', '#e2e8f0', '#cbd5e1']}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bildirimler</Text>
        </View>

        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[
            styles.listContainer,
            notifications.length === 0 && styles.emptyListContainer,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyState}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingBottom: 90, // Floating navigation için alan bırak
  },
  header: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  listContainer: {
    padding: 16,
    paddingHorizontal: 20, // Hizmet kartları ile aynı genişlik için
  },
  emptyListContainer: {
    flex: 1,
  },
  notificationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16, // Hizmet kartları ile aynı margin
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#eff6ff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  notificationDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    paddingLeft: 52,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  linkIndicator: {
    position: 'absolute',
    right: 16,
    top: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingLeft: 52,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  linkIconContainer: {
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  linkText: {
    flex: 1,
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
});
