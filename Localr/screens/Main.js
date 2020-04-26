import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {Text} from 'react-native-elements';
import Constants from 'expo-constants';
import { Button } from 'react-native-elements'
import * as firebase from "firebase";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
//import SideMenu from 'react-native-side-menu';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import FilterScreen from './FilterScreen';




function Profile(props) {
  const signOutHandler = async () => {
    try {
      await firebase.auth().signOut();
      console.log("Sign out");
      props.navigation.navigate("StartScreen");
    } catch (e) {
      console.log(e);
    }
    
  }
  return(
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text h3>
      {firebase.auth().currentUser.email}
      </Text>
      <Button style={{ width: 200, alignSelf: 'center' }} title="Log out" onPress={() => signOutHandler()} />
    </View>
  )
}



function testMarkers() {
  return (
    <View>
      <Marker
        coordinate={{ latitude: 33.7701, longitude: -118.1937 }}
        title={"Test Marker 1"}
        description={"long test description 1"
        + "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sodales accumsan sapien, id blandit nunc ornare in. Sed pulvinar id eros et dapibus. Quisque blandit sit amet magna et auctor. Quisque feugiat iaculis ultrices. Pellentesque fringilla ornare risus, sit amet sodales urna varius vel. Nunc rhoncus tristique aliquet. Fusce nec nunc blandit, volutpat purus et, finibus arcu. Nam eget elit nec orci vulputate feugiat nec non libero. Donec eleifend sodales mauris, vel fringilla arcu. "}
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
    </View>
  );
}

function Map(props) {
  return(
    <View style={styles.container}>

    <View style={styles.contentContainer}>

      <MapView
        style={styles.map}
        provider = {PROVIDER_GOOGLE}
        region={{
          latitude: 33.7701,
          longitude: -118.1937,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      >
        {testMarkers()}
      </MapView>

      <View style={styles.mapDrawerOverlay} />

    </View>
  </View>
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

  
  
function MainScreen(props) {
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
export default MainScreen;