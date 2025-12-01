import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import CountdownTimer from './CountdownTimer';

const { width } = Dimensions.get('window');
interface Props {
  raffle: any;
  onPress: () => void;
}

export default function RaffleCard({ raffle, onPress }: Props) {
  const progress = raffle.soldTickets / raffle.totalTickets;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: raffle.productImage || require('../../assets/images/default-product.png') }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{raffle.productName}</Text>
        <Text style={styles.price}>${raffle.ticketPrice} per ticket</Text>
        <ProgressBar progress={progress} width={width - 40} height={10} color="#4ECDC4" />
        <Text style={styles.progressText}>{Math.round(progress * 100)}% sold ({raffle.soldTickets}/{raffle.totalTickets} tickets)</Text>
        <CountdownTimer endTime={new Date(raffle.endTime)} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 15, margin: 10, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  image: { width: '100%', height: 200 },
  info: { padding: 15 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  price: { fontSize: 16, color: '#007AFF', marginBottom: 10 },
  progressText: { fontSize: 12, marginTop: 5, marginBottom: 10 },
});