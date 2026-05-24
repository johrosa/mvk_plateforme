import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import ProductListScreen from './screens/ProductListScreen';
import DriverScreen from './screens/DriverScreen';
import HubScreen from './screens/HubScreen';
import StockScreen from './screens/StockScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Connexion">
        <Stack.Screen name="Connexion" component={LoginScreen} />
        <Stack.Screen name="Produits" component={ProductListScreen} />
        <Stack.Screen name="Chauffeur" component={DriverScreen} />
        <Stack.Screen name="Hub" component={HubScreen} />
        <Stack.Screen name="Stock" component={StockScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
