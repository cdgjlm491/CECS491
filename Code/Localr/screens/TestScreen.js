import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Button, Alert } from 'react-native'
import Firebase from '../components/Firebase'

const Test = () => {
    /*
    const [test, setTest] = useState({
        "Coordinates": {
          "latitude": 0,
          "longitude": 0,
        },
        "Description": "test",
        "Headline": "test",
        "Url": "test",
      });
      */

     const [markerList, setMarkerList] = useState([{
        "Headline": "test",
        "Description": "test",
        "Url": "test",
        "Coordinates": {
          "Latitude": 0,
          "Longitude": 0,
        },
      }]);

  return (
    <View style={styles.container}>
        <Text>{markerList[0].Description}</Text>
      <Button title='test' onPress={() => q().then(a => setMarkerList(a))}>
      </Button>
      <Button title='state' onPress={() => console.log(markerList)}>
      </Button>
    </View>
  )
}

const q = async () => {
    const db = Firebase.firestore();
    const ref = db.collection('Testing Data');
    const snapshot = await ref.get();
    articles = []
    if (snapshot.empty) {
        Alert.alert('No matching documents.');
        return;
    }
    else {
        snapshot.forEach(doc => {
            articles.push({"Headline":doc.data().Headline, "Description":doc.data().Description, "Url":doc.data().Url, "Coordinates": {"Latitude":doc.data().Coordinates.latitude,"Longitude":doc.data().Coordinates.longitude,}});
        })
        //console.log(articles);
        return articles;
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default Test;