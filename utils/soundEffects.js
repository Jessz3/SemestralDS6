import { Audio } from 'expo-av';

let correctSound = null;

export async function playCorrectSound() {
  try {
    // Evita que varias reproducciones se superpongan.
    if (correctSound) {
      await correctSound.stopAsync();
      await correctSound.unloadAsync();
      correctSound = null;
    }

    const { sound } = await Audio.Sound.createAsync(
      require('../assets/audio/CORRECTO.mp3'),
      {
        shouldPlay: true,
        volume: 0.5,
      }
    );

    correctSound = sound;

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
        correctSound = null;
      }
    });
  } catch (error) {
    console.log('No se pudo reproducir CORRECTO.mp3:', error);
  }
}