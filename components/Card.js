import { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

export default function Card({ card, onPress, disabled }) {
  const visible = card.flipped || card.matched;

  const rotate = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    Animated.timing(rotate, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const backRotate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const frontRotate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <Pressable
      onPress={() => onPress(card.id)}
      disabled={disabled || visible}
      style={({ pressed }) => [
        styles.card,
        pressed && !visible && styles.pressed,
      ]}
    >
      {/* PARTE TRASERA */}
      <Animated.View
        style={[
          styles.face,
          {
            transform: [{ rotateY: backRotate }],
          },
        ]}
      >
        <Image
          source={require('../assets/img/CARTA_ATRAS.png')}
          style={styles.cardImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* PARTE DELANTERA */}
      <Animated.View
        style={[
          styles.face,
          styles.front,
          {
            transform: [{ rotateY: frontRotate }],
          },
        ]}
      >
        <Image
          source={card.image}
          style={styles.cardImage}
          resizeMode="contain"
        />
      </Animated.View>
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

  face: {
    position: 'absolute',
    width: 120,
    height: 135,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
  },

  front: {
    zIndex: 1,
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