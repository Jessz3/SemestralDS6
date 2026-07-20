import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Audio } from 'expo-av';

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isMusicReady, setIsMusicReady] = useState(false);

  const musicRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const startBackgroundMusic = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
        });

        const { sound } = await Audio.Sound.createAsync(
          require('../assets/audio/bgMusic.mp3'),
          {
            shouldPlay: true,
            isLooping: true,
            volume: 0.15,
            isMuted: false,
          }
        );

        if (!isMounted) {
          await sound.unloadAsync();
          return;
        }

        musicRef.current = sound;
        setIsMusicReady(true);
      } catch (error) {
        console.log(
          'No se pudo reproducir la música de fondo:',
          error
        );
      }
    };

    startBackgroundMusic();

    return () => {
      isMounted = false;

      if (musicRef.current) {
        musicRef.current.unloadAsync();
        musicRef.current = null;
      }
    };
  }, []);

  const toggleMusic = async () => {
    if (!musicRef.current || !isMusicReady) {
      return;
    }

    try {
      const newMutedState = !isMuted;

      await musicRef.current.setIsMutedAsync(newMutedState);
      setIsMuted(newMutedState);
    } catch (error) {
      console.log(
        'No se pudo cambiar el estado de la música:',
        error
      );
    }
  };

  return (
    <MusicContext.Provider
      value={{
        isMuted,
        isMusicReady,
        toggleMusic,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);

  if (!context) {
    throw new Error(
      'useMusic debe utilizarse dentro de MusicProvider'
    );
  }

  return context;
}