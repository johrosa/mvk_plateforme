import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator, Platform, Image } from 'react-native';
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
      console.error('Erreur lors de la récupération des produits', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marché</Text>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
            <View style={styles.details}>
                <Text style={styles.name}>{item.name}</Text>
                <Text>{item.price}€/{item.unit}</Text>
                <Text>Vendeur: {item.farmer?.name}</Text>
            </View>
          </View>
        )}
      />
      <Button title="Déconnexion" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', alignItems: 'center' },
  image: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  details: { flex: 1 },
  name: { fontSize: 18, fontWeight: '500' }
});
