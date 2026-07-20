import { useEffect, useMemo, useState } from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Card from '../components/Card';
import Header from '../components/Header';
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
      source={require('../assets/img/FONDO_PLANO.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>

            <Header
              title="Encuentra los pares"
              onPause={() => navigation.navigate('Pause')}
              containerStyle={styles.header}
              titleStyle={styles.title}
            />

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
            Toca dos cartas iguales y emparéjalas
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
    top: 20,
  },

  header: {
    marginTop: 12,
  },

  title: {
    fontSize: 30,
    color: '#FF8C00',
    fontFamily: 'Comic Sans MS',
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
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
    fontSize: 15,
    fontWeight: '700',
    color: '#fcff50',
    textAlign: 'center',
  },

  overlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(255,255,255,0.70)',
},
});