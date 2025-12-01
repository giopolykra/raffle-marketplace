import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';  // Install: npm i react-native-vector-icons

import BrowseRaffles from '../screens/BrowseRaffles';
import RaffleDetails from '../screens/RaffleDetails';
import CreateRaffle from '../screens/CreateRaffle';
import MyRaffles from '../screens/MyRaffles';
import Profile from '../screens/Profile';
import { useStore } from '../store/store';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Profile" component={Profile} />  {/* Handles auth */}
  </Stack.Navigator>
);

const MainTabs = () => {
  const { user } = useStore();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';
          if (route.name === 'Browse') iconName = 'home';
          else if (route.name === 'Create') iconName = 'add-circle';
          else if (route.name === 'MyRaffles') iconName = 'list';
          else if (route.name === 'Profile') iconName = 'person';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Browse" component={BrowseRaffles} />
      {user?.role === 'seller' && <Tab.Screen name="Create" component={CreateRaffle} />}
      <Tab.Screen name="MyRaffles" component={MyRaffles} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user } = useStore();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="RaffleDetails" component={RaffleDetails} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;