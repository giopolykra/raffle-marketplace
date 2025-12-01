import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { authAPI } from '../services/api';
import { loginUser } from '../utils/auth';
import { useStore } from '../store/store';

interface Props {
  isLogin: boolean;
  onClose: () => void;
}

export default function AuthForm({ isLogin, onClose }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');  // For register
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const setUser = useStore((state) => state.setUser);

  const handleSubmit = async () => {
    try {
      let res;
      if (isLogin) {
        res = await authAPI.login({ email, password });
      } else {
        res = await authAPI.register({ email, password, name, role });
      }
      await loginUser({ ...res.data.user, token: res.data.token });
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      {!isLogin && (
        <>
          <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Role (buyer/seller)" value={role} onChangeText={setRole} />
        </>
      )}
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title={isLogin ? 'Login' : 'Register'} onPress={handleSubmit} />
      <Button title={`Switch to ${isLogin ? 'Register' : 'Login'}`} onPress={() => {/* Toggle mode */}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 5 },
});