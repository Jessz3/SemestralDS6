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

      const { sound: newSound } = await Audio.Sound.createAsync(
        current.audio
      );

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
      backgroundColor="#c9e3f9"
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>

          {/* TÍTULO */}
          <Text style={styles.title}>
            ¿Qué figura escuchas?
          </Text>

          {/* PROGRESO */}
          <Text style={styles.progress}>
            Ronda {roundIndex + 1}/{audioRounds.length}
          </Text>

          {/* BOTÓN DE AUDIO */}
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

          {/* FIGURAS */}
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
                  source={item.audioImage}
                  style={styles.figureImage}
                  resizeMode="contain"
                />

                <Text style={styles.name}>
                  {item.name}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* FEEDBACK */}
          <Text
            style={[
              styles.feedback,
              feedback.startsWith('¡Correcto') && styles.correct,
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
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FF8C00',
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
    marginTop: 15,
  },

  audioButtonImage: {
    width: 150,
    height: 150,
  },

  options: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },

  option: {
    width: 135,
    height: 135,

    margin: 8,

    borderRadius: 22,

    backgroundColor: '#FFFFFF',

    borderWidth: 3,
    borderColor: '#FF8C00',

    alignItems: 'center',
    justifyContent: 'center',

    elevation: 3,
  },

  figureImage: {
    width: 85,
    height: 85,
  },

  name: {
    marginTop: 5,

    fontSize: 17,
    fontWeight: '700',
    color: '#000000',

    textAlign: 'center',
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
});
