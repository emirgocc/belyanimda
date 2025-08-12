import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import ServiceWebView from './screens/ServiceWebView';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#ffffff" translucent={false} />
      <NavigationContainer
        theme={{
          colors: {
            background: '#f8fafc',
          },
        }}
      >
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
          <Stack.Screen name="ServiceWebView" component={ServiceWebView} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
