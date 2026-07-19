import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import MemoryGameScreen from '../screens/MemoryGameScreen';
import MatchGameScreen from '../screens/MatchGameScreen';
import AudioGameScreen from '../screens/AudioGameScreen';
import ExitoScreen from '../screens/ExitoScreen';
import PauseScreen from '../screens/PauseScreen';
import ResultScreen from '../screens/ResultScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />

        <Stack.Screen
          name="Memory"
          component={MemoryGameScreen}
        />

        <Stack.Screen
          name="Match"
          component={MatchGameScreen}
        />

        <Stack.Screen
          name="Audio"
          component={AudioGameScreen}
        />

        <Stack.Screen
          name="Exito"
          component={ExitoScreen}
        />

        <Stack.Screen
          name="Pause"
          component={PauseScreen}
        />

        <Stack.Screen
          name="Result"
          component={ResultScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}