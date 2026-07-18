export const figures = [
  { id: 'triangulo', name: 'Triángulo', memoryImage: require('../assets/img/CARTA_TRIANGULO.png'), image: require('../assets/img/TRIANGULO.png'), audio: require('../assets/audio/perro.wav') },
  { id: 'cuadrado', name: 'Cuadrado', memoryImage: require('../assets/img/CARTA_CUADRADO.png'), image: require('../assets/img/CUADRADO.png'), audio: require('../assets/audio/gato.wav') },
  { id: 'circulo', name: 'Círculo', memoryImage: require('../assets/img/CARTA_CIRCULO.png'), image: require('../assets/img/CIRCULO.png'), audio: require('../assets/audio/carro.wav') },
  { id: 'estrella', name: 'Estrella', memoryImage: require('../assets/img/CARTA_ESTRELLA.png'), image: require('../assets/img/ESTRELLA.png'), audio: require('../assets/audio/manzana.wav') },
];

export const memoryPairs = figures.slice(0, 3);
export const audioRounds = figures.slice(0, 3);
