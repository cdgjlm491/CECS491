import React, { useState, useContext, Component, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Input, ThemeProvider, Text } from 'react-native-elements';
import Firebase from '../components/Firebase';
import { Button } from 'react-native-elements';
import theme from '../components/Theme'
import DateTimePicker from '@react-native-community/datetimepicker';
import * as firebase from 'firebase';

import MultiSelect from 'react-native-multiple-select';


const UpdateProfile = () => {

  const [name, setName] = React.useState("");
  now = new Date();
  const [date, setDate] = useState(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())));
  const [show, setShow] = useState(false);

  useEffect(() => {
    getUser().then(data => {
      setDate(data.dob.toDate())
      setName(data.name)
    })
  }, [])

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = () => {
    setShow(true);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  return (
    <ThemeProvider theme={theme}>
      <View style={styles.container}>
        <View style={styles.inner}>
          <Input
            placeholder={name}
            onChangeText={text => setName(text)}
            value={name}
          />
          <Text h4 style={styles.text}>Date of birth: {date.toDateString()}</Text>
          <View>
            <View>
              <Button onPress={showDatepicker} title="Change D.O.B." />
            </View>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={date}
                //is24Hour={true}
                display="spinner"
                onChange={onChange}
              />
            )}
          </View>

          {/*
      <MultiSelect
        hideTags
        items={items}
        uniqueKey="id"
        ref={(component) => { multiSelect = component }}
        onSelectedItemsChange={onSelectionsChange}
        selectedItems={interests}
        selectText="Pick Interests"
        searchInputPlaceholderText="Search Items..."
        //onChangeInput={ (text)=> console.log(text)}
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
      */}
          <Button style={styles.button}
            title="Save"
            onPress={() => update(name, date)}

          />
        </View>
      </View>
    </ThemeProvider>
  )
}

const update = async (name, dob) => {
  const uid = Firebase.auth().currentUser.uid;
  /*     if (name === "" || age === "" || interests.lenght == 0) {
          console.log("Empty");
          return;
      }
      console.log(interests);
      console.log(typeof(interests));
      const interestArray = []
      for (var i in interests){
          interestArray.push(interests[i]);
      }
      console.log(interestArray); */
  const userData = {
    dob: firebase.firestore.Timestamp.fromDate(dob),
    name: name
  }

  //add try catch
  await Firebase.firestore().collection('users').doc(uid).set(userData);
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


const getUser = async () => {
  const uid = Firebase.auth().currentUser.uid;
  const collectionName = "users"
  const db = Firebase.firestore();
  const ref = db.collection(collectionName).doc(uid)
  //add try catch
  const doc = await ref.get();

  if (!doc.exists) {
    console.log('No such document!');
  } else {
    console.log('Document data:', doc.data());
    return doc.data()
  }

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
  text: {
    color: theme.colors.white
  }
})

export default UpdateProfile;