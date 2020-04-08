import * as React from 'react';
import { StyleSheet, View, Image, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Firebase from '../components/Firebase'

//it seems like you can use functions or classes, but classes are easier if you are new? cleasses extend react components and functions use hooks to hook onto react components
export default function LoginScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (

    <KeyboardAvoidingView
      behavior={Platform.Os == "ios" ? "padding" : "height"}
      style={styles.container}
    >

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.contentContainer}>

          <View style={styles.logoContainer}>
            <Image source={require('../assets/images/localr_logo_transparent_2.png')} style={styles.image} />
          </View>

          <View style={styles.input}>
            <Input
              placeholder='Email address'
              leftIcon={
                <Icon
                  name='envelope-square'
                  size={24}
                  color='black'
                  style={styles.icon}
                />
              }
              onChangeText={email => setEmail(email)}
              value={email}
            />
          </View>

          <View style={styles.input}>
            <Input
              placeholder='Enter password'
              leftIcon={
                <Icon
                  name='lock'
                  size={24}
                  color='black'
                  style={styles.icon}
                />
              }
              onChangeText={password => setPassword(password)}
              value={password}
            />
          </View>


          <View style={styles.button}>
            <Button title="Log In"
              onPress={() => LogIn(email, password)}
            />
          </View>

          <View style={styles.button}>
            <Button title="Sign Up"
              onPress={() => SignUp(email, password)}
            />
          </View>
          <View style={styles.mapDrawerOverlay} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

function SignUp(email, password) {
  try {
    Firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        console.log(user);
      });
  } catch (error) {
    console.log(error.toString(error));
  }
};


function LogIn(email, password) {
  try {
    Firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log(res.user.email);
        Alert.alert(res.user.email);
      });
  } catch (error) {
    console.log(error.toString(error));
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    justifyContent: "space-around",
    paddingTop: 15
  },
  button: {
    paddingTop: 10
  },
  input: {
    paddingTop: 10
  },
  image: {
    height: 200,
    width: 200,
    resizeMode: 'contain',
  },
  logoContainer: {
    alignItems: 'center',
  },
  icon: {
    paddingRight: 10
  },
  inner: {
    flex: 1,
    justifyContent: "space-around"
  },
  mapDrawerOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.0,
    height: "100%",
    width: 25,
  },
});
