import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';

import Footer from '../components/Footer';
import Header from '../components/Header';
import { audioRounds, figures } from '../utils/gameData';
import shuffle from '../utils/shuffle';

export default function AudioGameScreen({ navigation }) {
  const rounds = useMemo(() => shuffle(audioRounds), []);

  const [roundIndex, setRoundIndex] = useState(0);
  const [sound, setSound] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [locked, setLocked] = useState(false);

  const current = rounds[roundIndex];

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
        if (roundIndex === rounds.length - 1) {
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

            <Header
              title="¿Qué figura escuchas?"
              onPause={() => navigation.navigate('Pause')}
              containerStyle={styles.header}
              titleStyle={styles.title}
            />

          <View style={styles.content}>

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

          </View>

          <Text style={styles.progress}>
            {roundIndex}/{rounds.length}
          </Text>

          <Footer
            helpText="¡Toca el parlante y elige la figura que corresponde!"
            containerStyle={styles.footer}
          />

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

  header: {
    marginTop: 8,
  },

  title: {
    fontSize: 26,
    color: '#FBAB20',
    fontFamily: 'Comic Sans MS',
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },

  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  progress: {
    fontSize: 20,
    color: '#FBAB20',
    fontFamily: 'Comic Sans MS',
    marginTop: 4,
  },

  audioButton: {
    marginTop: 35,
  },

  audioButtonImage: {
    width: 170,
    height: 170,
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
    marginTop: 4,
    fontSize: 19,
    fontWeight: '700',
    color: '#D32F2F',
    textAlign: 'center',
  },

  correct: {
    color: '#2E7D32',
  },

  footer: {
    marginTop: 'auto',
    paddingTop: 20,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.70)',
  },
});