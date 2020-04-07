import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      <View style={styles.contentContainer}>

        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps?
          style={styles.map}
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
  );
}

function testMarkers() {
  return (
    <View>
      <Marker
        coordinate={{ latitude: 33.7701, longitude: -118.1937 }}
        title={"Test Marker 1"}
        description={"test description 1"}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    height: "100%",
  },
  contentContainer: {
    paddingTop: 30,
  },
  mapDrawerOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.0,
    height: "100%",
    width: 25,
  },
});
