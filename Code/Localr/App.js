import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './navigation/DrawerNavigator';

import useLinking from './navigation/useLinking';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import StartScreen from './screens/StartScreen';
import MainScreen from './screens/Main';
const Stack = createStackNavigator();

//DISABLES WARNINGS WHEN THE APP IS RUNNING, COMMENT THIS OUT WHEN DOING DEVELOPMENT
//console.disableYellowBox = true;
////////////////////////////////////////////////////////////////////////////////////

export default function App(props) {
  //hooks
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

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
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" gesture>
        <Stack.Screen name="StartScreen" component={StartScreen} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
        <Stack.Screen name = "MainScreen" component={MainScreen} options={{title: "Home", headerLeft: null, gestureEnabled: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
