import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
  ActivityIndicator,
  Linking,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';

const { height: screenHeight } = Dimensions.get('window');

export default function ServiceWebView({ route, navigation }) {
  const { service } = route.params;
  const [webViewRef, setWebViewRef] = useState(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
  const [slideAnim] = useState(new Animated.Value(screenHeight));

  const handleBack = () => {
    if (canGoBack) {
      webViewRef?.goBack();
    } else {
      navigation.goBack();
    }
  };

  const handleForward = () => {
    if (canGoForward) {
      webViewRef?.goForward();
    }
  };

  const handleRefresh = () => {
    webViewRef?.reload();
    closeMenu();
  };

  const handleOpenInBrowser = async () => {
    try {
      const supported = await Linking.canOpenURL(service.url);
      if (supported) {
        await Linking.openURL(service.url);
      } else {
        Alert.alert('Hata', 'Bu bağlantı açılamıyor.');
      }
    } catch (error) {
      console.error('Tarayıcıda açılırken hata:', error);
      Alert.alert('Hata', 'Tarayıcıda açılırken bir hata oluştu.');
    }
    closeMenu();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${service.name} - ${service.url}`,
        url: service.url,
      });
    } catch (error) {
      console.error('Paylaşım hatası:', error);
    }
    closeMenu();
  };

  const openMenu = () => {
    setShowMenu(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowMenu(false);
    });
  };

  const MenuItem = ({ icon, title, onPress, isDestructive = false }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons 
        name={icon} 
        size={24} 
        color={isDestructive ? '#ef4444' : '#1f2937'} 
      />
      <Text style={[styles.menuItemText, isDestructive && styles.menuItemTextDestructive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#f8fafc', '#e2e8f0', '#cbd5e1']}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleBack}
          >
            <Ionicons 
              name={canGoBack ? "arrow-back" : "close"} 
              size={24} 
              color="#1f2937" 
            />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle} numberOfLines={1}>
            {service.name}
          </Text>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={openMenu}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>

        {/* WebView */}
        <WebView
          ref={setWebViewRef}
          source={{ uri: service.url }}
          style={styles.webview}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
            setCanGoForward(navState.canGoForward);
          }}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
        />



        {/* Bottom Sheet Menu */}
        {showMenu && (
          <TouchableOpacity 
            style={styles.overlay} 
            activeOpacity={1} 
            onPress={closeMenu}
          >
            <Animated.View 
              style={[
                styles.menuContainer,
                {
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <View style={styles.menuHandle} />
              
              <MenuItem 
                icon="refresh" 
                title="Sayfayı Yenile" 
                onPress={handleRefresh} 
              />
              
              <MenuItem 
                icon="open-outline" 
                title="Tarayıcıda Aç" 
                onPress={handleOpenInBrowser} 
              />
              
              <MenuItem 
                icon="share-outline" 
                title="Paylaş" 
                onPress={handleShare} 
              />
              
              <TouchableOpacity style={styles.cancelButton} onPress={closeMenu}>
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  webview: {
    flex: 1,
  },


  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40, // Add some padding at the bottom for the cancel button
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  menuHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#e5e7eb',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  menuItemTextDestructive: {
    color: '#ef4444',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
});
