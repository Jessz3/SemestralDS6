import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import PrimaryButton from '../components/PrimaryButton';
import Colors from '../styles/colors';
import { audioRounds, figures } from '../utils/gameData';

export default function AudioGameScreen({ navigation }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [sound, setSound] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [locked, setLocked] = useState(false);
  const current = audioRounds[roundIndex];

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true }).catch(() => {});
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  const playAudio = async () => {
    try {
      if (sound) await sound.unloadAsync();
      const { sound: newSound } = await Audio.Sound.createAsync(current.audio);
      setSound(newSound);
      await newSound.playAsync();
    } catch {
      Alert.alert('Error de audio', 'No se pudo reproducir el sonido.');
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
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.container}>
        <Text style={styles.title}>¿Qué figura escuchas?</Text>
        <Text style={styles.progress}>Ronda {roundIndex + 1}/{audioRounds.length}</Text>
        <PrimaryButton title="🔊 Escuchar" onPress={playAudio} style={styles.audioButton} />

        <View style={styles.options}>
          {figures.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => selectFigure(item)}
              disabled={locked}
              style={({ pressed }) => [styles.option, pressed && styles.pressed]}
            >
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text style={styles.name}>{item.name}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.feedback, feedback.startsWith('¡Correcto') && styles.correct]}>
          {feedback || 'Escucha el audio y toca una figura.'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, marginTop: 14 },
  progress: { fontSize: 18, color: Colors.muted, marginTop: 6 },
  audioButton: { marginTop: 20 },
  options: { width: 320, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 24 },
  option: {
    width: 135, height: 135, margin: 10, borderRadius: 22, backgroundColor: Colors.white,
    borderWidth: 3, borderColor: Colors.secondary, alignItems: 'center', justifyContent: 'center', elevation: 3,
  },
  pressed: { opacity: 0.7, transform: [{ scale: 0.97 }] },
  emoji: { fontSize: 54 },
  name: { marginTop: 5, fontSize: 17, fontWeight: '700', color: Colors.text },
  feedback: { marginTop: 18, fontSize: 19, fontWeight: '700', color: Colors.danger, textAlign: 'center' },
  correct: { color: Colors.success },
});
