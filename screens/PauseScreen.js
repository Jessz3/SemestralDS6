import { useState } from 'react';
import { Image, ImageBackground, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PauseScreen({ navigation }) {

  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleExit = () => {
    setConfirmVisible(false);
    navigation.replace('Home');
  };

  return (

    <ImageBackground
      source={require('../assets/img/FONDO_PLANO.png')}
      style={styles.background}
      resizeMode="cover"
    >

      <SafeAreaView style={styles.safe}>

        <View style={styles.container}>

          <View style={styles.infoCard}>

            <Image
              source={require('../assets/img/BOTON_PAUSA.png')}
              style={styles.titleImg}
              resizeMode="contain"
            />

            <View style={styles.buttonsRow}>

              <Pressable
                onPress={() => setConfirmVisible(true)}
                style={({ pressed }) => [
                  styles.buttonContainer,
                  pressed && styles.pressed
                ]}
              >
                <Image
                  source={require('../assets/img/SALIR.png')}
                  style={styles.button}
                  resizeMode="contain"
                />
              </Pressable>

              <Pressable
                onPress={() => navigation.goBack()}
                style={({ pressed }) => [
                  styles.buttonContainer,
                  pressed && styles.pressed
                ]}
              >
                <Image
                  source={require('../assets/img/CONTINUAR.png')}
                  style={styles.button}
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

      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={styles.modalOverlay}>

          <View style={styles.confirmCard}>

            <Image
              source={require('../assets/img/ENOJADA_Figuralicia.png')}
              style={styles.confirmImage}
              resizeMode="contain"
            />

            <Text style={styles.confirmTitle}>
              ¿SEGURO?
            </Text>

            <Text style={styles.confirmMessage}>
              ¡Si sales ahora, tendrás que empezar el juego de nuevo!
            </Text>

            <View style={styles.buttonsRow}>

              <Pressable
                onPress={() => setConfirmVisible(false)}
                style={({ pressed }) => [
                  styles.buttonContainer,
                  pressed && styles.pressed
                ]}
              >
                <Image
                  source={require('../assets/img/SALIR.png')}
                  style={styles.button}
                  resizeMode="contain"
                />
              </Pressable>

              <Pressable
                onPress={handleExit}
                style={({ pressed }) => [
                  styles.buttonContainer,
                  pressed && styles.pressed
                ]}
              >
                <Image
                  source={require('../assets/img/CONTINUAR.png')}
                  style={styles.button}
                  resizeMode="contain"
                />
              </Pressable>

            </View>

          </View>

        </View>
      </Modal>

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
    borderColor: '#FBAB20',
  },

  titleImg: {
    width: 250,
    height: 120,
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
    width: 100,
    height: 100,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  confirmCard: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FBAB20',
  },

  confirmImage: {
    width: 140,
    height: 140,
    marginBottom: 5,
  },

  confirmTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#9D1117',
    textShadowColor: '#FFF',
    textShadowOffset: {
      width: 2,
      height: 2,
    },
    textShadowRadius: 2,
  },

  confirmMessage: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 22,
  },

});