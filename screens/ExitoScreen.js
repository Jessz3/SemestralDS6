import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SuccessScreen({ navigation, route }) {

  const {
    nextScreen = 'Home',
    gameName = 'este juego',
  } = route.params || {};

  return (
    <ImageBackground
      source={require('../assets/img/FONDO_PLANO.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safe}>

        <View style={styles.container}>
          

          <View style={styles.infoCard}>

            <View style={styles.starsContainer}>
              <Image
                source={require('../assets/img/ESTRELLA.png')}
                style={styles.star}
                resizeMode="contain"
              />
              <Image
                source={require('../assets/img/ESTRELLA.png')}
                style={[styles.star, styles.starCenter]}
                resizeMode="contain"
              />
              <Image
                source={require('../assets/img/ESTRELLA.png')}
                style={styles.star}
                resizeMode="contain"
              />
            </View>


            <Text style={styles.title}>
              ¡MUY BIEN!
            </Text>

            <Text style={styles.message}>
              Has completado {gameName}.
            </Text>

            <Pressable
              onPress={() => navigation.replace(nextScreen)}
              style={({ pressed }) => [
                styles.buttonContainer,
                pressed && styles.pressed,
              ]}
            >
              <Image
                source={require('../assets/img/TRIANGULO.png')}
                style={[styles.button, styles.rotatedButton]}
                resizeMode="contain"
              />
            </Pressable>

          </View>

          <View style={styles.starsDecor}>
            <Image
              source={require('../assets/img/ESTRELLA.png')}
              style={styles.star}
              resizeMode="contain"
            />
            <View style={styles.starLine} />
            <Image
              source={require('../assets/img/ESTRELLA.png')}
              style={styles.star}
              resizeMode="contain"
            />
          </View>

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
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoCard: {
    width: '88%',
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderRadius: 30,
    paddingVertical: 35,
    paddingHorizontal: 25,
    alignItems: 'center',

    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFD400',

    textShadowColor: '#000',
    textShadowOffset: {
      width: 2,
      height: 2,
    },
    textShadowRadius: 2,
  },

  subtitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#222',
    marginTop: 15,
  },

  message: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },

  buttonContainer: {
    marginTop: 10,
  },

  button: {
    width: 90,
    height: 90,
  },

  rotatedButton: {
    transform: [{ rotate: '90deg' }],
  },

  pauseButton: {
    position: 'absolute',
    top: 12,
    right: 18,
    zIndex: 20,
  },

  pauseImage: {
    width: 48,
    height: 48,
  },

  pressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.8,
  },

  starsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 32,
  },

  star: {
    width: 70,
    height: 70,
  },

  starCenter: {
    width: 90,
    height: 90,
    marginBottom: 14,
  },

  starsDecor: {
    position: 'absolute',
    bottom: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  starLine: {
    width: 140,
    height: 6,
    backgroundColor: '#FFD400',
    borderRadius: 5,
    marginHorizontal: 10,
  },

});