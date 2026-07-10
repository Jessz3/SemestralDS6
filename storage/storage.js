import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  playerName: '@minikids/playerName',
  startTime: '@minikids/startTime',
  history: '@minikids/history',
};

export async function startGame(name) {
  const startTime = Date.now();
  await AsyncStorage.multiSet([
    [KEYS.playerName, name.trim()],
    [KEYS.startTime, String(startTime)],
  ]);
  return startTime;
}

export async function getGameSession() {
  const values = await AsyncStorage.multiGet([KEYS.playerName, KEYS.startTime]);
  const data = Object.fromEntries(values);
  return {
    name: data[KEYS.playerName] ?? '',
    startTime: Number(data[KEYS.startTime] ?? Date.now()),
  };
}

export async function saveResult(result) {
  const raw = await AsyncStorage.getItem(KEYS.history);
  const history = raw ? JSON.parse(raw) : [];
  const updated = [result, ...history].slice(0, 20);
  await AsyncStorage.setItem(KEYS.history, JSON.stringify(updated));
}

export async function getHistory() {
  const raw = await AsyncStorage.getItem(KEYS.history);
  return raw ? JSON.parse(raw) : [];
}
