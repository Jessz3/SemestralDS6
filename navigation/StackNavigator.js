import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import MemoryGameScreen from '../screens/MemoryGameScreen';
import MatchGameScreen from '../screens/MatchGameScreen';
import AudioGameScreen from '../screens/AudioGameScreen';
import ResultScreen from '../screens/ResultScreen';
import Colors from '../styles/colors';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'MiniKids' }} />
        <Stack.Screen name="Memory" component={MemoryGameScreen} options={{ title: 'Juego de memoria' }} />
        <Stack.Screen name="Match" component={MatchGameScreen} options={{ title: 'Conecta las figuras' }} />
        <Stack.Screen name="Audio" component={AudioGameScreen} options={{ title: 'Escucha y elige' }} />
        <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Resultado' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
