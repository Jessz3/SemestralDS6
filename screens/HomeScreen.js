import { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { startGame } from '../storage/storage';

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
    <ImageBackground
      source={require('../assets/img/FONDO_BONITO.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >

          {/* TÍTULO */}
          <Text style={styles.title}>
            FIGÚRALO
          </Text>

          {/* IMAGEN DE LA IZQUIERDA */}
          <Image
            source={require('../assets/img/FIGURALICIA_CUERPO.png')}
            style={styles.leftImage}
            resizeMode="contain"
          />

          {/* PERSONAJE Y TEXTO DE LA DERECHA */}
          <View style={styles.characterContainer}>
            <Image
              source={require('../assets/img/NUBE.png')}
              style={styles.rightImage}
              resizeMode="contain"
            />

            <Text style={styles.characterText}>
              ¡Hola! Me llamo Figuralicia.{'\n'}
              ¿Tú cómo te llamas?
            </Text>
          </View>

          {/* INPUT */}
          <View style={styles.inputContainer}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Escribe tu nombre"
              maxLength={20}
              autoCapitalize="words"
              returnKeyType="done"
              style={styles.input}
            />
          </View>

          {/* BOTÓN */}
          <Pressable
            style={styles.startButton}
            onPress={handleStart}
            disabled={loading}
          >
            <Image
              source={require('../assets/img/BOTON_EMPEZAR.png')}
              style={styles.buttonImage}
              resizeMode="contain"
            />
          </Pressable>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  safe: {
    flex: 1,
  },

  container: {
    flex: 1,
    alignItems: 'center',
  },

  title: {
    position: 'absolute',
    top: 45,
    fontSize: 65,
    color: '#FBAB20',
    fontFamily: 'Comic Sans MS',
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },

  leftImage: {
    position: 'absolute',
    left: -160,
    top: 180,
    width: 600,
    height: 600,
  },

  characterContainer: {
    position: 'absolute',
    right: 15,
    top: 120,
    width: 210,
    height: 230,
    alignItems: 'center',
  },

  rightImage: {
    width: 230,
    height: 230,
  },

  characterText: {
    position: 'absolute',
    top: 80,
    left: 25,
    width: 180,
    fontSize: 15,
    color: '#FBAB20',
    textAlign: 'center',
    fontFamily: 'Comic Sans MS',
  },

  inputContainer: {
    position: 'absolute',
    right: 15,
    bottom: 300,
  },

  input: {
    width: 230,
    height: 55,
    backgroundColor: '#FDF4DB',
    borderWidth: 3,
    borderColor: '#FBAB20',
    borderRadius: 20,
    paddingHorizontal: 18,
    fontSize: 21,
    textAlign: 'center',
    fontFamily: 'Comic Sans MS',
    color: '#FBAB20',
  },

  startButton: {
    position: 'absolute',
    bottom: 20,
    right: 15,
  },

  buttonImage: {
    width: 250,
    height: 250,
  },
});
