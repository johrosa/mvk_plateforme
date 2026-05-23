import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import ProductListScreen from './screens/ProductListScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Connexion">
        <Stack.Screen name="Connexion" component={LoginScreen} />
        <Stack.Screen name="Produits" component={ProductListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
