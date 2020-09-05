import React from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Firebase from '../components/Firebase'

const image = require('../assets/images/localr_logo_transparent_2.png');


const StartScreen = (props) => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    return (
        <View style={styles.contentContainer}>
            <Image source={image} style={styles.smallImage} />

            <View style={styles.inputContainer}>
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
                    onChangeText={text => setEmail(text)}
                    value={email}
                />
            </View>

            <View style={styles.inputContainer}>
                <Input
                    placeholder='Enter password'
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
                <Button style={styles.smallButton} title="Log In" onPress={() => LogIn(email, password)} />
                <Button style={styles.smallButton} title="Sign Up" onPress={() => SignUp(email, password)} />
                <Button style={styles.smallButton} type="clear" title="Forgot Password" onPress={() => props.navigation.navigate('ForgotPasswordScreen')} />
                <Button style={styles.smallButton} title="Sign In Anonymously (temp, for dev)" onPress={() => AnonLogIn()} />
            </View>
        </View>
    )
}
export default StartScreen;


const AnonLogIn = async () => {
    try {
        await Firebase.auth().signInAnonymously()
    } catch (e) {
        alert(e)
    }
}

const LogIn = async (email, password) => {
    try {
        await Firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (e) {
        alert(e)
    }
}

const SignUp = async (email, password) => {
    try {
        await Firebase.auth().createUserWithEmailAndPassword(email, password)
    } catch (e) {
        alert(e)
    }
}


const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15
    },
    smallImage: {
        width: 200,
        height: 200
    },
    inputContainer: {
        width: '100%',
        marginBottom: 10
    },
    buttonContainer: {
        height: '40%',
        justifyContent: 'space-around'
    },
    smallButton: {
    },
    icon: {
        marginRight: 15
    }
})
