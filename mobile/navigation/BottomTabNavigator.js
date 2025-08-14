import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Platform } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Tab = createBottomTabNavigator();

// HomeScreen için navigation wrapper
const HomeScreenWrapper = ({ navigation }) => (
  <HomeScreen navigation={navigation} />
);

// ActivitiesScreen için navigation wrapper
const ActivitiesScreenWrapper = ({ navigation }) => (
  <ActivitiesScreen navigation={navigation} />
);

// NotificationsScreen için navigation wrapper
const NotificationsScreenWrapper = ({ navigation }) => (
  <NotificationsScreen navigation={navigation} />
);

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Activities') {
            iconName = focused ? 'construct' : 'construct-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#999999',
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        headerShown: false,
        tabBarHideOnKeyboard: true,

      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreenWrapper}
        options={{
          tabBarTestID: 'home-tab',
        }}
      />
      <Tab.Screen 
        name="Activities" 
        component={ActivitiesScreenWrapper}
        options={{
          tabBarTestID: 'activities-tab',
        }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreenWrapper}
        options={{
          tabBarTestID: 'notifications-tab',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 0,
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 60 : 40,
    left: 40,
    right: 40,
    height: 60,
    borderRadius: 20,
    paddingBottom: 0,
    paddingTop: 0,
    paddingHorizontal: 20,
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Android Shadow
    elevation: 4,
  },
});
