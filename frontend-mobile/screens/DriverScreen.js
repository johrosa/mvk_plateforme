import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, Alert, SafeAreaView } from 'react-native';
import axios from 'axios';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';

export default function DriverScreen({ navigation }) {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDeliveries(); }, []);

  const fetchDeliveries = async () => {
    try {
      // In a real app we'd pass the token in headers
      const { data } = await axios.get(`${API_URL}/driver/my-deliveries`);
      setDeliveries(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/driver/deliveries/${id}/status`, { status });
      Alert.alert('Succès', `Statut mis à jour : ${status}`);
      fetchDeliveries();
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la mise à jour');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>Commande #{item.orderId}</Text>
        <Text style={[styles.status, { color: item.status === 'DELIVERED' ? '#16a34a' : '#2563eb' }]}>
          {item.status}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Produit:</Text>
        <Text style={styles.value}>{item.order.product.name} ({item.order.quantity} {item.order.product.unit})</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Destinataire:</Text>
        <Text style={styles.value}>{item.order.buyer.name}</Text>
      </View>

      <View style={styles.actions}>
        {item.status === 'PENDING' && (
          <TouchableOpacity style={styles.pickupButton} onPress={() => updateStatus(item.id, 'PICKED_UP')}>
            <Text style={styles.buttonText}>Ramasser</Text>
          </TouchableOpacity>
        )}
        {item.status === 'PICKED_UP' && (
          <TouchableOpacity style={styles.deliverButton} onPress={() => updateStatus(item.id, 'DELIVERED')}>
            <Text style={styles.buttonText}>Valider Livraison</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Livraisons</Text>
        <TouchableOpacity onPress={fetchDeliveries}><Text style={styles.refresh}>Actualiser</Text></TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#16a34a" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={deliveries}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  refresh: { color: '#16a34a', fontWeight: 'bold' },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.1, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  orderId: { fontWeight: 'bold', fontSize: 16 },
  status: { fontWeight: 'bold', textTransform: 'uppercase', fontSize: 12 },
  infoRow: { flexDirection: 'row', marginBottom: 4 },
  label: { width: 100, color: '#6b7280' },
  value: { flex: 1, fontWeight: '500' },
  actions: { marginTop: 16, flexDirection: 'row', gap: 8 },
  pickupButton: { flex: 1, backgroundColor: '#2563eb', padding: 12, borderRadius: 8 },
  deliverButton: { flex: 1, backgroundColor: '#16a34a', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});
