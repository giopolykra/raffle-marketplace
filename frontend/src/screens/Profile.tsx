import React, { useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import AuthForm from '../components/AuthForm';
import { logout } from '../utils/auth';
import { useStore } from '../store/store';
import { setupNotifications } from '../utils/notifications';

export default function Profile() {
  const { user } = useStore();
  const [showAuth, setShowAuth] = useState(!user);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    setupNotifications();
  }, []);

  if (showAuth) {
    return (
      <AuthForm isLogin={isLogin} onClose={() => setShowAuth(false)} />
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome, {user?.name} ({user?.role})</Text>
      <Button title="Logout" onPress={logout} />
      <Button title="Edit Profile" onPress={() => {/* Update via usersAPI */}} />
    </View>
  );
}