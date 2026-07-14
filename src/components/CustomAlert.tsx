import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated, DeviceEventEmitter, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type AlertType = 'success' | 'info' | 'warning' | 'error';

interface AlertState {
  visible: boolean;
  type: AlertType;
  title: string;
  message?: string;
}

const CustomAlert = () => {
  const [alert, setAlert] = useState<AlertState>({ visible: false, type: 'info', title: '' });
  const translateY = useRef(new Animated.Value(-150)).current;
  const insets = useSafeAreaInsets();
  
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('SHOW_ALERT', (data) => {
      setAlert({ visible: true, ...data });
      
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 12,
        speed: 14,
      }).start();

      setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -150,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setAlert(prev => ({ ...prev, visible: false }));
        });
      }, 3000);
    });

    return () => {
      subscription.remove();
    };
  }, [translateY]);

  if (!alert.visible) return null;

  const getAlertStyles = () => {
    switch (alert.type) {
      case 'success':
        return { bg: 'bg-[#d1e7dd]', border: 'border-[#badbcc]', text: 'text-[#0f5132]', color: '#0f5132', icon: 'checkmark-circle' };
      case 'warning':
        return { bg: 'bg-[#fff3cd]', border: 'border-[#ffecb5]', text: 'text-[#664d03]', color: '#664d03', icon: 'warning' };
      case 'error':
        return { bg: 'bg-[#f8d7da]', border: 'border-[#f5c2c7]', text: 'text-[#842029]', color: '#842029', icon: 'close-circle' };
      case 'info':
      default:
        return { bg: 'bg-[#cff4fc]', border: 'border-[#b6effb]', text: 'text-[#055160]', color: '#055160', icon: 'information-circle' };
    }
  };

  const styles = getAlertStyles();

  return (
    <Modal visible={alert.visible} transparent={true} animationType="none">
      <View style={{ flex: 1 }} pointerEvents="box-none">
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            transform: [{ translateY }],
            paddingTop: Platform.OS === 'ios' ? insets.top + 10 : insets.top + 20,
            paddingHorizontal: 20,
          }}
        >
          <View className={`${styles.bg} ${styles.border} border rounded-[16px] p-4 flex-row items-center shadow-lg shadow-black/10`}>
            <Ionicons name={styles.icon as any} size={28} color={styles.color} />
            <View className="ml-3 flex-1">
              <Text className={`${styles.text} font-bold text-[15px]`}>{alert.title}</Text>
              {alert.message ? <Text className={`${styles.text} text-[13px] mt-0.5 leading-4 opacity-90`}>{alert.message}</Text> : null}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
