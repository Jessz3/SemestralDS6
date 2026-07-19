import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PauseScreen({ navigation }) {

  return (

    <ImageBackground
      source={require('../assets/img/FONDO_PLANO.png')}
      style={styles.background}
      resizeMode="cover"
    >

      <SafeAreaView style={styles.safe}>

        <View style={styles.container}>

          <View style={styles.infoCard}>

            <Text style={styles.title}>
              PAUSA
            </Text>

            <Text style={styles.message}>
              Juego en pausa
            </Text>

            <View style={styles.buttonsRow}>

              <Pressable
                onPress={() => navigation.goBack()}
                style={({ pressed }) => [
                  styles.buttonContainer,
                  pressed && styles.pressed
                ]}
              >
                <Image
                  source={require('../assets/img/TRIANGULO.png')}
                  style={[styles.button, styles.rotatedButton]}
                  resizeMode="contain"
                />
              </Pressable>

              <Pressable
                onPress={() => navigation.replace('Home')}
                style={({ pressed }) => [
                  styles.buttonContainer,
                  pressed && styles.pressed
                ]}
              >
                <Image
                  source={require('../assets/img/SALIR.png')}
                  style={[styles.button, styles.exitButton]}
                  resizeMode="contain"
                />
              </Pressable>

            </View>

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
    paddingVertical: 45,
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

  message: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 25,
  },

  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonContainer: {
    marginHorizontal: 12,
  },

  button: {
    width: 90,
    height: 90,
  },

  rotatedButton: {
    transform: [{ rotate: '90deg' }],
  },

  pressed: {
    transform: [
      {
        scale: 0.92
      }
    ],
    opacity: 0.8,
  },

  starsDecor: {
    position: 'absolute',
    bottom: 35, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  star: {
    width: 70,
    height: 70,
  },

  starLine: {
    width: 140,
    height: 6,
    backgroundColor: '#FFD400',
    borderRadius: 5,
    marginHorizontal: 10,
  },

  exitButton: {
    opacity: 0.9,
  },

});