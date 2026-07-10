import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { startGame } from '../storage/storage';
import Colors from '../styles/colors';

export default function HomeScreen({ navigation }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    const cleanName = name.trim();
    if (!cleanName) {
      Alert.alert('Falta tu nombre', 'Escribe tu nombre para comenzar.');
      return;
    }

    try {
      setLoading(true);
      await startGame(cleanName);
      navigation.replace('Memory');
    } catch {
      Alert.alert('Error', 'No se pudo iniciar el juego.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.logo}>🎮</Text>
        <Text style={styles.title}>¡Vamos a jugar!</Text>
        <Text style={styles.subtitle}>¿Cómo te llamas?</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Escribe tu nombre"
          maxLength={20}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={handleStart}
          style={styles.input}
        />

        <PrimaryButton title={loading ? 'Cargando...' : 'Comenzar'} onPress={handleStart} disabled={loading} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  logo: { fontSize: 82, marginBottom: 12 },
  title: { fontSize: 32, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 21, color: Colors.muted, marginBottom: 20 },
  input: {
    width: '100%', maxWidth: 360, backgroundColor: Colors.white, borderWidth: 2,
    borderColor: Colors.secondary, borderRadius: 16, paddingHorizontal: 18,
    paddingVertical: 14, fontSize: 20, textAlign: 'center', marginBottom: 24,
  },
});
