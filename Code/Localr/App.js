import * as React from 'react';
import { StyleSheet, LogBox } from 'react-native';
import * as SplashScreen from 'expo-splash-screen'
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AuthNavigator from './navigation/AuthNavigator'
import * as Permissions from 'expo-permissions';
//import { AppearanceProvider } from 'react-native-appearance';

LogBox.ignoreLogs(['Setting a timer'])


//this is one way to create a function in react native, I will be using arrow functions from now on.
export default function App(props) {
  //hooks
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [permission, askForPermission] = Permissions.usePermissions(Permissions.LOCATION, { ask: true });
  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      //<AppearanceProvider>
      <AuthNavigator/>
      //</AppearanceProvider>
    );
  }
}