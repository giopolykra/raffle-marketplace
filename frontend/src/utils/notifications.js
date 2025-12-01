import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export const setupNotifications = async () => {
  if (Device.isDevice) {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Notifications permission denied');
      return;
    }
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  // Send token to backend /users/profile to store for push
  console.log('Push token:', token);
};

// Schedule a local notification for raffle end
export const scheduleRaffleNotification = (raffleId: string, endTime: Date) => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: 'Raffle Ending Soon!',
      body: `Your raffle ${raffleId} is about to draw a winner.`,
    },
    trigger: { date: endTime },
  });
};