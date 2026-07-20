import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getGameSession, saveResult } from '../storage/storage';
import Colors from '../styles/colors';
import { formatDuration } from '../utils/timer';

export default function ResultScreen({ navigation }) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const finishGame = async () => {
      const session = await getGameSession();
      const elapsedMs = Date.now() - session.startTime;
      const newResult = {
        id: String(Date.now()),
        name: session.name,
        elapsedMs,
        time: formatDuration(elapsedMs),
        date: new Date().toISOString(),
      };
      await saveResult(newResult);
      setResult(newResult);
    };

    finishGame().catch(() => {
      setResult({ name: 'Jugador', time: '--:--' });
    });
  }, []);

  const playAgain = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Memory' }] });
  };

  const goHome = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  if (!result) {
    return (
      <ImageBackground
        source={require('../assets/img/FONDO_PLANO.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safe} edges={['bottom']}>
          <View style={styles.container}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/img/FONDO_PLANO.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.container}>
          <Text style={styles.title}>¡ENHORABUENA!</Text>

          <View style={styles.clockContainer}>
            <Image
              source={require('../assets/img/RELOJ.png')}
              style={styles.clockImage}
              resizeMode="contain"
            />
            <Text style={styles.time}>{result.time}</Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={playAgain}
              style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            >
              <Image
                source={require('../assets/img/REINICIAR.png')}
                style={styles.buttonImage}
                resizeMode="contain"
              />
            </Pressable>

            <Pressable
              onPress={goHome}
              style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            >
              <Image
                source={require('../assets/img/HOME.png')}
                style={styles.buttonImage}
                resizeMode="contain"
              />
            </Pressable>
          </View>
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
    paddingHorizontal: 20,
  },

  title: {
    marginTop: 28,
    fontSize: 42,
    fontWeight: '900',
    color: '#FBAB20',
    textAlign: 'center',
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },

  clockContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  clockImage: {
    width: 240,
    height: 240,
  },

  time: {
    position: 'absolute',
    fontSize: 38,
    fontWeight: '900',
    color: Colors.primary,
    textAlign: 'center',
  },

  actions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    paddingBottom: 18,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonImage: {
    width: 170,
    height: 170,
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
});
