import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text } from 'react-native';

const Tab = createMaterialTopTabNavigator();

function CreatedRaffles() { return <View><Text>Created</Text></View>; }
function EnteredRaffles() { return <View><Text>Entered</Text></View>; }

export default function MyRaffles() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Created" component={CreatedRaffles} />
      <Tab.Screen name="Entered" component={EnteredRaffles} />
    </Tab.Navigator>
  );
}