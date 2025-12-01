import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RaffleCard from '../components/RaffleCard';
import { raffleAPI } from '../services/api';
import { useStore } from '../store/store';
import { useSocket } from '../services/socket';

export default function BrowseRaffles() {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { raffles, setRaffles } = useStore();
  const socket = useSocket();

  useEffect(() => {
    fetchRaffles();
    if (socket) {
      socket.emit('joinRaffles');  // Listen to updates
    }
  }, []);

  const fetchRaffles = async () => {
    try {
      const { data } = await raffleAPI.getAll();
      setRaffles(data);
    } catch (error) {
      console.log('Fetch error', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <View style={styles.loading}><Text>Loading...</Text></View>;  // Add spinner

  return (
    <View style={styles.container}>
      <FlatList
        data={raffles}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <RaffleCard
            raffle={item}
            onPress={() => navigation.navigate('RaffleDetails', { raffleId: item._id })}
          />
        )}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchRaffles} />}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  row: { justifyContent: 'space-between' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});