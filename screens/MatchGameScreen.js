import { useMemo, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Line } from 'react-native-svg';

import Footer from '../components/Footer';
import Header from '../components/Header';
import { matchPairs } from '../utils/gameData';
import shuffle from '../utils/shuffle';

export default function MatchGameScreen({ navigation }) {
  const leftItems = matchPairs;

  const rightItems = useMemo(
    () => shuffle(matchPairs),
    []
  );

  const boardRef = useRef(null);

  const boardWindow = useRef({
    x: 0,
    y: 0,
  });

  const positions = useRef({
    left: {},
    right: {},
  });

  const itemRefs = useRef({
    left: {},
    right: {},
  });

  const [connections, setConnections] = useState([]);
  const [dragLine, setDragLine] = useState(null);

  const measureBoard = () => {
    boardRef.current?.measureInWindow((x, y) => {
      boardWindow.current = {
        x,
        y,
      };
    });
  };

  const savePosition = (side, id) => {
    requestAnimationFrame(() => {
      const item = itemRefs.current[side][id];

      if (!item || !boardRef.current) {
        return;
      }

      item.measureLayout(
        boardRef.current,
        (x, y, width, height) => {
          positions.current[side][id] = {
            x,
            y,
            width,
            height,
            centerX: x + width / 2,
            centerY: y + height / 2,
          };
        },
        () => {}
      );
    });
  };

  const isConnected = (id) => {
    return connections.some(
      (item) => item.id === id
    );
  };

  const finishConnection = (
    leftId,
    localX,
    localY
  ) => {
    const targetEntry = Object.entries(
      positions.current.right
    ).find(([, box]) =>
      localX >= box.x &&
      localX <= box.x + box.width &&
      localY >= box.y &&
      localY <= box.y + box.height
    );

    if (targetEntry) {
      const [rightId] = targetEntry;

      if (
        rightId === leftId &&
        !isConnected(leftId)
      ) {
        const start =
          positions.current.left[leftId];

        const end =
          positions.current.right[rightId];

        const sourceItem = leftItems.find(
          (item) => item.id === leftId
        );

        const next = [
          ...connections,
          {
            id: leftId,
            x1: start.centerX,
            y1: start.centerY,
            x2: end.centerX,
            y2: end.centerY,
            color: sourceItem?.color || '#000000',
          },
        ];

        setConnections(next);

        if (next.length === leftItems.length) {
          setTimeout(() => {
            navigation.replace('Exito', {
              nextScreen: 'Audio',
              gameName: 'el juego de parejas',
            });
          }, 700);
        }
      }
    }

    setDragLine(null);
  };

  const createResponder = (id) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () =>
        !isConnected(id),

      onMoveShouldSetPanResponder: () =>
        !isConnected(id),

      onPanResponderGrant: () => {
        measureBoard();

        const start =
          positions.current.left[id];

        const sourceItem = leftItems.find(
          (item) => item.id === id
        );

        if (start) {
          setDragLine({
            id,
            x1: start.centerX,
            y1: start.centerY,
            x2: start.centerX,
            y2: start.centerY,
            color: sourceItem?.color || '#000000',
          });
        }
      },

      onPanResponderMove: (_, gesture) => {
        const x =
          gesture.moveX -
          boardWindow.current.x;

        const y =
          gesture.moveY -
          boardWindow.current.y;

        const start =
          positions.current.left[id];

        const sourceItem = leftItems.find(
          (item) => item.id === id
        );

        if (start) {
          setDragLine({
            id,
            x1: start.centerX,
            y1: start.centerY,
            x2: x,
            y2: y,
            color: sourceItem?.color || '#000000',
          });
        }
      },

      onPanResponderRelease: (_, gesture) => {
        finishConnection(
          id,
          gesture.moveX -
            boardWindow.current.x,
          gesture.moveY -
            boardWindow.current.y
        );
      },

      onPanResponderTerminate: () =>
        setDragLine(null),
    });

  const responders = useMemo(
    () =>
      Object.fromEntries(
        leftItems.map((item) => [
          item.id,
          createResponder(item.id),
        ])
      ),
    [connections]
  );

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
            title="¡Une las figuras!"
              onPause={() => navigation.navigate('Pause')}
              containerStyle={styles.header}
              titleStyle={styles.title}
            />

          <View
            ref={boardRef}
            style={styles.board}
            onLayout={measureBoard}
          >

            {/* LÍNEAS */}
            <Svg
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            >
              {connections.map((line) => (
                <Line
                  key={line.id}
                  {...line}
                  stroke={line.color}
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              ))}

              {dragLine && (
                <Line
                  {...dragLine}
                  stroke={dragLine.color}
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              )}
            </Svg>

            {/* FIGURAS IZQUIERDA */}
            <View style={[styles.column, styles.leftColumn]}>
              {leftItems.map((item) => (
                <View
                  key={item.id}
                  ref={(ref) => {
                    itemRefs.current.left[item.id] = ref;
                  }}
                  onLayout={() =>
                    savePosition('left', item.id)
                  }
                  style={styles.figure}
                  {...responders[item.id].panHandlers}
                >
                  <Image
                    source={item.image}
                    style={styles.figureImage}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </View>

            {/* FIGURAS DERECHA */}
            <View style={[styles.column, styles.rightColumn]}>
              {rightItems.map((item) => (
                <View
                  key={item.id}
                  ref={(ref) => {
                    itemRefs.current.right[item.id] = ref;
                  }}
                  onLayout={() =>
                    savePosition('right', item.id)
                  }
                  style={styles.figure}
                >
                  <Image
                    source={item.image}
                    style={styles.figureImage}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </View>

          </View>

          <Footer
            helpText="¡Arrastra cada figura de la izquierda hasta su pareja!"
            containerStyle={styles.footer}
          />

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
    paddingTop: 22,
    paddingHorizontal: 16,
  },

  header: {
    marginTop: 4,
  },

  title: {
    fontSize: 30,
    color: '#FBAB20',
    fontFamily: 'Comic Sans MS',
  },

  board: {
    flex: 1,
    width: '100%',
    maxWidth: 500,

    flexDirection: 'row',
    justifyContent: 'space-between',

    paddingHorizontal: 0,

    position: 'relative',

    marginTop: 20,
  },

  column: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },

  leftColumn: {
    alignItems: 'flex-start',
    paddingLeft: 10
  },

  rightColumn: {
    alignItems: 'flex-end',
    paddingRight: 10,
  },

  figure: {
    width: 110,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },

  figureImage: {
    width: 150,
    height: 150,
  },

  progress: {
    fontSize: 18,
    color: '#000000',
    marginTop: 8,
    marginBottom: 12,
    fontWeight: '700',
  },

  footer: {
    marginTop: 'auto',
    paddingTop: 20,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.70)',
  },
});