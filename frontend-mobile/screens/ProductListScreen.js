import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, Image, SafeAreaView, Alert } from 'react-native';
import axios from 'axios';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';

export default function ProductListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/products`);
      setProducts(data);
    } catch (error) {
      console.error('Erreur', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = (product) => {
    Alert.alert(
      'Confirmation',
      `Voulez-vous commander 1 unité de ${product.name} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Commander',
          onPress: async () => {
            try {
              await axios.post(`${API_URL}/orders`, {
                productId: product.id,
                quantity: 1
              });
              Alert.alert('Succès', 'Votre commande a été enregistrée !');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de passer la commande');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={item.imageUrl ? { uri: item.imageUrl } : { uri: 'https://via.placeholder.com/150' }}
        style={styles.image}
      />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price}€ / {item.unit}</Text>
        <Text style={styles.farmer}>👨‍🌾 {item.farmer?.name}</Text>
        {item.sourceFarmerName && <Text style={styles.origin}>📍 Origine: {item.sourceFarmerName}</Text>}

        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => handleOrder(item)}
        >
          <Text style={styles.orderButtonText}>Commander</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Marché Local</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.logout}>Quitter</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#16a34a" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: {
    flexDirection: 'row',
    justifyContent: 'between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  title: { fontSize: 28, fontWeight: '900', color: '#111827', flex: 1 },
  logout: { color: '#ef4444', fontWeight: 'bold' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  image: { width: '100%', height: 180 },
  cardContent: { padding: 16 },
  name: { fontSize: 20, fontWeight: '800', color: '#1f2937', marginBottom: 4 },
  price: { fontSize: 18, color: '#16a34a', fontWeight: 'bold', marginBottom: 8 },
  farmer: { color: '#6b7280', fontSize: 14, marginBottom: 2 },
  origin: { color: '#2563eb', fontSize: 14, fontWeight: '600' },
  orderButton: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    padding: 12,
    marginTop: 12
  },
  orderButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});
