import { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Card from '../components/Card';
import { memoryPairs } from '../utils/gameData';
import shuffle from '../utils/shuffle';

function createDeck() {
  return shuffle(
    memoryPairs.flatMap((item) => [
      {
        id: `${item.id}-1`,
        pairId: item.id,
        image: item.memoryImage,
        flipped: false,
        matched: false,
      },
      {
        id: `${item.id}-2`,
        pairId: item.id,
        image: item.memoryImage,
        flipped: false,
        matched: false,
      },
    ])
  );
}

export default function MemoryGameScreen({ navigation }) {
  const initialDeck = useMemo(createDeck, []);

  const [cards, setCards] = useState(initialDeck);
  const [selected, setSelected] = useState([]);
  const [locked, setLocked] = useState(false);

  const handleCardPress = (id) => {
    if (locked || selected.length === 2) {
      return;
    }

    setCards((current) =>
      current.map((card) =>
        card.id === id
          ? { ...card, flipped: true }
          : card
      )
    );

    setSelected((current) => [...current, id]);
  };

  useEffect(() => {
    if (selected.length !== 2) {
      return;
    }

    const [firstId, secondId] = selected;

    const first = cards.find((card) => card.id === firstId);
    const second = cards.find((card) => card.id === secondId);

    if (!first || !second) {
      return;
    }

    setLocked(true);

    const isMatch = first.pairId === second.pairId;

    const timeout = setTimeout(() => {
      setCards((current) =>
        current.map((card) => {
          if (
            card.id !== firstId &&
            card.id !== secondId
          ) {
            return card;
          }

          return isMatch
            ? {
                ...card,
                matched: true,
                flipped: true,
              }
            : {
                ...card,
                flipped: false,
              };
        })
      );

      setSelected([]);
      setLocked(false);
    }, isMatch ? 300 : 600);

    return () => clearTimeout(timeout);
  }, [selected, cards]);

  useEffect(() => {
    if (
      cards.length > 0 &&
      cards.every((card) => card.matched)
    ) {
      const timeout = setTimeout(() => {
        navigation.replace('Exito', {
          nextScreen: 'Match',
          gameName: 'el juego de memoria',
        });
      }, 800);

      return () => clearTimeout(timeout);
    }
  }, [cards, navigation]);

  const matchedPairs =
    cards.filter((card) => card.matched).length / 2;

  return (
    <ImageBackground
      backgroundColor="#c9e3f9"
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>

          <Pressable
            onPress={() => navigation.navigate('Pause')}
            style={styles.pauseButton}
          >
            <Image
              source={require('../assets/img/PAUSA.png')}
              style={styles.pauseImage}
              resizeMode="contain"
            />
          </Pressable>

          <Text style={styles.title}>
            Encuentra los pares
          </Text>

          <Text style={styles.progress}>
            Pares encontrados: {matchedPairs}/3
          </Text>

          <View style={styles.grid}>
            {cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                onPress={handleCardPress}
                disabled={locked}
              />
            ))}
          </View>

          <Text style={styles.help}>
            Toca dos cartas iguales.
          </Text>

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
    padding: 16,
  },

  title: {
    marginTop: 35,
    fontSize: 38,
    fontWeight: '900',
    color: '#FF8C00',
    textAlign: 'center'
  },

  progress: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '700',

    color: '#000000',
  },

  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginTop: 30,
    rowGap: 15,
  },

  help: {
    marginTop: 20,
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
  },

  pauseButton: {
    position: 'absolute',
    top: 12,
    right: 18,
    zIndex: 20,
  },

  pauseImage: {
    width: 48,
    height: 48,
  },
});