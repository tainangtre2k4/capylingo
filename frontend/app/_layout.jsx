import { Slot } from 'expo-router';
import { ClerkProvider, useAuth } from "@clerk/clerk-expo"
import * as SecureStore from 'expo-secure-store';
import { useSegments, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import QueryProvider from '../src/providers/QueryProvider.tsx'
const publishableKey=process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
const tokenCache = {
  async getToken(key) {
    try {
      const item = await SecureStore.getItemAsync(key);
      // if (item) {
      //   console.log(`${key} was used 🔐 \n`);
      // } else {
      //   console.log("No values stored under key: " + key);
      // }
      return item;
    } catch (error) {
      //console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};
const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inTabsGroup = segments[0] === '(auth)';

    console.log('User changed: ', isSignedIn);

    if (isSignedIn && !inTabsGroup) {
      router.replace('/learn');
    } else if (!isSignedIn) {
      router.replace('/login');
    }
  }, [isSignedIn]);
  return (

    <Slot />

  )
}
export default function RootLayout() {
  const error = console.error; console.error = (...args) => { if (/defaultProps/.test(args[0])) return; error(...args); };
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <QueryProvider>
      <InitialLayout/>
      </QueryProvider>
    </ClerkProvider>
  );
}
