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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService } from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await apiService.getServices();
      setServices(data);
    } catch (error) {
      console.error('Hizmetler yüklenirken hata:', error);
      Alert.alert('Hata', 'Hizmetler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleServicePress = async (service) => {
    try {
      if (service.linkUrl) {
        const supported = await Linking.canOpenURL(service.linkUrl);
        if (supported) {
          await Linking.openURL(service.linkUrl);
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
          source={{ uri: item.logoUrl }}
          style={styles.serviceLogo}
          resizeMode="contain"
        />
        <Text style={styles.serviceName} numberOfLines={2}>
          {item.name}
        </Text>
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
            numColumns={2}
            contentContainerStyle={styles.servicesGrid}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
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
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    minHeight: 120,
  },
  serviceCardContent: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceLogo: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 16,
  },
});
