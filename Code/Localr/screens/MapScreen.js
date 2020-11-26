import React, { useState, useEffect, useRef } from 'react'
import { View, StyleSheet, Text, Button, Alert } from 'react-native'
import Firebase from '../components/Firebase'
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE, Callout, MAP_TYPES } from 'react-native-maps';
import CustomCallout from '../components/CustomCallout.js';
import geohash from "ngeohash";
import { useIsFocused } from '@react-navigation/native';
import 'firebase/firestore';
import * as geofirestore from 'geofirestore';
import * as firebase from 'firebase'
import { getDistance } from 'geolib';
import * as Device from 'expo-device';

//this is required for a hack that fixes duplicate keys in the markers
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';


const MapScreen = (props) => {

  //region state, holds the current region of the map
  const [region, setRegion] = useState({
    latitude: 33.7701,
    longitude: -118.1937,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1
  });

  //notes for Austin

  //add a state that tracks if a marker is selected, if one is selected do no run the setmarkerlist on region change complete?
  //if the region changes enough however, deselect the marker and update the marker list?
  //the isGesture event may be helpful, but will only work on deployed apps
  //THERE IS NO NEED TO PULL MARKERS WHEN ZOOMING IN!
  //remove hard coded strings and create constants


  //map reference
  const mapRef = useRef(null)
  const [errorMsg, setErrorMsg] = useState(null);

  //returns true if the component is in focus
  const isFocused = useIsFocused();


  //topic state that contains topics to show to the user
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

  //marker states, holds markers to display to the user
  /*
  const [markerList, setMarkerList] = useState([{
    'Headline': 'Test',
    'Description': 'Testing',
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
*/
  const [markerList, setMarkerList] = useState([]);

  //updates the topics and markers when screen comes into focus
  useEffect(() => {
    if (isFocused) {
      getTopics().then(a => setTopics(a))
      mapRef.current.getMapBoundaries().then(mapborder => getArticles(mapborder, region).then(markers => setMarkerList(createMarkers(markers))))
    }
  }, [isFocused]);


  //trying to check for user location, not finished
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
        console.log('getCurrentPositionAsync error, getting last position')
        setErrorMsg('Cant get current position, getting last position')
        let location = await Location.getLastKnownPositionAsync();
       if(location) {
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1
        })
      }
      }


    })();
  }, []);

  onRegionChange = (region) => {
      setRegion(region)
  }

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
          onRegionChange={region => onRegionChange(region)}
          //onPanDrag={() => console.log('dragged map')}
          onMarkerPress={() => console.log('marker selected')}
          //might fix a bug but might be android only
          moveOnMarkerPress={false}

          //PROBLEM: when you select a marker and move the map the markers are refreshed causing the marker to no longer be selected
          //isGesture can prevent this if it works when deployed to the appstore, currently it is returning undefined.
          //get boundries, then pull markers, then set markers
          onRegionChangeComplete={region => {
            console.log('region change complete');
            //setRegion(region)
            //console.log(region)
            //Create expieremental option to enable this? Uses more database reads than the button.
            //mapRef.current.getMapBoundaries().then(mapborder => getArticles(mapborder, region).then(markers => setMarkerList(createMarkers(markers))))
          }}
        >

          {markerList}

        </MapView>

        <Button title='Load Markers' onPress={() => {
          //This is a hack to get this working on IOS, however if the user is clicked on a marker it will become unclicked
          if(Device.osName != 'Android') {
            setMarkerList([])
          }
          mapRef.current.getMapBoundaries().then(mapborder => getArticles(mapborder, region).then(markers => setMarkerList(createMarkers(markers))))
          //mapRef.current.forceUpdate()
          }}></Button>
        {/*<Button title = 'Remove Markers?' onPress = {() => setMarkerList([])}></Button>*/}

        {/*lat long info bubble*/}
        <View style={[styles.bubble, styles.latlng]}>
          <Text style={styles.centeredText}>
          {region.latitude.toPrecision(7)},
          {region.longitude.toPrecision(7)}
          </Text>
        </View>
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

const getArticles = async (mapborder, region) => {
  //add try catch
  topics = await getTopics()
  articles = []

  const distancekm = getDistance(
    { latitude: mapborder.southWest.latitude, longitude: mapborder.southWest.longitude },
    { latitude: mapborder.northEast.latitude, longitude: mapborder.northEast.longitude }) / 1000

  console.log('starting to pull markers')
  const db = Firebase.firestore();

  const gf = geofirestore.initializeApp(db);

  //temp, loop throught the testing collections documents in the future.
  const geocollection = gf.collection("Testing Collections").doc("long-beach").collection("Articles")

  //get all docs near the current region
  const query = geocollection.near({ center: new firebase.firestore.GeoPoint(region.latitude, region.longitude), radius: distancekm/2 });

  //add try catch
  const snapshot = await query.get();

  if (snapshot.empty) {
    console.log('No matching documents.');
    //no articles in location, return empty array
    return [];
  }
  else {
    snapshot.forEach(doc => {
      //FIGURE OUT HOW TO PULL ONLY NEEDED TOPICS
      if (topics.includes(doc.data().topic)) {
        console.log(doc.data().coordinates.U)
        //This can be optimized to not use geohash, use coordinates instead
        articles.push({ "Headline": doc.data().name, "Description": doc.data().summary, "Url": doc.data().url, "Topic": doc.data().topic, 'Geohash': doc.data().g.geohash, 'Publish Date': doc.data().datePublished, 'Org': doc.data().organization });
        //console.log(doc.data().topic)
      }
    })
    //prints how many markers were pulled
    console.log('pulled markers: ' + articles.length);
    return articles;
  }
}

const createMarkers = (articles) => {
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
      key={String(article.Geohash) + article.Headline + String(uuidv4())}
      coordinate={{ latitude: geohash.decode(article.Geohash).latitude, longitude: geohash.decode(article.Geohash).longitude }}
      title={article.Headline}
      description={article.Description}
      //image={mapPins[article.Topic]}
      //image={require('../assets/images/sports_s.png')}
      //tracksInfoWindowChanges = {true}
      tracksViewChanges={true}
    >
    <Callout
      alphaHitTest
      tooltip
      onPress={() => props.navigation.navigate("Article", article)}
    >
      <CustomCallout>
        <Text>{article.Headline}</Text>
      </CustomCallout>
    </Callout>

    </Marker>);
  //console.log(markerList)
  return (
    <View>
      {markerList}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    //flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  map: {
    position: 'absolute',
    //top: 40,
    //left: 40,
    width: '100%',
    height: '100%',

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
