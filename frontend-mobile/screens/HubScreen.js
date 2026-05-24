import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Platform, SafeAreaView, TouchableOpacity } from 'react-native';
import axios from 'axios';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';

export default function HubScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHubData();
  }, []);

  const fetchHubData = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/products`);
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.farmer}>👨‍🌾 {item.sourceFarmerName || item.farmer.name}</Text>
      </View>
      <View style={styles.stockBadge}>
        <Text style={styles.stockText}>{item.quantity} {item.unit}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Espace Hub</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.logout}>Quitter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inventaire Consolidé</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#16a34a" />
        ) : (
          <FlatList
            data={products}
            keyExtractor={item => item.id.toString()}
            renderItem={renderProduct}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <View style={styles.membersSection}>
        <Text style={styles.sectionTitle}>Paysans Membres</Text>
        {['Jean Dupont', 'Marie Curie', 'Pierre Legrand'].map(name => (
          <View key={name} style={styles.memberItem}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{name.charAt(0)}</Text>
            </View>
            <Text style={styles.memberName}>{name}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '900', color: '#111827' },
  logout: { color: '#ef4444', fontWeight: 'bold' },
  section: { padding: 16, flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#374151', marginBottom: 12 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  name: { fontSize: 16, fontWeight: '700', color: '#1f2937' },
  farmer: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  stockBadge: { backgroundColor: '#dcfce7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  stockText: { color: '#166534', fontWeight: 'bold' },
  membersSection: { padding: 16, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  memberItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 36, height: 36, backgroundColor: '#dcfce7', borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#166534', fontWeight: 'bold' },
  memberName: { fontSize: 15, fontWeight: '600', color: '#374151' }
});
