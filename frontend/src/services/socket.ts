import io, { Socket } from 'socket.io-client';
import { useEffect, useRef } from 'react';
import { useStore } from '../store/store';

let socket: Socket | null = null;

export const initSocket = (token: string) => {
  socket = io('http://localhost:5000', {  // Your backend URL
    auth: { token },
  });

  socket.on('raffleUpdate', (data) => {
    // Update store with real-time progress
    const { raffles } = useStore.getState();
    const updatedRaffles = raffles.map((r) => r._id === data.id ? { ...r, ...data } : r);
    useStore.getState().setRaffles(updatedRaffles);
  });

  socket.on('winnerDrawn', (data) => {
    // Trigger notification/sound
    console.log('Winner:', data.winner);
  });

  return socket;
};

export const useSocket = () => {
  const socketRef = useRef(socket);
  const { user } = useStore();

  useEffect(() => {
    if (user) {
      initSocket(user.token);  // Assume token in user
    }
    return () => {
      socket?.disconnect();
    };
  }, [user]);

  return socketRef.current;
};