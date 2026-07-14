import { DeviceEventEmitter } from 'react-native';
import { AlertType } from '../components/CustomAlert';

export const CustomAlert = {
  show: (type: AlertType, title: string, message?: string) => {
    DeviceEventEmitter.emit('SHOW_ALERT', { type, title, message });
  },
  success: (title: string, message?: string) => {
    DeviceEventEmitter.emit('SHOW_ALERT', { type: 'success', title, message });
  },
  error: (title: string, message?: string) => {
    DeviceEventEmitter.emit('SHOW_ALERT', { type: 'error', title, message });
  },
  warning: (title: string, message?: string) => {
    DeviceEventEmitter.emit('SHOW_ALERT', { type: 'warning', title, message });
  },
  info: (title: string, message?: string) => {
    DeviceEventEmitter.emit('SHOW_ALERT', { type: 'info', title, message });
  }
};
