import React, { useState, useContext, useEffect } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import Firebase from '../components/Firebase'
import * as firebase from "firebase"
import {Button} from 'react-native-elements'
import UpdateProfile from './UpdateProfileScreen';
import Header from '../components/Header';

var firestore = Firebase.firestore();


const Profile = (props) => {
    const [userName, setUserName] = React.useState("");
    const [userAge, setUserAge] = React.useState(0);
    const [userInterests, setUserInterests] = React.useState([]);

    useEffect(() => {
        const userRef = firestore.collection('NewUsers').doc(firebase.auth().currentUser.email);

        const observer = userRef.onSnapshot(docSnapshot => {

            const data = docSnapshot.data();

            setUserName(data["Name"]);
            setUserAge(data["Age"]);
            setUserInterests(data["Interests"]);

        })
    }, [])
    return (
        <View style={styles.container}>
            <Text style={styles.item}>
                Name: {userName}
            </Text>
            <Text style= {styles.item}>
                Age: {userAge}
            </Text>
            <Text style={styles.item}>
                Interests: {userInterests}
            </Text>


            <Button style = {styles.button}
                title = "Update Profile"
                onPress = {() => props.navigation.navigate('Update Profile')}
            />
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    item: {
        padding: 16,
        marginTop: 25,
        borderColor: '#bbb',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 10,
        fontWeight: 'bold',
    },
    button: {
        paddingTop: 10,
        margin: 50,
        borderRadius: 20,
    }
})



export default Profile;