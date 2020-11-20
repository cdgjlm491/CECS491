import React, { useState, useEffect, useRef } from 'react'
import { View, StyleSheet, Text, Button, Alert } from 'react-native'
import Firebase from '../components/Firebase'
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE, Callout, MAP_TYPES } from 'react-native-maps';
import CustomCallout from '../components/CustomCallout.js';
import geohash from "ngeohash";
import * as Linking from 'expo-linking';
import { useIsFocused } from '@react-navigation/native';
import 'firebase/firestore';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';
//this is required for a hack that fixes duplicate keys in the markers
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';
import {
  GOOGLE_PLACES_API
} 
from 'react-native-dotenv'
Geocoder.init(GOOGLE_PLACES_API, {language: 'en'})

const MapScreen = (props) => {

  const [region, setRegion] = useState({
    latitude: 33.7701,
    longitude: -118.1937,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1
  });
  const [city, setCity] = useState("");

  //notes for myself

  //add a state that tracks if a marker is selected, if one is selected do no run the setmarkerlist on region change complete?
  //if the region changes enough however, deselect the marker and update the marker list?
  //the isGesture event may be helpful, but will only work on deployed apps
  //setup geofirejs
  //THERE IS NO NEED TO PULL MARKERS WHEN ZOOMING IN!


  const mapRef = useRef(null)
  const [errorMsg, setErrorMsg] = useState(null);

  const isFocused = useIsFocused();


  const [topics, setTopics] = useState([
    'business',
    'entertainment',
    'health',
    'politics',
    'crime',
    'science & tech',
    'sports',
    'travel'
  ])

  const [markerList, setMarkerList] = useState([{
    'Headline': 'filler',
    'Description': 'filler',
    'Url': 'filler',
    'Topic': 'filler',
    'Geohash': 'filler',
    'Publish Date': 'filler',
    'Org': 'filler'
    //'Coordinates': {
    //'Latitude': 0.1,
    //'Longitude': 0.1,
    //},
  }]);

  //updates markers when screen comes into focus
  useEffect(() => {
    if (isFocused) {
      getTopics().then(a => setTopics(a))
      mapRef.current.getMapBoundaries().then(mapborder => pullMarkers(mapborder).then(markers => setMarkerList(markers)))
    }
  }, [isFocused]);


  useEffect(() => {
    (async () => {

      //check location service status
      try {
        await Location.requestPermissionsAsync();
      } catch {
        console.log('requestPermissionsAsync error')
        setErrorMsg('Permission to access location was denied');
      }
      try {
        await Location.hasServicesEnabledAsync()
      } catch {
        console.log('hasServicesEnabledAsync error')
        setErrorMsg('Location service is disabled or inaccesable.');
      }

      //save last known location and use it instead of the users current location?
      try {
        let location = await Location.getCurrentPositionAsync();
        console.log(location)
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1
        })
      } catch {
        console.log('getCurrentPositionAsync error')
        setErrorMsg('Cant get current position')
        //default region
        setRegion({
          latitude: 33.7701,
          longitude: -118.1937,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1
        })
      }


    })();
  }, []);


  //attempting to get location view
  let view =
    <View style={styles.center}>
      <Text>Getting Location..</Text>
    </View>;

  //location was found view
  if (region) {
    view =
      <View style={styles.container}>
    
        <MapView style={styles.map}
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          initialRegion={region}
          loadingEnabled ={true}
          //onPanDrag={() => console.log('dragged map')}
          onMarkerPress={() => console.log('marker selected')}
          //might fix a bug but might be android only
          moveOnMarkerPress={false}
          //causes hangs
          //onRegionChange={region => setRegion(region)}

          //PROBLEM: when you select a marker and move the map the markers are refreshed causing the marker to no longer be selected
          //isGesture can prevent this if it works when deployed to the appstore, currently it is returning undefined.
          //get boundries, then pull markers, then set markers
          onRegionChangeComplete={region, isGesture => {
            console.log('region change complete');
            setRegion(region)
            console.log('isGesture: ' + isGesture)
            mapRef.current.getMapBoundaries().then(mapborder => pullMarkers(mapborder).then(markers => setMarkerList(markers)))
          }}
        >

          {displayMarkers(markerList)}

        </MapView>
        {/*lat long info bubble*/}
        <View style={[styles.bubble, styles.latlng]}>
          <Text style={styles.centeredText}>
            {region.latitude.toPrecision(7)},
          {region.longitude.toPrecision(7)}
          </Text>
        </View>

        {/*<Button title = 'Restricted Markers' onPress = {() => mapRef.current.getMapBoundaries().then(mapborder => pullMarkers(mapborder).then(markers => setMarkerList(markers)))}></Button>
      <Button title = 'Remove Markers?' onPress = {() => setMarkerList([])}></Button>*/}
      </View>
  }

  return (
    <View style={styles.container}>
      {view}
      <View style={styles.mapDrawerOverlay} />
    </View>
  );
}

const getTopics = async () => {
  const email = Firebase.auth().currentUser.email;
  const collectionName = "NewUsers"
  const db = Firebase.firestore();
  const ref = db.collection(collectionName).doc(email)
  //add try catch
  const doc = await ref.get();

  if (!doc.exists) {
    console.log('No such document!');
  } else {
    //console.log('Document data:', doc.data());
    return doc.data().Interests
  }

}

const pullMarkers = async (mapborder) => {
  //need to change database layout and then update this
  //add try catch
  topics = await getTopics()
  articles = []
  console.log('starting to pull markers')
  const southWest = geohash.encode(mapborder.southWest.latitude, mapborder.southWest.longitude)
  const northEast = geohash.encode(mapborder.northEast.latitude, mapborder.northEast.longitude)
  const collectionName = "long-beach"
  const db = Firebase.firestore();
  const ref = db.collection(collectionName)

  //THIS IS NOT WORKING, OOPS
  //make this a compound query in the future to select topics, right now it pulls everything and then filters by topic later
  ref.where("geohash", ">=", southWest).where("geohash", "<=", northEast)
  //add try catch
  const snapshot = await ref.get();

  if (snapshot.empty) {
    //Alert.alert('No matching documents.');
    //no articles in location, return empty array
    return [];
  }
  else {
    snapshot.forEach(doc => {
      if (topics.includes(doc.data().topic)) {
        articles.push({ "Headline": doc.data().name, "Description": doc.data().summary, "Url": doc.data().url, "Topic": doc.data().topic, 'Geohash': doc.data().geohash, 'Publish Date': doc.data().datePublished, 'Org': doc.data().organization });
        //console.log(doc.data().topic)
      }
    })
    //prints how many markers were pulled
    console.log('pulled markers: ' + articles.length);
    return articles;
  }
}

const displayMarkers = (articles) => {
  //business, crime, entertainment, health, politics, science & tech, sports, travel
  //Is there a better way to do this?
  var mapPins = {
    'business': require('../assets/images/business_s.png'),
    'crime': require('../assets/images/crime_s.png'),
    'entertainment': require('../assets/images/entertainment_s.png'),
    'health': require('../assets/images/health_s.png'),
    'politics': require('../assets/images/politics_s.png'),
    'science & tech': require('../assets/images/science_s.png'),
    'sports': require('../assets/images/sports_s.png'),
    'travel': require('../assets/images/travel_s.png')
  }

  markerList = []
  markerList = articles.map((article) =>

    <Marker
      key={uuidv4()}
      coordinate={{ latitude: geohash.decode(article.Geohash).latitude, longitude: geohash.decode(article.Geohash).longitude }}
      title={article.Headline}
      description={article.Description}
      image={mapPins[article.Topic]}
      tracksViewChanges={false}
    >
      <Callout
        alphaHitTest
        tooltip
        onPress={() => Linking.openURL(article.Url)}
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
  center: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notify: {
    fontSize: 35
  },
  bubble: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  mapDrawerOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.0,
    height: "100%",
    width: 10,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  centeredText: { textAlign: 'center' },
});

export default MapScreen;
