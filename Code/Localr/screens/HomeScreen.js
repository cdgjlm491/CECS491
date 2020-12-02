import React, { useContext } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Button } from 'react-native'
import { AuthContext } from '../navigation/AuthNavigator'
import Firebase from '../components/Firebase'

export default function Home() {
    const user = useContext(AuthContext)

  return (
    <View style={styles.container}>
      <Text style={styles.innerText}>Welcome {user.uid}</Text>
      <Text style={styles.innerText}>This is your UID.</Text>
        <Text style={styles.innerText}>This is also a temporary Home Screen</Text>
        <Text style={styles.innerText}>Use the drawer on the left!</Text>
        <Button
            title = "Sign out"
            onPress={logOut}>
        </Button>
    </View>
  )
}

const logOut = async() => {
    try {
      await Firebase.auth().signOut()
    } catch (e) {
      console.error(e)
    }
  }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgb(85, 91, 110)'

    },
    innerText: {
      color: 'rgb(252, 252, 255)'
    }
  });