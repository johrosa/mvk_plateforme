import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert, SafeAreaView, Platform, ScrollView } from 'react-native';
import axios from 'axios';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';

export default function SalesRepScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [retailerName, setRetailerName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const prodRes = await axios.get(`${API_URL}/products`);
      const orderRes = await axios.get(`${API_URL}/orders`);
      setProducts(prodRes.data);
      setOrders(orderRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedProduct || !retailerName) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      await axios.post(`${API_URL}/orders`, {
        productId: selectedProduct.id,
        quantity: parseInt(quantity),
        retailerName
      });
      Alert.alert('Succès', 'Commande enregistrée');
      setRetailerName('');
      setSelectedProduct(null);
      setQuantity('1');
      fetchData();
    } catch (err) {
      Alert.alert('Erreur', 'Impossible d\'enregistrer la commande');
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.retailerName}>{item.retailerName || 'Client'}</Text>
        <Text style={styles.statusBadge}>{item.status}</Text>
      </View>
      <Text style={styles.orderDetail}>{item.product.name} x {item.quantity}</Text>
      <Text style={styles.orderTotal}>{item.total}€</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Terrain / Démarcheur</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.logout}>Quitter</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Nouvelle Commande</Text>

          <Text style={styles.label}>Nom du Commerçant</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Boutique Issa"
            value={retailerName}
            onChangeText={setRetailerName}
          />

          <Text style={styles.label}>Produit</Text>
          <View style={styles.pickerContainer}>
            {products.slice(0, 5).map(p => (
              <TouchableOpacity
                key={p.id}
                style={[styles.productOption, selectedProduct?.id === p.id && styles.selectedOption]}
                onPress={() => setSelectedProduct(p)}
              >
                <Text style={[styles.optionText, selectedProduct?.id === p.id && styles.selectedOptionText]}>
                  {p.name} ({p.price}€)
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Quantité</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />

          <TouchableOpacity style={styles.button} onPress={handlePlaceOrder}>
            <Text style={styles.buttonText}>Enregistrer Commande</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { marginHorizontal: 16, marginTop: 24 }]}>Historique Récent</Text>
        {loading ? (
          <ActivityIndicator color="#2563eb" />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={item => item.id.toString()}
            renderItem={renderOrderItem}
            scrollEnabled={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '900', color: '#1e40af' },
  logout: { color: '#ef4444', fontWeight: 'bold' },
  content: { flex: 1 },
  formCard: { backgroundColor: '#fff', margin: 16, padding: 20, borderRadius: 24, elevation: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1f2937', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#4b5563', marginBottom: 6, marginTop: 10 },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12, fontSize: 16 },
  pickerContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 },
  productOption: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: '#fff' },
  selectedOption: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  optionText: { fontSize: 13, color: '#4b5563' },
  selectedOptionText: { color: '#2563eb', fontWeight: 'bold' },
  button: { backgroundColor: '#2563eb', borderRadius: 12, padding: 16, marginTop: 20 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  orderCard: { backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, elevation: 1 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  retailerName: { fontWeight: 'bold', fontSize: 16 },
  statusBadge: { fontSize: 10, backgroundColor: '#fef3c7', color: '#92400e', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, fontWeight: 'bold' },
  orderDetail: { color: '#6b7280', fontSize: 14 },
  orderTotal: { color: '#2563eb', fontWeight: '900', textAlign: 'right' }
});
