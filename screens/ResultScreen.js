import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getGameSession,
  getHistory,
  saveResult,
} from '../storage/storage';

import { formatDuration } from '../utils/timer';

export default function ResultScreen({ navigation }) {
  const [result, setResult] = useState(null);
  const [isRecord, setIsRecord] = useState(false);

  const [history, setHistory] = useState([]);
  const [scoresVisible, setScoresVisible] = useState(false);
  const [loadingScores, setLoadingScores] = useState(false);

  useEffect(() => {
    const finishGame = async () => {
      const session = await getGameSession();
      const elapsedMs = Date.now() - session.startTime;

      const previousHistory = await getHistory();

      const previousBestMs = previousHistory.length
        ? Math.min(
            ...previousHistory.map((item) => item.elapsedMs)
          )
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
        previousBestMs === null ||
        elapsedMs < previousBestMs
      );
    };

    finishGame().catch(() => {
      setResult({
        name: 'Jugador',
        time: '--:--',
      });
    });
  }, []);

  const showScores = async () => {
    try {
      setLoadingScores(true);
      setScoresVisible(true);

      const savedHistory = await getHistory();

      // Menor tiempo primero
      const topTenScores = [...savedHistory]
        .sort((a, b) => a.elapsedMs - b.elapsedMs)
        .slice(0, 10);

      setHistory(topTenScores);

      setHistory(sortedHistory);
    } catch {
      setHistory([]);
    } finally {
      setLoadingScores(false);
    }
  };

  const playAgain = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Memory' }],
    });
  };

  const goHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const renderScore = ({ item, index }) => {
    return (
      <View style={styles.scoreItem}>
        <View style={styles.scorePosition}>
          <Text style={styles.scorePositionText}>
            {index + 1}
          </Text>
        </View>

        <Text
          style={styles.scoreName}
          numberOfLines={1}
        >
          {item.name || 'Jugador'}
        </Text>

        <Text style={styles.scoreTime}>
          {item.time || formatDuration(item.elapsedMs)}
        </Text>
      </View>
    );
  };

  if (!result) {
    return (
      <ImageBackground
        source={require('../assets/img/FONDO_PLANO.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView
          style={styles.safe}
          edges={['bottom']}
        >
          <View style={styles.container}>
            <ActivityIndicator
              size="large"
              color="#FBAB20"
            />
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
      <SafeAreaView
        style={styles.safe}
        edges={['bottom']}
      >
        <View style={styles.container}>
          <Text style={styles.title}>
            ¡ENHORABUENA!
          </Text>

          <Image
            source={require('../assets/img/RELOJ.png')}
            style={styles.clockImage}
            resizeMode="contain"
          />

          <View style={styles.infoCard}>
            <Text style={styles.cardLabel}>
              {isRecord
                ? '¡Nuevo récord!'
                : '¡Lo lograste!'}
            </Text>

            <Text style={styles.time}>
              {result.time}
            </Text>
          </View>

          {/* Personaje y botón de puntajes */}
          <View style={styles.scoresSection}>
            <Image
              source={
                isRecord
                  ? require('../assets/img/EMOCIONADA_Figuralicia.png')
                  : require('../assets/img/FELIZ_Figuralicia.png')
              }
              style={styles.happyCharacter}
              resizeMode="contain"
            />

            <Pressable
              onPress={showScores}
              style={({ pressed }) => [
                styles.scoresButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.scoresButtonText}>
                Ver puntajes
              </Text>
            </Pressable>
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={playAgain}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.pressed,
              ]}
            >
              <Image
                source={require(
                  '../assets/img/REINICIAR.png'
                )}
                style={styles.buttonImage}
                resizeMode="contain"
              />
            </Pressable>

            <Pressable
              onPress={goHome}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.pressed,
              ]}
            >
              <Image
                source={require(
                  '../assets/img/HOME.png'
                )}
                style={styles.buttonImage}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      {/* Modal con los puntajes */}
      <Modal
        visible={scoresVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setScoresVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Puntajes
            </Text>

            <Text style={styles.modalSubtitle}>
              Mejores tiempos
            </Text>

            <View style={styles.scoreHeader}>
              <Text style={styles.headerPosition}>
                #
              </Text>

              <Text style={styles.headerName}>
                Nombre
              </Text>

              <Text style={styles.headerTime}>
                Tiempo
              </Text>
            </View>

            {loadingScores ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="large"
                  color="#FBAB20"
                />
              </View>
            ) : history.length > 0 ? (
              <FlatList
                data={history}
                renderItem={renderScore}
                keyExtractor={(item, index) =>
                  item.id
                    ? String(item.id)
                    : String(index)
                }
                style={styles.scoreList}
                contentContainerStyle={
                  styles.scoreListContent
                }
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Todavía no hay puntajes guardados.
                </Text>
              </View>
            )}

            <Pressable
              onPress={() => setScoresVisible(false)}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.closeButtonText}>
                Cerrar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    marginTop: 35,
    fontSize: 40,
    color: '#FBAB20',
    fontFamily: 'Comic Sans MS',
    textAlign: 'center',
    textShadowColor: '#8e3410',
    textShadowOffset: {
      width: 2,
      height: 2,
    },
    textShadowRadius: 1,
  },

  clockImage: {
    width: 160,
    height: 160,
    marginTop: 5,
  },

  infoCard: {
    width: '80%',
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 25,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FBAB20',
    marginTop: 5,
  },

  cardLabel: {
    fontSize: 18,
    fontFamily: 'Comic Sans MS',
    color: '#FBAB20',
  },

  time: {
    marginTop: 6,
    fontSize: 36,
    fontFamily: 'Comic Sans MS',
    color: '#FBAB20',
  },

  scoresSection: {
    width: '90%',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },

  happyCharacter: {
    width: 125,
    height: 105,
  },

  scoresButton: {
    minWidth: 145,
    backgroundColor: '#FDF4DB',
    borderWidth: 3,
    borderColor: '#FBAB20',
    borderRadius: 22,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scoresButtonText: {
    color: '#FBAB20',
    fontFamily: 'Comic Sans MS',
    fontSize: 18,
    textAlign: 'center',
  },

  actions: {
    marginTop: 'auto',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: 10,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonImage: {
    width: 115,
    height: 115,
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.48)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },

  modalContent: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '75%',
    backgroundColor: '#FFF9E9',
    borderWidth: 4,
    borderColor: '#FBAB20',
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 18,
  },

  modalTitle: {
    color: '#FBAB20',
    fontFamily: 'Comic Sans MS',
    fontSize: 32,
    textAlign: 'center',
  },

  modalSubtitle: {
    marginTop: 2,
    marginBottom: 14,
    color: '#666',
    fontFamily: 'Comic Sans MS',
    fontSize: 16,
    textAlign: 'center',
  },

  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#FBAB20',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },

  headerPosition: {
    width: 40,
    color: '#FBAB20',
    fontFamily: 'Comic Sans MS',
    fontSize: 15,
    textAlign: 'center',
  },

  headerName: {
    flex: 1,
    color: '#FBAB20',
    fontFamily: 'Comic Sans MS',
    fontSize: 15,
  },

  headerTime: {
    width: 85,
    color: '#FBAB20',
    fontFamily: 'Comic Sans MS',
    fontSize: 15,
    textAlign: 'right',
  },

  scoreList: {
    marginTop: 4,
  },

  scoreListContent: {
    paddingBottom: 5,
  },

  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F6CE78',
    borderRadius: 16,
    marginTop: 9,
    paddingVertical: 11,
    paddingHorizontal: 8,
  },

  scorePosition: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FBAB20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  scorePositionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },

  scoreName: {
    flex: 1,
    color: '#444',
    fontFamily: 'Comic Sans MS',
    fontSize: 17,
  },

  scoreTime: {
    width: 85,
    color: '#FBAB20',
    fontFamily: 'Comic Sans MS',
    fontSize: 17,
    textAlign: 'right',
  },

  loadingContainer: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyContainer: {
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  emptyText: {
    color: '#666',
    fontFamily: 'Comic Sans MS',
    fontSize: 16,
    textAlign: 'center',
  },

  closeButton: {
    alignSelf: 'center',
    marginTop: 16,
    minWidth: 140,
    backgroundColor: '#FBAB20',
    borderRadius: 20,
    paddingVertical: 11,
    paddingHorizontal: 24,
    alignItems: 'center',
  },

  closeButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Comic Sans MS',
    fontSize: 18,
  },
});