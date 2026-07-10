import { useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Line } from 'react-native-svg';
import Colors from '../styles/colors';
import { memoryPairs } from '../utils/gameData';
import shuffle from '../utils/shuffle';

export default function MatchGameScreen({ navigation }) {
  const leftItems = memoryPairs;
  const rightItems = useMemo(() => shuffle(memoryPairs), []);
  const boardRef = useRef(null);
  const boardWindow = useRef({ x: 0, y: 0 });
  const positions = useRef({ left: {}, right: {} });
  const itemRefs = useRef({ left: {}, right: {} });
  const [connections, setConnections] = useState([]);
  const [dragLine, setDragLine] = useState(null);

  const measureBoard = () => {
    boardRef.current?.measureInWindow((x, y) => {
      boardWindow.current = { x, y };
    });
  };

  const savePosition = (side, id) => {
    requestAnimationFrame(() => {
      const item = itemRefs.current[side][id];
      if (!item || !boardRef.current) return;
      item.measureLayout(
        boardRef.current,
        (x, y, width, height) => {
          positions.current[side][id] = {
            x, y, width, height,
            centerX: x + width / 2,
            centerY: y + height / 2,
          };
        },
        () => {}
      );
    });
  };

  const isConnected = (id) => connections.some((item) => item.id === id);

  const finishConnection = (leftId, localX, localY) => {
    const targetEntry = Object.entries(positions.current.right).find(([, box]) =>
      localX >= box.x && localX <= box.x + box.width &&
      localY >= box.y && localY <= box.y + box.height
    );

    if (targetEntry) {
      const [rightId] = targetEntry;
      if (rightId === leftId && !isConnected(leftId)) {
        const start = positions.current.left[leftId];
        const end = positions.current.right[rightId];
        const next = [...connections, {
          id: leftId,
          x1: start.centerX,
          y1: start.centerY,
          x2: end.centerX,
          y2: end.centerY,
        }];
        setConnections(next);
        if (next.length === leftItems.length) {
          setTimeout(() => navigation.replace('Audio'), 700);
        }
      }
    }
    setDragLine(null);
  };

  const createResponder = (id) => PanResponder.create({
    onStartShouldSetPanResponder: () => !isConnected(id),
    onMoveShouldSetPanResponder: () => !isConnected(id),
    onPanResponderGrant: () => {
      measureBoard();
      const start = positions.current.left[id];
      if (start) setDragLine({ id, x1: start.centerX, y1: start.centerY, x2: start.centerX, y2: start.centerY });
    },
    onPanResponderMove: (_, gesture) => {
      const x = gesture.moveX - boardWindow.current.x;
      const y = gesture.moveY - boardWindow.current.y;
      const start = positions.current.left[id];
      if (start) setDragLine({ id, x1: start.centerX, y1: start.centerY, x2: x, y2: y });
    },
    onPanResponderRelease: (_, gesture) => {
      finishConnection(
        id,
        gesture.moveX - boardWindow.current.x,
        gesture.moveY - boardWindow.current.y
      );
    },
    onPanResponderTerminate: () => setDragLine(null),
  });

  const responders = useMemo(
    () => Object.fromEntries(leftItems.map((item) => [item.id, createResponder(item.id)])),
    // Connections are intentionally included so connected elements become disabled.
    [connections]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.container}>
        <Text style={styles.title}>Une las figuras iguales</Text>
        <Text style={styles.help}>Arrastra desde la izquierda hasta su pareja.</Text>

        <View ref={boardRef} style={styles.board} onLayout={measureBoard}>
          <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
            {connections.map((line) => (
              <Line key={line.id} {...line} stroke={Colors.success} strokeWidth="7" strokeLinecap="round" />
            ))}
            {dragLine && <Line {...dragLine} stroke={Colors.primary} strokeWidth="6" strokeLinecap="round" />}
          </Svg>

          <View style={styles.column}>
            {leftItems.map((item) => (
              <View
                key={item.id}
                ref={(ref) => { itemRefs.current.left[item.id] = ref; }}
                onLayout={() => savePosition('left', item.id)}
                style={[styles.figure, isConnected(item.id) && styles.connected]}
                {...responders[item.id].panHandlers}
              >
                <Text style={styles.emoji}>{item.emoji}</Text>
              </View>
            ))}
          </View>

          <View style={styles.column}>
            {rightItems.map((item) => (
              <View
                key={item.id}
                ref={(ref) => { itemRefs.current.right[item.id] = ref; }}
                onLayout={() => savePosition('right', item.id)}
                style={[styles.figure, isConnected(item.id) && styles.connected]}
              >
                <Text style={styles.emoji}>{item.emoji}</Text>
              </View>
            ))}
          </View>
        </View>
        <Text style={styles.progress}>Conexiones: {connections.length}/3</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, alignItems: 'center', paddingTop: 22, paddingHorizontal: 16 },
  title: { fontSize: 27, fontWeight: '800', color: Colors.text, textAlign: 'center' },
  help: { fontSize: 17, color: Colors.muted, textAlign: 'center', marginTop: 7, marginBottom: 16 },
  board: {
    width: '100%', maxWidth: 390, height: 390, flexDirection: 'row',
    justifyContent: 'space-between', paddingHorizontal: 18, position: 'relative',
  },
  column: { height: '100%', justifyContent: 'space-around' },
  figure: {
    width: 92, height: 92, borderRadius: 46, backgroundColor: Colors.white,
    justifyContent: 'center', alignItems: 'center', borderWidth: 3,
    borderColor: Colors.secondary, elevation: 3,
  },
  connected: { borderColor: Colors.success, backgroundColor: '#EAFBE3' },
  emoji: { fontSize: 48 },
  progress: { fontSize: 18, color: Colors.muted, marginTop: 12 },
});
