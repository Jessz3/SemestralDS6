import { useEffect, useState } from 'react';
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
import { Audio } from 'expo-av';

import { startGame } from '../storage/storage';

export default function HomeScreen({ navigation }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

    const playWelcomeAudio = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/audio/Bienvenido.mp3')
      );

      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch {
      console.log('No se pudo reproducir el audio');
    }
  };

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
      source={require('../assets/img/Main_Screen.png')}
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

          {/* BOTÓN INVISIBLE DE AUDIO */}
          <Pressable
            onPress={playWelcomeAudio}
            style={styles.audioHotspot}
          />

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
    textShadowColor: '#8e3410',
    textShadowOffset: { width: 3, height: 2 },
    textShadowRadius: 1,
  },

  inputContainer: {
    position: 'absolute',
    right: 15,
    bottom: 370,
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
    color: '#8e3410',
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

    audioHotspot: {
    position: 'absolute',
    right: 15,
    bottom: 550,
    width: 230,
    height: 100,
    opacity: 100,
  },
});
