import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
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
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  if (!result) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.container}><ActivityIndicator size="large" color={Colors.primary} /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.container}>
        <Text style={styles.trophy}>🏆</Text>
        <Text style={styles.title}>¡Muy bien, {result.name}!</Text>
        <Text style={styles.message}>Completaste los tres juegos.</Text>
        <View style={styles.timeCard}>
          <Text style={styles.timeLabel}>Tu tiempo</Text>
          <Text style={styles.time}>{result.time}</Text>
        </View>
        <PrimaryButton title="Jugar otra vez" onPress={playAgain} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  trophy: { fontSize: 90 },
  title: { fontSize: 30, fontWeight: '800', color: Colors.text, textAlign: 'center', marginTop: 12 },
  message: { fontSize: 19, color: Colors.muted, marginTop: 8, marginBottom: 24 },
  timeCard: {
    backgroundColor: Colors.white, borderWidth: 3, borderColor: Colors.secondary,
    borderRadius: 22, paddingVertical: 22, paddingHorizontal: 50, alignItems: 'center', marginBottom: 28,
  },
  timeLabel: { fontSize: 18, color: Colors.muted },
  time: { fontSize: 44, fontWeight: '900', color: Colors.primary, marginTop: 5 },
});
