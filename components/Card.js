import { Image, Pressable, StyleSheet } from 'react-native';

export default function Card({ card, onPress, disabled }) {
  const visible = card.flipped || card.matched;

  return (
    <Pressable
      onPress={() => onPress(card.id)}
      disabled={disabled || visible}
      style={({ pressed }) => [
        styles.card,
        pressed && !visible && styles.pressed,
      ]}
    >
      <Image
        source={
          visible
            ? card.image
            : require('../assets/img/CARTA_ATRAS.png')
        }
        style={styles.cardImage}
        resizeMode="contain"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    height: 135,
    margin: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardImage: {
    width: 180,
    height: 180,
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});

