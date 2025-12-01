import React, { useState } from 'react';
import { View, Text, Slider, StyleSheet } from 'react-native';

interface Props {
  onChange: (quantity: number) => void;
  maxTickets: number;
}

export default function TicketSlider({ onChange, maxTickets }: Props) {
  const [value, setValue] = useState(1);

  const handleChange = (val: number) => {
    setValue(val);
    onChange(Math.round(val));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Buy {value} ticket(s) for ${(value * 1).toFixed(2)}  {/* Assume $1/ticket */}</Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={maxTickets}
        value={value}
        onValueChange={handleChange}
        minimumTrackTintColor="#4ECDC4"
        maximumTrackTintColor="#ddd"
        thumbTintColor="#007AFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 20 },
  label: { fontSize: 16, textAlign: 'center', marginBottom: 10 },
  slider: { width: '100%', height: 40 },
});