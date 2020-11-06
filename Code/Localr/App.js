import * as React from 'react';
import { StyleSheet } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AuthNavigator from './navigation/AuthNavigator'
import * as Permissions from 'expo-permissions';

//DISABLES WARNINGS WHEN THE APP IS RUNNING, COMMENT THIS OUT WHEN DOING DEVELOPMENT
console.disableYellowBox = true;
////////////////////////////////////////////////////////////////////////////////////

//this is one way to create a function in react native, I will be using arrow functions from now on.
export default function App(props) {
  //hooks
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [permission, askForPermission] = Permissions.usePermissions(Permissions.LOCATION, { ask: true });
  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

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
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <AuthNavigator/>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
