import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });

      // Sauvegarder le token et les infos utilisateur
      await SecureStore.setItemAsync('userToken', data.token);
      await SecureStore.setItemAsync('userRole', data.user.role);

      // Configurer axios pour les futurs appels
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      if (data.user.role === 'DRIVER') {
        navigation.navigate('Chauffeur');
      } else if (data.user.role === 'HUB') {
        navigation.navigate('Hub');
      } else if (data.user.role === 'STOCK_MANAGER') {
        navigation.navigate('Stock');
      } else {
        navigation.navigate('Produits');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View className="p-6">
        <Text style={styles.logo}>MVK</Text>
        <Text style={styles.title}>Heureux de vous revoir !</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="votre@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Connexion...' : 'Se connecter'}</Text>
        </TouchableOpacity>

        <TouchableOpacity className="mt-4">
          <Text style={styles.footerText}>
            Pas encore de compte ? <Text style={styles.link}>S'inscrire</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center' },
  logo: { fontSize: 40, fontWeight: '900', color: '#16a34a', textAlign: 'center', marginBottom: 10 },
  title: { fontSize: 20, color: '#4b5563', textAlign: 'center', marginBottom: 40 },
  inputContainer: { marginBottom: 20, paddingHorizontal: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16
  },
  button: {
    backgroundColor: '#16a34a',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 18,
    marginTop: 10,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
  footerText: { textAlign: 'center', color: '#6b7280' },
  link: { color: '#16a34a', fontWeight: 'bold' }
});
