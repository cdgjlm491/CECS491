import React, { useState, useContext, useEffect } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, StatusBar } from 'react-native'
import Firebase from '../components/Firebase'
import { ThemeProvider, Button } from 'react-native-elements'
import theme from '../components/Theme'


const Profile = (props) => {
    const [userName, setUserName] = React.useState("");
    const [userDOB, setUserDOB] = React.useState(1);

    useEffect(() => {
        const userRef = Firebase.firestore().collection('users').doc(Firebase.auth().currentUser.uid);
            userRef.onSnapshot(docSnapshot => {
            const data = docSnapshot.data();
            console.log()
            setUserName(data["name"]);
            setUserDOB(data["dob"].toDate().toDateString());

        })
    }, [])

    return (
        <ThemeProvider theme={theme}>
        <View style={styles.container}>
            <View style={styles.inner}>
            <Text style={styles.item}>
                Name: {userName}
            </Text>
            <Text style= {styles.item}>
                Date of birth: {userDOB}
            </Text>

            <Button
                title = "Update Profile"
                onPress = {() => props.navigation.navigate('Update Profile')}
            />
      </View>
      </View>
      </ThemeProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.black,
    },
    inner: {
        height: '30%',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 15,
    },
    item: {
        padding: 5,
        borderColor: theme.colors.primary,
        borderWidth: 1,
        borderRadius: 10,
        fontWeight: 'bold',
        width: '100%',
        color: theme.colors.white,
    }
})



export default Profile;