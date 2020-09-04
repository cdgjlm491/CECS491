import  React, { useState }  from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {Text} from 'react-native-elements';
import Constants from 'expo-constants';
import { Button } from 'react-native-elements'
import * as firebase from "firebase";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import { createDrawerNavigator } from '@react-navigation/drawer';
import FilterScreen from './FilterScreen';




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

//opens a menu when a marker description is clicked
//https://github.com/react-native-community/react-native-maps/blob/master/example/examples/Callouts.js
/*
<Callout
alphaHitTest
tooltip
onPress={e => {
  if (
    e.nativeEvent.action === 'marker-inside-overlay-press' ||
    e.nativeEvent.action === 'callout-inside-press'
  ) {
    return;
  }

  Alert.alert(this.title);
}}
style={styles.customView}
/>
*/

/*
      <Marker
        coordinate={{ latitude: 33.7701, longitude: -118.1937 }}
        title={"Test Marker 1"}
        description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
      />
      <Marker
        coordinate={{ latitude: 33.7691, longitude: -118.190 }}
        title={"Test Marker 2"}
        description={"test description 2"}
      />
      <Marker
        coordinate={{ latitude: 33.7751, longitude: -118.190 }}
        title={"Test Marker 3"}
        description={"test description 3"}
      />
      <Marker
        coordinate={{ latitude: 33.7751, longitude: -118.198 }}
        title={"Test Marker 4"}
        description={"test description 4"}
      />
*/

const testMarkers = (props) =>  {
  const data = [{"lat":33.7701,"long":-118.1937, "title":"Test Marker 1", "desc":"Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
                {"lat":33.7691,"long":-118.190, "title":"Test Marker 2", "desc":"Vivamus sit amet sem finibus, porttitor tellus non, dictum magna."},
                {"lat":33.7751,"long":-118.190, "title":"Test Marker 3", "desc":"Aenean egestas arcu molestie erat laoreet, et faucibus tortor blandit"},
                {"lat":33.7751,"long":-118.198, "title":"Test Marker 4", "desc":"Praesent nec enim ligula."}]
  const markerList = data.map((d) => <Marker coordinate = {{ latitude: d.lat, longitude: d.long }} title = {d.title} description = {d.desc}/>);
  return (
    <View>
      {markerList}
    </View>
  );
}

const Map = (props) =>  {
  navigator.geolocation.getCurrentPosition
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







  const MainScreen = (props) =>  {
    //const currentUser = firebase.auth();
    //const [currentUser, setCurrentUser] = React.useState({});
    //const {current} = firebase.auth();
    //setCurrentUser({current})

    //setCurrentUser(firebase.auth());
    //const SideMenu = require('react-native-side-menu');
    //const menu = <SideMenu />;
    const Drawer = createDrawerNavigator();


    return (
      <Drawer.Navigator initialRouteName="Main Screen">
        <Drawer.Screen name="Home" component={Map} />
        <Drawer.Screen name="Profile" component={Profile} title= "User Profile" />
        <Drawer.Screen name="Filters" component={FilterScreen} title="Filter" />
      </Drawer.Navigator>
    )
}

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
    height: "80%",
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
export default MainScreen;