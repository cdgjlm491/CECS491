import  React, { useState }  from 'react';
import { View, StyleSheet, Alert, Linking } from 'react-native';
import {Text} from 'react-native-elements';
import Constants from 'expo-constants';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import CustomCallout from '../components/CustomCallout.js';
import Firebase from '../components/Firebase'

const GoogleMap = (props) => {
  }

  const styles = StyleSheet.create({
    map: {
      height: "100%",
      width: "100%",
      //...StyleSheet.absoluteFillObject,
    }
  });

export default GoogleMap;