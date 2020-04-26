import * as React from 'react';
import { Text, TextInput, View, StyleSheet, ImageBackground, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as firebase from "firebase";


function ForgotPasswordScreen(props) {
  const [email, setEmail] = React.useState("");
  
   const passwordReset = (email_address) => {
    firebase.auth().sendPasswordResetEmail(email_address)
      .then(function (user) {
        console.log("Send code to ", email_address);
        alert('Please check your email...')
      }).catch(function (e) {
        console.log("Fail to run to ", email_address);
        console.log(e)
      })
  }
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
        <Button style={{ width: 200, alignSelf: 'center', marginTop: 10, marginBottom: 10 }}
        title = "Send code" type = "solid" onPress = {() => passwordReset(email)}/>
        </View>
        )
}

export default ForgotPasswordScreen;

