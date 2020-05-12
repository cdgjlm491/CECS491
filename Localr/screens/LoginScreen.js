import * as React from 'react';
import { StyleSheet, View, Image, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Firebase from '../components/Firebase'

//it seems like you can use functions or classes, but classes are easier if you are new? cleasses extend react components and functions use hooks to hook onto react components
export default function LoginScreen({navigation}) {
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
              secureTextEntry = {true}
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
            <Button style={{ width: 200, alignSelf: 'center', marginTop: 10, marginBottom: 10 }} title="Log In"
              onPress={() => LogIn(email, password, navigation)}
            />
          </View>

          <View style={styles.button}>
            <Button style={{ width: 200, alignSelf: 'center' }} title="Sign Up"
              onPress={() => SignUp(email, password, navigation)}
            />
            <Button title="Forgot Password" type="clear" onPress={() => navigation.navigate("ForgotPasswordScreen")}/>
          </View>
          <View style={styles.mapDrawerOverlay} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

function SignUp(email, password, navigation) {
  Firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function (user) {
        navigation.navigate('Home');
      }).catch(function (e) {
        alert("Invalid email address or password");
      })
};


function LogIn(email, password, navigation) {
  Firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function (user) {
        navigation.navigate("Home");
      }).catch(function (e) {
        alert("Invalid email address or password");
      })
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
