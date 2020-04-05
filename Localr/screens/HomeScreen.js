import * as React from 'react';
import {StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

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
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    height: "85%",
  },
  contentContainer: {
    paddingTop: 30,
  },
});
