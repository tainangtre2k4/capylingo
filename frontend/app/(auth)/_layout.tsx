import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import React, {useEffect} from 'react';
import { StatusBar } from 'expo-status-bar'
import { useSegments } from "expo-router";
import * as NavigationBar from 'expo-navigation-bar';

export const LogoutButton = () => {
  const { signOut } = useAuth();

  const doLogout = () => {
    signOut();
  };

  return (
    <Pressable onPress={doLogout} style={{ marginRight: 10 }}>
      <Ionicons name="log-out-outline" size={24} color={'#fff'} />
    </Pressable>
  );
};

const TabsPage = () => {
  const { isSignedIn } = useAuth();
  const segment = useSegments();

  const page = segment.join('/')

  const pagesToHideTabBar = ['vocabulary/type1', 'skillcheck/reading']

  const checkPageToHideTabBar = (): boolean => {
    for (const s of pagesToHideTabBar)
      if (page.includes(s))
        return true;
    return false;
  };

  useEffect(() => {
    const setNavBarColor = async () => {
      await NavigationBar.setBackgroundColorAsync("white");
    };

    setNavBarColor();
  }, []);

  return (
    <>
      <StatusBar style='light' backgroundColor='#3DB2FF' />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#0074CE',
          headerStyle: {
            backgroundColor: '#6c47ff',
          },
          tabBarHideOnKeyboard: true,
          headerTintColor: '#fff',
        }}>
        <Tabs.Screen
          name="learn"
          options={{
            headerTransparent: true,
            headerTitle: '',
            tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="book-open-page-variant-outline" size={size} color={color} />,
            tabBarLabel: 'Learn',
            headerShown: false,
            tabBarStyle: { display: checkPageToHideTabBar() ? 'none' : 'flex' }
          }}
          redirect={!isSignedIn}
        />
        <Tabs.Screen
          name="resources"
          options={{
            headerTransparent: true,
            headerTitle: '',
            tabBarIcon: ({ color, size }) => <Ionicons name="folder-open-outline" size={size} color={color} />,
            tabBarLabel: 'Resources',
          }}
          redirect={!isSignedIn}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerTitle: 'My Profile',
            tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
            tabBarLabel: 'My Profile',
            headerRight: () => <LogoutButton />,
          }}
          redirect={!isSignedIn}
        />
      </Tabs>
    </>
  );
};

export default TabsPage;
