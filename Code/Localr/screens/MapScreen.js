import  React, { useState }  from 'react';
import { View, StyleSheet, Alert, Linking } from 'react-native';
import {Text} from 'react-native-elements';
import Constants from 'expo-constants';
import { Button } from 'react-native-elements'
import * as firebase from "firebase";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import { createDrawerNavigator } from '@react-navigation/drawer';
import FilterScreen from './FilterScreen';
import CustomCallout from '../components/CustomCallout.js';




const Profile = (props) =>  {
  const signOutHandler = async () => {
    try {
      await firebase.auth().signOut();
      console.log("Sign out");
      props.navigation.navigate("StartScreen");
    } catch (e) {
      console.log(e);
    }

  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text h3>
      {firebase.auth().currentUser.email}
      </Text>
      <Button style={{ width: 200, alignSelf: 'center' }} title="Log out" onPress={() => signOutHandler()} />
    </View>
  )
}

/*
const getLocation = () => {
  if (Platform.OS === 'android' && !Constants.isDevice) {
    setErrorMsg(
      'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
    );
  } else {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }
};
*/

const testMarkers = (props) =>  {

  const articles = [{"lat":33.7701,"long":-118.1937, "title":"Test Marker 1", "desc":"Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "url":"https://www.csulb.edu/apply"},
                {"lat":33.7691,"long":-118.190, "title":"Test Marker 2", "desc":"Vivamus sit amet sem finibus, porttitor tellus non, dictum magna.", "url":"https://www.csulb.edu/"},
                {"lat":33.7751,"long":-118.190, "title":"Test Marker 3", "desc":"Aenean egestas arcu molestie erat laoreet, et faucibus tortor blandit", "url":"https://twitter.com/csulb"},
                {"lat":33.7751,"long":-118.198, "title":"Test Marker 4", "desc":"Praesent nec enim ligula.", "url":"https://www.instagram.com/csulongbeach/"}]

  const markerList = articles.map((article) =>

  <Marker
    key = {article.url}
    coordinate = {{ latitude: article.lat, longitude: article.long }}
    title = {article.title}
    description = {article.desc}
    onPress={ e => {
      Alert.alert(' ',"You clicked the marker, we can use this to bring up a new screen.")
    }}>

      <Callout
        alphaHitTest
        tooltip
        onPress={e => {
          if (
            e.nativeEvent.action === 'marker-inside-overlay-press' ||
            e.nativeEvent.action === 'callout-inside-press'
          ) {
            Linking.openURL(article.url)
          }

          Alert.alert(article.title, "This will probably need to be another screen, the data of the marker is accessable as follows\n" + article.title + "\n" + article.desc + "\n"+ article.url,
          [
            {
              text: 'Open Article',
              onPress: () => Linking.openURL(article.url)
            }] );
        }}
      >

        <CustomCallout>
          <Text>{'Clicking this should bring you to a new screen with more info about the article. The following is a test to see how much text fits in here.' +
          'Aenean egestas arcu molestie erat laoreet, et faucibus tortor blandit. Aenean egestas arcu molestie erat laoreet, et faucibus tortor blandit.'}</Text>
        </CustomCallout>

      </Callout>
  </Marker>);

  return (
    <View>
      {markerList}
    </View>
  );

}

const Map = (props) =>  {

  //navigator.geolocation.getCurrentPosition

  const [region, setRegion] =  useState({
    latitude: 33.7701,
    longitude: -118.1937,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121
  });

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>

        <MapView
          style={styles.map}
          provider = {PROVIDER_GOOGLE}
          region = {region}
          onRegionChangeComplete={region => setRegion(region)}
        >

          {testMarkers()}

        </MapView>

        <View style={styles.mapDrawerOverlay} />

    </View>
  </View>
  )
}
export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  contentContainer: {
    paddingTop: 0,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  map: {
    height: "100%",
    width: "100%",
    //...StyleSheet.absoluteFillObject,
  },
  mapDrawerOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.0,
    //height: "100%",
    width: 25,
  },
});
