import { useEffect, useRef, useState } from 'react';

import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { Audio } from 'expo-av';

import { useMusic } from '../context/MusicContext';

const HELP_DURATION = 3000;
const FADE_DURATION = 400;

export default function Footer({
  helpText,
  audioSource,
  containerStyle,
}) {
  const [visibleText, setVisibleText] = useState(null);
  const [isPlayingHelp, setIsPlayingHelp] = useState(false);

  const {
    isMuted,
    isMusicReady,
    toggleMusic,
  } = useMusic();

  const opacity = useRef(
    new Animated.Value(0)
  ).current;

  const hideTimeout = useRef(null);
  const helpSoundRef = useRef(null);

  useEffect(() => {
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }

      if (helpSoundRef.current) {
        helpSoundRef.current.unloadAsync();
        helpSoundRef.current = null;
      }
    };
  }, []);

  const showHelpText = () => {
    if (!helpText) {
      return;
    }

    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }

    setVisibleText(helpText);
    opacity.setValue(1);

    hideTimeout.current = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_DURATION,
        useNativeDriver: true,
      }).start(() => {
        setVisibleText(null);
      });
    }, HELP_DURATION);
  };

  const playHelpAudio = async () => {
    if (!audioSource) {
      return;
    }

    try {
      if (helpSoundRef.current) {
        await helpSoundRef.current.stopAsync();
        await helpSoundRef.current.unloadAsync();
        helpSoundRef.current = null;
      }

      setIsPlayingHelp(true);

      const { sound } = await Audio.Sound.createAsync(
        audioSource,
        {
          shouldPlay: true,
          volume: 1,
        }
      );

      helpSoundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) {
          return;
        }

        if (status.didJustFinish) {
          setIsPlayingHelp(false);

          sound.unloadAsync();
          helpSoundRef.current = null;
        }
      });
    } catch (error) {
      console.log(
        'Error al reproducir el audio de ayuda:',
        error
      );

      setIsPlayingHelp(false);
    }
  };

  const handleHelpPress = async () => {
    showHelpText();
    await playHelpAudio();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Pressable
        onPress={handleHelpPress}
        disabled={isPlayingHelp}
        style={({ pressed }) => [
          styles.sideButton,
          pressed && styles.pressed,
          isPlayingHelp && styles.disabled,
        ]}
      >
        <Image
          source={require(
            '../assets/img/FELIZ_Figuralicia.png'
          )}
          style={styles.sideImage}
          resizeMode="contain"
        />
      </Pressable>

      <View style={styles.helpTextContainer}>
        {visibleText && (
          <Animated.Text
            style={[
              styles.helpText,
              {
                opacity,
              },
            ]}
            numberOfLines={2}
          >
            {visibleText}
          </Animated.Text>
        )}
      </View>

      <Pressable
        onPress={toggleMusic}
        disabled={!isMusicReady}
        style={({ pressed }) => [
          styles.sideButton,
          pressed && styles.pressed,
          !isMusicReady && styles.disabled,
        ]}
      >
        <Image
          source={
            isMuted
              ? require('../assets/img/MUTE.png')
              : require('../assets/img/MUSICA.png')
          }
          style={styles.sideImage}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
	marginBottom: 20,
  },

  sideButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sideImage: {
    width: 65,
    height: 65,
  },

  helpTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  helpText: {
    fontSize: 15,
    fontFamily: 'Comic Sans MS',
    color: '#FBAB20',
    textAlign: 'center',
  },

  pressed: {
    opacity: 0.75,
    transform: [
      {
        scale: 0.94,
      },
    ],
  },

  disabled: {
    opacity: 0.5,
  },
});