import React, { useState, useEffect, useRef } from 'react'
import { View, StyleSheet, Text, Button, Alert } from 'react-native'
import Firebase from '../components/Firebase'
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE, Callout, MAP_TYPES } from 'react-native-maps';
import CustomCallout from '../components/CustomCallout.js';
import * as geofirestore from 'geofirestore';
import 'firebase/firestore';
import geohash from "ngeohash";

const Test = () => {


  const [region, setRegion] =  useState(null);
  const mapRef = useRef(null)
  const [errorMsg, setErrorMsg] = useState(null);

  const [markerList, setMarkerList] = useState([{
    'Headline': 'filler',
    'Description': 'filler',
    'Url': 'filler',
    'Filter': 'filler',
    'Coordinates': {
      'Latitude': 0.1,
      'Longitude': 0.1,
    },
  }]);


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1
      })
    })();
  }, []);

  //attempting to get location
  let view = <Text style={styles.notify}>Getting Location..</Text>;
  //location not found
  if (errorMsg) {
    view = <Text>{errorMsg}</Text>;
  //location was found
  } else if (region) {
    view =
    <View style={styles.container}>
    <MapView style={styles.map}
    provider = {PROVIDER_GOOGLE}
    ref={mapRef}
    initialRegion = {region}
    //mapType={MAP_TYPES.HYBRID}
    onRegionChange={region => setRegion(region)}
    //timeout is needed because without it onregionchangecomplete get called multiple times beacuse the map is still slowly moving?

    onRegionChangeComplete={() => {mapRef.current.getMapBoundaries().then(x => pullMarkers2(x, region).then(a => setMarkerList(a)))}}
    >

    {displayMarkers(markerList)}

    </MapView>
    <View style={[styles.bubble, styles.latlng]}>
        <Text style={styles.centeredText}>
          {region.latitude.toPrecision(7)},
          {region.longitude.toPrecision(7)}
        </Text>
      </View>
      <Button title = 'Update Markers from Database' onPress = {() => pullMarkers().then(a => setMarkerList(a))}></Button>
      <Button title = 'Restricted Markers' onPress = {() => mapRef.current.getMapBoundaries().then(x => pullMarkers2(x).then(a => setMarkerList(a)))}></Button>
      <Button title = 'Remove Markers?' onPress = {() => setMarkerList([])}></Button>


    </View>
  }

  return (
  <View style={styles.container}>
    {view}
  </View>
  );
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
          articles.push({"Headline":doc.data().Headline, "Description":doc.data().Description, "Url":doc.data().Url, "Filter":doc.data().Filter,  "Coordinates": {"Latitude":doc.data().Coordinates.latitude,"Longitude":doc.data().Coordinates.longitude,}});
      })
      console.log(articles);
      return articles;
  }
}

const pullMarkers2 = async (x) => {
  //console.log(region)
  //console.log(x.northEast.latitude)
  const southWest = geohash.encode(x.southWest.latitude, x.southWest.longitude)
  const northEast = geohash.encode(x.northEast.latitude, x.northEast.longitude)
  const collectionName = "Testing Data"
  const db = Firebase.firestore();
  const ref = db.collection(collectionName)
  articles = []
  const snapshot = await ref.where("Geohash", ">=", southWest).where("Geohash", "<=", northEast).get();
  if (snapshot.empty) {
    //Alert.alert('No matching documents.');
    return [];
}
else {
    snapshot.forEach(doc => {
        articles.push({"Headline":doc.data().Headline, "Description":doc.data().Description, "Url":doc.data().Url, "Filter":doc.data().Filter,  "Coordinates": {"Latitude":doc.data().Coordinates.latitude,"Longitude":doc.data().Coordinates.longitude,}});
    })
    console.log(articles);
    return articles;
}
}

const displayMarkers = (articles) =>  {
  //temp. add more images here
  var mapPins = {"Sports":  require('../assets/images/Sports.png'), "Politics": require('../assets/images/Politics.png')}

  const markerList = articles.map((article) =>

  <Marker
    key = {article.Url}
    coordinate = {{ latitude: article.Coordinates.Latitude, longitude: article.Coordinates.Longitude }}
    title = {article.Headline}
    description = {article.Description}
    image = {mapPins[article.Filter]}
  >

      <Callout
        alphaHitTest
        tooltip
        onPress={e => {
          if (
            e.nativeEvent.action === 'marker-inside-overlay-press' ||
            e.nativeEvent.action === 'callout-inside-press'
          ) {
            Linking.openURL(article.Url)
          }

          Alert.alert('This will probably need to be another screen, the data of the marker is accessable as follows\n' + article.Headline + '\n' + article.Description
          + '\n'+ article.Url,
          [
            {
              text: 'Open Article',
              onPress: () => Linking.openURL(article.Url)
            }] );
        }}
      >

        <CustomCallout>
          <Text>{article.Headline}</Text>
        </CustomCallout>

      </Callout>
  </Marker>);

  return (
    <View>
      {markerList}
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  notify: {
    fontSize: 35
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  centeredText: { textAlign: 'center' },
});

export default Test;