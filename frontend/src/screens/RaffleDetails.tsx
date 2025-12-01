import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Button, ScrollView, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { raffleAPI } from '../services/api';
import TicketSlider from '../components/TicketSlider';
import { usePayment } from '../services/stripe';
import { useSocket } from '../services/socket';
// Import other components...

type RootStackParamList = { RaffleDetails: { raffleId: string } };
type RaffleDetailsRouteProp = RouteProp<RootStackParamList, 'RaffleDetails'>;

export default function RaffleDetails() {
  const route = useRoute<RaffleDetailsRouteProp>();
  const [raffle, setRaffle] = useState<any>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { handlePayment } = usePayment();

  useEffect(() => {
    fetchRaffle();
  }, []);

  const fetchRaffle = async () => {
    // API call to get /raffles/:id
    // setRaffle(data);
  };

  const buyTickets = async () => {
    try {
      const { data } = await raffleAPI.buyTickets(route.params.raffleId, quantity);
      // Handle Stripe: Get clientSecret from backend response
      const success = await handlePayment(data.clientSecret, data.paymentIntentId);
      if (success) {
        setShowBuyModal(false);
        // Emit socket update or refetch
      }
    } catch (error) {
      console.log('Buy error', error);
    }
  };

  if (!raffle) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      {/* Hero image, product details, description, seller info */}
      <Text style={styles.title}>{raffle.productName}</Text>
      <CountdownTimer endTime={new Date(raffle.endTime)} />
      <Button title="Buy Tickets" onPress={() => setShowBuyModal(true)} />

      <Modal visible={showBuyModal} animationType="slide">
        <View style={styles.modal}>
          <TicketSlider onChange={setQuantity} maxTickets={raffle.remainingTickets} />
          <Button title="Confirm Purchase" onPress={buyTickets} />
          <Button title="Cancel" onPress={() => setShowBuyModal(false)} />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  modal: { flex: 1, justifyContent: 'center', padding: 20 },
});