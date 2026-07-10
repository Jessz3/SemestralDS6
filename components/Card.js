import { Pressable, StyleSheet, Text } from 'react-native';
import Colors from '../styles/colors';

export default function Card({ card, onPress, disabled }) {
  const visible = card.flipped || card.matched;

  return (
    <Pressable
      onPress={() => onPress(card.id)}
      disabled={disabled || visible}
      style={({ pressed }) => [
        styles.card,
        visible ? styles.front : styles.back,
        card.matched && styles.matched,
        pressed && !visible && styles.pressed,
      ]}
    >
      <Text style={styles.symbol}>{visible ? card.emoji : '❓'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 92,
    height: 112,
    margin: 8,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  back: { backgroundColor: Colors.cardBack },
  front: { backgroundColor: Colors.white, borderWidth: 3, borderColor: Colors.secondary },
  matched: { borderColor: Colors.success, backgroundColor: '#EAFBE3' },
  pressed: { opacity: 0.8 },
  symbol: { fontSize: 48 },
});
