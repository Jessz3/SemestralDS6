export const figures = [
  { id: 'dog', name: 'Perro', emoji: '🐶', audio: require('../assets/audio/perro.wav') },
  { id: 'cat', name: 'Gato', emoji: '🐱', audio: require('../assets/audio/gato.wav') },
  { id: 'car', name: 'Carro', emoji: '🚗', audio: require('../assets/audio/carro.wav') },
  { id: 'apple', name: 'Manzana', emoji: '🍎', audio: require('../assets/audio/manzana.wav') },
];

export const memoryPairs = figures.slice(0, 3);
export const audioRounds = figures.slice(0, 3);
