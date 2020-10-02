import  React, { useState }  from 'react';
import { View, StyleSheet, Alert, Linking, Button } from 'react-native';
import {Text} from 'react-native-elements';
import Constants from 'expo-constants';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import CustomCallout from '../components/CustomCallout.js';
import Firebase from '../components/Firebase'
import GoogleMap from '../components/MapComponent'


const MapScreen = (props) =>  {

  const [markersLoaded, setMarkersLoaded] = useState(false);

  const [region, setRegion] =  useState({
    latitude: 33.7701,
    longitude: -118.1937,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121
  });

  const [markerList, setMarkerList] = useState([{
    "Headline": "filler",
    "Description": "filler",
    "Url": "filler",
    "Coordinates": {
      "Latitude": 0,
      "Longitude": 0,
    },
  }]);

return (
  <View>
      <MapView
      style={styles.map}
      provider = {PROVIDER_GOOGLE}
      region = {region}
      onRegionChangeComplete={region => setRegion(region)}
      >

      {displayMarkers(markerList)}

    </MapView>
    <Button title = 'Update Markers from Database' onPress = {() => pullMarkers().then(a => setMarkerList(a))}></Button>
  </View>
  )
}


const pullMarkers = async () => {
  const collectionName = "Testing Data"
  const db = Firebase.firestore();
  const ref = db.collection(collectionName);
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
      console.log(articles);
      return articles;
  }
}

const displayMarkers = (articles) =>  {

const markerList = articles.map((article) =>
<Marker
  key = {article.Url}
  coordinate = {{ latitude: article.Coordinates.Latitude, longitude: article.Coordinates.Longitude }}
  title = {article.Headline}
  description = {article.Description}
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
  mapDrawerOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.0,
    //height: "100%",
    width: 25,
  },
  map: {
    height: "90%",
    width: "100%",
    //...StyleSheet.absoluteFillObject,
  }
});

export default MapScreen;
