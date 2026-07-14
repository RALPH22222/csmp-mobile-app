import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, Alert } from 'react-native';
import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider } from '../context/AuthContext';
import CustomAlert from '../components/CustomAlert';
import { CustomAlert as AlertService } from '../utils/Alert';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  // Handle deep links
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;
      const { path, queryParams } = Linking.parse(url);
      
      console.log('Deep link received:', url);
      console.log('Path:', path);
      console.log('Query params:', queryParams);
      
      if (path === 'payment/success') {
        AlertService.success(
          'Payment Successful', 
          'Your payment has been processed successfully.'
        );
        router.push('/');
      } else if (path === 'payment/failure') {
        AlertService.error(
          'Payment Failed', 
          'Your payment was not completed. Please try again.'
        );
        router.push('/pages/cash-in');
      } else if (path === 'payment/cancel') {
        AlertService.warning(
          'Payment Cancelled', 
          'You cancelled the payment process.'
        );
        router.push('/pages/cash-in');
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AnimatedSplashOverlay />
        <CustomAlert />
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </ThemeProvider>
  );
}