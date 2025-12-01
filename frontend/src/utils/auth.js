import * as SecureStore from 'expo-secure-store';
import { useStore } from '../store/store';

export const setToken = async (token: string) => {
  await SecureStore.setItemAsync('jwt_token', token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync('jwt_token');
};

export const loginUser = async (userData: any) => {
  useStore.getState().setUser(userData);
  await setToken(userData.token);
};

export const logout = async () => {
  await SecureStore.deleteItemAsync('jwt_token');
  useStore.getState().logout();
};