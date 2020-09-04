import * as React from 'react';
import { Text, TextInput, View, StyleSheet, Alert, ImageBackground, Image } from 'react-native';
import Constants from 'expo-constants';
//import * as firebase from "firebase";
import { Button } from 'react-native-elements';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Divider } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Firebase from '../components/Firebase'


const image = { uri: 'assets\images\localr_logo_transparent_2.png' };






const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tinyLogo: {
        width: 150,
        height: 150,
    },

    text: {
        fontSize: 20,
        textAlign: 'center'
    },
    input: {
        alignSelf: 'center',
        height: 40,
        borderWidth: 1,
        width: 200
    }
})

function StartScreen(props) {
  /**
    constructor(props) {
        super(props);
        this.state = {
            Email: '',
            Password: '',
        }
    }
    */
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const SignUp = (email, password) => {
      Firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function (user) {
        props.navigation.navigate("MainScreen");
      }).catch(function (e) {
        alert("Invalid email address or password");
      })
    }
      /**
        try {
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(user => {//Should navigate user to our main page
                    props.navigation.navigate("MainScreen");
                    console.log(user);
                });
        } catch (error) {
            console.log(email, password);
            console.log(error.toString(error));
        }
    };
    */


    const LogIn = (email, password) => {
      Firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function (user) {
        props.navigation.navigate("MainScreen");
      }).catch(function (e) {
        alert("Invalid email address or password");
      })
    }
      /**
        try {
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(res => {
                    console.log("Sign in");
                    props.navigation.navigate("MainScreen");
                });
        } catch (error) {
            alert("Invalid email or password");
            console.log("ERROR sigining in");
            console.log(error.toString(error));
        }
    };
    */


        return (
            <View style={styles.appContainer}>
                <Image source={image} style={styles.tinyLogo}>
                </Image>

                <Input
                    placeholder='Email address'
                    leftIcon={
                        <Icon
                            name='envelope-square'
                            size={24}
                            color='black'
                        />
                    }
                    onChangeText={text => setEmail(text)}
                    value={email}
                />

                <Input

                    placeholder='Enter password'
                    secureTextEntry = {true}
                    leftIcon={
                        <Icon
                            name='lock'
                            size={24}
                            color='black'
                        />
                    }
                    onChangeText={text => setPassword(text)}
                />

                <Button style={{ width: 200, alignSelf: 'center', marginTop: 10, marginBottom: 10 }} title="Log In" onPress={() => LogIn(email, password)} />
                <Button style={{ width: 200, alignSelf: 'center' }} title="Sign Up" onPress={() => SignUp(email, password)} />
                <Button title="Forgot Password" type="clear" onPress={() => props.navigation.navigate('ForgotPasswordScreen')}/>
                <Button title="Skip" type="clear" onPress={() => props.navigation.navigate("MainScreen")}/>

            </View>
        )
    //}
}
export default StartScreen;

