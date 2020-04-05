import * as React from 'react';
import { StyleSheet, View, Image, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Firebase from '../components/Firebase'


//it seems like you can use functions or classes, but classes are easier if you are new? cleasses extend react components and functions use hooks to hook onto react components
export default function LoginScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (

    <View style={styles.container}>

      <View style={styles.logoContainer}>
      <Image source={require('../assets/images/localr_logo.png')} style={styles.image} />
      </View>

      <View style={styles.contentContainer}>

      <View style={styles.input} //this is a dirty fix by wrapping the buttons and inputs in a view to apply css properties to it
      >
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
          <Button style={styles.Button} title="Sign Up"
          onPress={() => SignUp(email, password)} 
          />
        </View>
      </View>
    </View>
  );
}

function SignUp (email, password) {
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


function LogIn (email, password) {
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
    paddingTop: 15
  },
  button: {
    marginTop: 10
  },
  input: {
    marginTop: 10
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
    marginRight: 10
  },
});
