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
import { getGameSession, getHistory, saveResult } from '../storage/storage';
import { formatDuration } from '../utils/timer';

export default function ResultScreen({ navigation }) {
  const [result, setResult] = useState(null);
  const [isRecord, setIsRecord] = useState(false);

  useEffect(() => {
    const finishGame = async () => {
      const session = await getGameSession();
      const elapsedMs = Date.now() - session.startTime;

      const previousHistory = await getHistory();
      const previousBestMs = previousHistory.length
        ? Math.min(...previousHistory.map((item) => item.elapsedMs))
        : null;

      const newResult = {
        id: String(Date.now()),
        name: session.name,
        elapsedMs,
        time: formatDuration(elapsedMs),
        date: new Date().toISOString(),
      };

      await saveResult(newResult);

      setResult(newResult);
      setIsRecord(
        previousBestMs !== null && elapsedMs < previousBestMs
      );
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
            <ActivityIndicator size="large" />
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

          <Image
            source={require('../assets/img/RELOJ.png')}
            style={styles.clockImage}
            resizeMode="contain"
          />

          <View style={styles.infoCard}>
            <Text style={styles.cardLabel}>
              {isRecord ? '¡Nuevo récord!' : '¡Lo lograste!'}
            </Text>

            <Text style={styles.time}>
              {result.time}
            </Text>
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
    width: '100%',
    marginTop: 45,
    fontSize: 40,
    color: '#FBAB20',
    fontFamily: 'Comic Sans MS',
    textAlign: 'center',
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },

  clockImage: {
    width: 180,
    height: 180,
    marginTop: 10,
  },

  infoCard: {
    width: '80%',
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderRadius: 30,
    paddingVertical: 22,
    paddingHorizontal: 25,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FBAB20',
    marginTop: 10,
  },

  cardLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },

  time: {
    marginTop: 6,
    fontSize: 36,
    fontFamily: 'Comic Sans MS',
    color: '#FBAB20',
  },

  actions: {
    marginTop: 'auto',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: 18,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonImage: {
    width: 130,
    height: 130,
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
});