import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Alert, Button, Text, SafeAreaView, FlatList, StatusBar, Linking } from 'react-native';
import { CheckBox, ListItem } from 'react-native-elements'
import Firebase from '../components/Firebase'
import { useIsFocused } from '@react-navigation/native';
import geohash from "ngeohash";
import * as firebase from 'firebase'


const TestScreen = () => {


   const [articles, setArticles] = useState([])
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log('useEffect')
    if (isFocused) {
    }
  }, [isFocused])

  return (
    <View style={styles.container}>
      <Button
      title='test'
      //onPress = {() => test()}
      />
            <Button
      title='test2'
      //onPress = {() => test2()}
      />
    </View>
  );
}
export default TestScreen
/*
const test = () => {
  const db = Firebase.firestore();
  db.collection("Testing Collections").doc('long-beach').collection('Articles').get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        console.log(doc.data().geohash)
        var latlong = geohash.decode(doc.data().geohash)
        console.log(latlong)
        doc.ref.update({
          coordinates: new firebase.firestore.GeoPoint(latlong.latitude, latlong.longitude),
          g: {
            geohash: doc.data().geohash,
            geopoint: new firebase.firestore.GeoPoint(latlong.latitude, latlong.longitude)
          }
      });
    });
});
}

const test2 = () => {
  const db = Firebase.firestore();
  db.collection("Testing Collections").doc('long-beach').collection('Articles').get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        //console.log(doc.data().geohash)
        var latlong = geohash.decode(doc.data().geohash)
        //console.log(latlong)
        doc.ref.update({
          geohash: firebase.firestore.FieldValue.delete()
      });
    });
});
}
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //USE THIS?, IT GETS THE DEVICES STATUS BAR HEIGHT?
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#555B6E',
  },
  item: {
    backgroundColor: '#E5E1EE',
    padding: 5,
    marginVertical: 4,
    marginHorizontal: 4,
  },
  title: {
    fontSize: 32,
  },
  litem: {
    //backgroundColor: '#555B6E',
  },
  litemt: {
    color: '#555B6E',
  },
});
