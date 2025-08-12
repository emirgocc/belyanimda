import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Linking,
  AppState,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService } from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    loadServices();
    
    // App state değişikliklerini dinle (arka plan -> ön plan)
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('Uygulama ön plana geldi, hizmetler güncelleniyor...');
        loadServices();
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Periyodik güncelleme (her 2 dakikada bir)
    const interval = setInterval(() => {
      console.log('Periyodik hizmet güncellemesi...');
      loadServices();
    }, 120000); // 2 dakika

    return () => {
      subscription?.remove();
      clearInterval(interval);
    };
  }, [appState]);

  const loadServices = async () => {
    try {
      setLoading(true);
      // Önce mobile data endpoint'ini dene (daha verimli)
      try {
        const mobileData = await apiService.getMobileData();
        if (mobileData.success && mobileData.data.services) {
          setServices(mobileData.data.services);
          return;
        }
      } catch (error) {
        console.log('Mobile data endpoint başarısız, fallback kullanılıyor...');
      }
      
      // Fallback: ayrı ayrı servis çağrısı
      const data = await apiService.getServices();
      setServices(data);
    } catch (error) {
      console.error('Hizmetler yüklenirken hata:', error);
      // Hata durumunda mevcut verileri koru, sadece loading'i kapat
    } finally {
      setLoading(false);
    }
  };

  const handleServicePress = async (service) => {
    try {
      if (service.url) {
        const supported = await Linking.canOpenURL(service.url);
        if (supported) {
          await Linking.openURL(service.url);
        } else {
          Alert.alert('Hata', 'Bu bağlantı açılamıyor.');
        }
      }
    } catch (error) {
      console.error('Bağlantı açılırken hata:', error);
      Alert.alert('Hata', 'Bağlantı açılırken bir hata oluştu.');
    }
  };

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => handleServicePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.serviceCardContent}>
        <Image
          source={{ uri: item.icon }}
          style={styles.serviceLogo}
          resizeMode="contain"
        />
        <Text style={styles.serviceName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <LinearGradient
        colors={['#f8fafc', '#e2e8f0', '#cbd5e1']}
        style={styles.container}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.headerLogo}
                resizeMode="contain"
              />
              <Text style={styles.headerTitle}>Yanımda</Text>
            </View>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Hizmetler yükleniyor...</Text>
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
          <View style={styles.headerContent}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>Yanımda</Text>
          </View>
        </View>

        <View style={styles.content}>
          <FlatList
            data={services}
            renderItem={renderServiceItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            contentContainerStyle={styles.servicesGrid}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
          />
        </View>
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    padding: 16,
    paddingHorizontal: 20, // Bildirim kartları ile aynı genişlik için
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
  servicesGrid: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'flex-start', // Kartları sırayla baştan diz
    marginBottom: 16,
    gap: 12, // Kartlar arası sabit boşluk
  },
  serviceCard: {
    flex: 0, // Flex'i kapat, sabit boyut kullan
    width: '30%', // Sabit genişlik
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 0, // Margin'i kaldır çünkü gap kullanıyoruz
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    minHeight: 120, // Bildirim kartları ile uyumlu yükseklik
  },
  serviceCardContent: {
    flex: 1,
    padding: 16, // Bildirim kartları ile uyumlu padding
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceLogo: {
    width: 50, // Bildirim kartları ile uyumlu logo boyutu
    height: 50,
    marginBottom: 8, // Uyumlu margin
  },
  serviceName: {
    fontSize: 11, // 3 sütun için daha küçük font
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 14, // Daha az line height
  },
});
