import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Platform, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';

export default function StockScreen({ navigation }) {
  const [storages, setStorages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStorages();
  }, []);

  const fetchStorages = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/stock/my-storages`);
      setStorages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderStorage = (s) => {
    const percent = Math.round((s.currentLoad / s.capacity) * 100);
    return (
      <View key={s.id} style={styles.storageCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.storageName}>{s.name}</Text>
            <Text style={styles.storageLocation}>{s.location}</Text>
          </View>
          <Text style={styles.percentText}>{percent}%</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${percent}%` }]} />
        </View>

        <Text style={styles.subTitle}>📦 Contenu :</Text>
        {s.records.length > 0 ? s.records.map(r => (
          <View key={r.id} style={styles.recordItem}>
            <Text style={styles.productName}>{r.product.name}</Text>
            <Text style={styles.quantity}>+{r.quantity} {r.product.unit}</Text>
          </View>
        )) : (
          <Text style={styles.emptyText}>Aucun produit.</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestion Stocks</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.logout}>Quitter</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#16a34a" style={{ flex: 1 }} />
      ) : (
        <ScrollView style={styles.content}>
          {storages.map(renderStorage)}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '900', color: '#111827' },
  logout: { color: '#ef4444', fontWeight: 'bold' },
  content: { padding: 16 },
  storageCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 16, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  storageName: { fontSize: 18, fontWeight: '800', color: '#1f2937' },
  storageLocation: { fontSize: 14, color: '#6b7280' },
  percentText: { fontSize: 18, fontWeight: '900', color: '#16a34a' },
  progressBar: { height: 10, backgroundColor: '#f3f4f6', borderRadius: 5, overflow: 'hidden', marginBottom: 16 },
  progressFill: { height: '100%', backgroundColor: '#16a34a' },
  subTitle: { fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 8 },
  recordItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  productName: { color: '#4b5563', fontWeight: '600' },
  quantity: { color: '#16a34a', fontWeight: 'bold' },
  emptyText: { fontStyle: 'italic', color: '#9ca3af', fontSize: 13 }
});
