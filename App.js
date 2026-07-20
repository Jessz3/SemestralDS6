import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNavigator from './navigation/StackNavigator';
import { MusicProvider } from './context/MusicContext';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Comic Sans MS': require('./assets/fonts/Comic Sans MS.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <MusicProvider>
        <StackNavigator />
      </MusicProvider>
    </SafeAreaProvider>
  );
}
