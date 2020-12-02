import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Input, ThemeProvider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Firebase from "firebase";
import theme from '../components/Theme'



const ForgotPasswordScreen = (props) => {
  const [email, setEmail] = React.useState("");

  const passwordReset = (email_address) => {
    Firebase.auth().sendPasswordResetEmail(email_address)
      .then(user => {
        console.log("Send code to ", email_address);
        alert('Please check your email...')
      }).catch(e => {
        //check if email doesn't exists?
        console.log("Fail to run to ", email_address);
        console.log(e)
      })
  }

  return (
    <ThemeProvider theme={theme}>
      <View style={styles.container}>
        <View style={styles.inner}>
          <Input
            label='Enter Email'
            placeholder='email@address.com'
            leftIcon={
              <Icon
                style={styles.icon}
                name='envelope-square'
                size={24}
                color='black'
              />
            }
            onChangeText={text => setEmail(text)}
            value={email}
          />
        </View>

        <View style={styles.inner}>
          <Button title="Send code" type="solid" onPress={() => passwordReset(email)} />
        </View>

      </View>
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inner: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 15,
  },
  icon: {
    marginRight: 15
  }
})

export default ForgotPasswordScreen;
