import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/Card';
import Colors from '../styles/colors';
import { memoryPairs } from '../utils/gameData';
import shuffle from '../utils/shuffle';

function createDeck() {
  return shuffle(
    memoryPairs.flatMap((item) => [
      { id: `${item.id}-1`, pairId: item.id, emoji: item.emoji, flipped: false, matched: false },
      { id: `${item.id}-2`, pairId: item.id, emoji: item.emoji, flipped: false, matched: false },
    ])
  );
}

export default function MemoryGameScreen({ navigation }) {
  const initialDeck = useMemo(createDeck, []);
  const [cards, setCards] = useState(initialDeck);
  const [selected, setSelected] = useState([]);
  const [locked, setLocked] = useState(false);

  const handleCardPress = (id) => {
    if (locked || selected.length === 2) return;

    setCards((current) => current.map((card) => card.id === id ? { ...card, flipped: true } : card));
    setSelected((current) => [...current, id]);
  };

  useEffect(() => {
    if (selected.length !== 2) return;

    const [firstId, secondId] = selected;
    const first = cards.find((card) => card.id === firstId);
    const second = cards.find((card) => card.id === secondId);
    if (!first || !second) return;

    setLocked(true);
    const isMatch = first.pairId === second.pairId;

    const timeout = setTimeout(() => {
      setCards((current) => current.map((card) => {
        if (card.id !== firstId && card.id !== secondId) return card;
        return isMatch
          ? { ...card, matched: true, flipped: true }
          : { ...card, flipped: false };
      }));
      setSelected([]);
      setLocked(false);
    }, isMatch ? 450 : 900);

    return () => clearTimeout(timeout);
  }, [selected, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.matched)) {
      const timeout = setTimeout(() => navigation.replace('Match'), 800);
      return () => clearTimeout(timeout);
    }
  }, [cards, navigation]);

  const matchedPairs = cards.filter((card) => card.matched).length / 2;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.container}>
        <Text style={styles.title}>Encuentra los pares</Text>
        <Text style={styles.progress}>Pares encontrados: {matchedPairs}/3</Text>
        <View style={styles.grid}>
          {cards.map((card) => (
            <Card key={card.id} card={card} onPress={handleCardPress} disabled={locked} />
          ))}
        </View>
        <Text style={styles.help}>Toca dos cartas iguales.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  progress: { fontSize: 18, color: Colors.muted, marginBottom: 18 },
  grid: { width: 330, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  help: { fontSize: 17, color: Colors.muted, marginTop: 16 },
});
