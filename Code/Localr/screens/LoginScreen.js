import React from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StatusBar } from 'react-native';
import { Button, Input, ThemeProvider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Firebase from '../components/Firebase'
import theme from '../components/Theme'
import * as firebase from 'firebase';


const StartScreen = (props) => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const image = require('../assets/images/localr_logo_transparent_2.png');

    return (
        <ThemeProvider theme={theme}>
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <Image source={image} style={styles.smallImage} />

                        <View style={styles.inputContainer}>
                            <Input
                                label='Enter Email'
                                placeholder='email@address.com'
                                leftIcon={
                                    <Icon
                                        name='envelope-square'
                                        size={24}
                                        color='black'
                                        style={styles.icon}
                                    />
                                }
                                onChangeText={text => setEmail(text)}
                                value={email}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Input
                                label='Enter Password'
                                placeholder='password'
                                secureTextEntry={true}
                                leftIcon={
                                    <Icon
                                        name='lock'
                                        size={24}
                                        color='black'
                                        style={styles.icon}
                                    />
                                }
                                onChangeText={text => setPassword(text)}
                            />
                        </View>

                        <View style={styles.buttonContainer}>
                            <Button title="Log In" onPress={() => login(email, password)} />
                            <Button title="Sign Up" onPress={() => signUp(email, password)} />
                            <Button title="Forgot Password" onPress={() => props.navigation.navigate('Forgot Password')} />
                            {
                                //<Button style={styles.smallButton} title="Sign In Anonymously (temp, for dev)" onPress={() => anonLogin()} />
                            }

                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ThemeProvider>

    )
}


const anonLogin = async () => {
    try {
        await Firebase.auth().signInAnonymously()
    } catch (e) {
        alert(e)
    }
}

const login = async (email, password) => {
    try {
        await Firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (e) {
        alert(e)
    }
}

const signUp = async (email, password) => {
    try {
        await Firebase.auth().createUserWithEmailAndPassword(email, password).then(token => {
            createUser(token)
        })
    } catch (e) {
        alert(e)
    }
}

const createUser = async (token) => {
    var firestore = Firebase.firestore();
    const userData = {
        name: 'void',
        email: token.user.email,
        interests: ['business', 'entertainment', 'health', 'politics', 'crime', 'science', 'sports', 'travel'],
        dob: firebase.firestore.Timestamp.now()
    }
    console.log(userData);
    try {
        await firestore.collection('users').doc(token.user.uid).set(userData);
    } catch (e) {
        alert(e)
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.black,
        marginTop: StatusBar.currentHeight || 0,
    },
    inner: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 15,
    },
    smallImage: {
        justifyContent: 'center',
        width: 200,
        height: 200
    },
    inputContainer: {
        alignSelf: 'stretch',
        marginBottom: 5
    },
    buttonContainer: {
        height: '25%',
        justifyContent: 'space-around',
        //borderWidth: 1,
    },
    icon: {
        marginRight: 15
    }
})

export default StartScreen;
