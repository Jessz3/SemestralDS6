export const figures = [
  { id: 'triangulo', name: 'Triángulo', memoryImage: require('../assets/img/CARTA_TRIANGULO.png'), image: require('../assets/img/TRIANGULO.png'), audio: require('../assets/audio/Triangulo.mp3'), color: '#61AE08' },
  { id: 'cuadrado', name: 'Cuadrado', memoryImage: require('../assets/img/CARTA_CUADRADO.png'), image: require('../assets/img/CUADRADO.png'), audio: require('../assets/audio/Cuadrado.mp3'), color: '#EC5B29' },
  { id: 'circulo', name: 'Círculo', memoryImage: require('../assets/img/CARTA_CIRCULO.png'), image: require('../assets/img/CIRCULO.png'), audio: require('../assets/audio/Circulo.mp3'), color: '#AE2917' },
  { id: 'estrella', name: 'Estrella', memoryImage: require('../assets/img/CARTA_ESTRELLA.png'), image: require('../assets/img/ESTRELLA.png'), audio: require('../assets/audio/Estrella.mp3'), color: '#F1AC23' },
];

export const memoryPairs = figures.slice(0, 3);
export const audioRounds = figures;
export const matchPairs = figures;