import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Audio } from 'expo-av';

import { audioRounds, figures } from '../utils/gameData';

export default function AudioGameScreen({ navigation }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [sound, setSound] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [locked, setLocked] = useState(false);

  const current = audioRounds[roundIndex];

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    }).catch(() => {});

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playAudio = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } =
        await Audio.Sound.createAsync(current.audio);

      setSound(newSound);

      await newSound.playAsync();
    } catch {
      Alert.alert(
        'Error de audio',
        'No se pudo reproducir el sonido.'
      );
    }
  };

  const selectFigure = (item) => {
    if (locked) return;

    if (item.id === current.id) {
      setFeedback('¡Correcto! ⭐');
      setLocked(true);

      setTimeout(() => {
        if (roundIndex === audioRounds.length - 1) {
          navigation.replace('Result');
        } else {
          setRoundIndex((value) => value + 1);
          setFeedback('');
          setLocked(false);
        }
      }, 700);
    } else {
      setFeedback('Intenta otra vez 😊');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/img/FONDO_PLANO.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>

          <Pressable
            onPress={() => navigation.navigate('Pause')}
            style={styles.pauseButton}
          >
            <Image
              source={require('../assets/img/PAUSA.png')}
              style={styles.pauseImage}
              resizeMode="contain"
            />
          </Pressable>

          <Text style={styles.title}>
            ¿Qué figura escuchas?
          </Text>

          <Text style={styles.progress}>
            Ronda {roundIndex + 1}/{audioRounds.length}
          </Text>

          <View style={styles.options}>
            {figures.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => selectFigure(item)}
                disabled={locked}
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.pressed,
                ]}
              >
                <Image
                  source={item.image}
                  style={styles.figureImage}
                  resizeMode="contain"
                />
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={playAudio}
            style={({ pressed }) => [
              styles.audioButton,
              pressed && styles.pressed,
            ]}
          >
            <Image
              source={require('../assets/img/AUDIO.png')}
              style={styles.audioButtonImage}
              resizeMode="contain"
            />
          </Pressable>

          <Text
            style={[
              styles.feedback,
              feedback.startsWith('¡Correcto') &&
                styles.correct,
            ]}
          >
            {feedback || 'Escucha el audio y toca una figura.'}
          </Text>

        </View>
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
    justifyContent: 'center',
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0f0f0f',
    marginTop: 25,
    textAlign: 'center',
  },

  progress: {
    fontSize: 18,
    color: '#000000',
    marginTop: 8,
    fontWeight: '700',
  },

  audioButton: {
    marginTop: -25,
  },

  audioButtonImage: {
    width: 220,
    height: 220,
  },

  options: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 10,
  },

  option: {
    width: '45%',
    height: 170,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  figureImage: {
    width: 200,
    height: 200,
  },

  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },

  feedback: {
    marginTop: 12,
    fontSize: 19,
    fontWeight: '700',
    color: '#D32F2F',
    textAlign: 'center',
  },

  correct: {
    color: '#2E7D32',
  },

  pauseButton: {
    position: 'absolute',
    top: 12,
    right: 18,
    zIndex: 20,
  },

  pauseImage: {
    width: 48,
    height: 48,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.70)',
  },
});

