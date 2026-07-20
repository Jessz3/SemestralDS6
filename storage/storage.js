import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  playerName: '@minikids/playerName',
  startTime: '@minikids/startTime',
  totalPausedTime: '@minikids/totalPausedTime',
  pauseStartTime: '@minikids/pauseStartTime',
  history: '@minikids/history',
};

export async function startGame(name) {
  const cleanName = name?.trim() || 'Jugador';
  const newStartTime = Date.now();

  // Elimina completamente los datos temporales
  // de la partida anterior.
  await AsyncStorage.multiRemove([
    KEYS.startTime,
    KEYS.totalPausedTime,
    KEYS.pauseStartTime,
  ]);

  // Crea una sesión nueva desde cero.
  await AsyncStorage.multiSet([
    [KEYS.playerName, cleanName],
    [KEYS.startTime, String(newStartTime)],
    [KEYS.totalPausedTime, '0'],
  ]);

  return {
    name: cleanName,
    startTime: newStartTime,
  };
}

export async function restartGame(name) {
  return startGame(name);
}

/*
 * Registra el momento exacto en el que comienza la pausa.
 */
export async function pauseGame() {
  const existingPause =
    await AsyncStorage.getItem(KEYS.pauseStartTime);

  // Evita sobrescribir la pausa si ya estaba pausado.
  if (existingPause) {
    return;
  }

  await AsyncStorage.setItem(
    KEYS.pauseStartTime,
    String(Date.now())
  );
}

/*
 * Calcula cuánto duró la pausa y lo suma
 * al tiempo total pausado.
 */
export async function resumeGame() {
  const values = await AsyncStorage.multiGet([
    KEYS.pauseStartTime,
    KEYS.totalPausedTime,
  ]);

  const data = Object.fromEntries(values);

  const pauseStartTime = Number(
    data[KEYS.pauseStartTime] || 0
  );

  if (!pauseStartTime) {
    return;
  }

  const previousPausedTime = Number(
    data[KEYS.totalPausedTime] || 0
  );

  const currentPauseDuration =
    Date.now() - pauseStartTime;

  const updatedPausedTime =
    previousPausedTime + currentPauseDuration;

  await AsyncStorage.setItem(
    KEYS.totalPausedTime,
    String(updatedPausedTime)
  );

  await AsyncStorage.removeItem(KEYS.pauseStartTime);
}

export async function getGameSession() {
  const values = await AsyncStorage.multiGet([
    KEYS.playerName,
    KEYS.startTime,
    KEYS.totalPausedTime,
    KEYS.pauseStartTime,
  ]);

  const data = Object.fromEntries(values);

  return {
    name: data[KEYS.playerName] || 'Jugador',
    startTime: Number(data[KEYS.startTime] || Date.now()),
    totalPausedTime: Number(
      data[KEYS.totalPausedTime] || 0
    ),
    pauseStartTime: Number(
      data[KEYS.pauseStartTime] || 0
    ),
  };
}

/*
 * Devuelve solamente el tiempo jugado.
 * No cuenta el tiempo pasado en PauseScreen.
 */
export async function getElapsedGameTime() {
  const session = await getGameSession();

  let pausedTime = session.totalPausedTime;

  if (session.pauseStartTime) {
    pausedTime += Date.now() - session.pauseStartTime;
  }

  return Math.max(
    0,
    Date.now() - session.startTime - pausedTime
  );
}

export async function saveResult(result) {
  const raw = await AsyncStorage.getItem(KEYS.history);
  const history = raw ? JSON.parse(raw) : [];

  const updated = [result, ...history].slice(0, 20);

  await AsyncStorage.setItem(
    KEYS.history,
    JSON.stringify(updated)
  );
}

export async function getHistory() {
  const raw = await AsyncStorage.getItem(KEYS.history);

  return raw ? JSON.parse(raw) : [];
}