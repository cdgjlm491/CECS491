import React, { useState, useContext, Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../navigation/AuthNavigator';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import Firebase from '../components/Firebase';
import * as firebase from "firebase";
import {Button} from 'react-native-elements';
import { useRoute } from '@react-navigation/core';
import SelectMultiple from 'react-native-select-multiple';
import MultiSelect from 'react-native-multiple-select';

 
// Import Interfaces`
import { ICountry, IState, ICity } from 'country-state-city'
var firestore = Firebase.firestore();

const update = async(name, age, interests) => {
    const email =  firebase.auth().currentUser.email;
    if (name === "" || age === "" || interests.lenght == 0) {
        console.log("Empty");
        return;
    }
    console.log(interests);
    console.log(typeof(interests));
    const interestArray = []
    for (var i in interests){
        interestArray.push(interests[i]);
    }
    console.log(interestArray);
    const userData = {
        Age: age,
        Interests: interestArray,
        Name: name
    }
    
    await firestore.collection('NewUsers').doc(email).set(userData);
    console.log("Done updating");
}
/**
const MultiSelectInterests = (props) => {
    const [interests, setInterests] = React.useState([]);
    const fruits = ['Education', 'Health', 'Travel', 'Cars', 'Sports'];
    const onSelectionsChange = ((selectedItems) => {
        setInterests(selectedItems);
    })
    return (
        <View style={{ flex: 1, color:'red'}}>
            <SelectMultiple
                items = {fruits}
                selectedItems = {interests}
                onSelectionsChange = {onSelectionsChange}
            />
      </View>
    )

}
*/
const UpdateProfile = () => {
    const [name, setName] = React.useState("");
    const [age, setAge] = React.useState("");
    const [interests, setInterests] = React.useState([]);

    
    const items = [{
        id: 'Sports',
        name: 'Sports',
      }, {
        id: 'News',
        name: 'News',
      }, {
        id: 'Politics',
        name: 'Politics',
      }, {
        id: 'Celebrities',
        name: 'Celebrities',
      }, {
        id: 'Tech',
        name: 'Tech',
      }];
    const onSelectionsChange = ((selectedItems) => {
        setInterests(selectedItems);
    })

    return (
        <View style={styles.container}>
        <View style={styles.content}>
        <Input 
            placeholder='Name'
            onChangeText = {text => setName(text)}
            value = {name}
        />
        <Input
            placeholder='Age'
            onChangeText = {text => setAge(text)}
            value = {age}
        />
        <MultiSelect
          hideTags
          items={items}
          uniqueKey="id"
          ref={(component) => { multiSelect = component }}
          onSelectedItemsChange={onSelectionsChange}
          selectedItems={interests}
          selectText="Pick Interests"
          searchInputPlaceholderText="Search Items..."
          onChangeInput={ (text)=> console.log(text)}
          altFontFamily="Cochin"
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: '#CCC' }}
          submitButtonColor="#CCC"
          submitButtonText="Submit"
        />
        
        <Button style={styles.button}
            title = "Save"
            onPress = {() => update(name, age, interests)}
            
           />
        
        </View>
        
        
        
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        marginTop: 20
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
/**
 * <Input
            placeholder='Name'
            onChangeText = {text => setName(text)}
            value = {name}
        />
        <Input
            placeholder='Age'
            onChangeText = {text => setAge(text)}
            value = {age}
        />
 * <SelectMultiple 
                items = {fruits}
                selectedItems = {interests}
                onSelectionsChange = {onSelectionsChange}
        />
 */

export default UpdateProfile;