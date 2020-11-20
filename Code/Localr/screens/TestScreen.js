import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Alert, Button, Text } from 'react-native';
import { CheckBox } from 'react-native-elements'
import Firebase from '../components/Firebase'


const TestScreen = (a) => {
  console.log(a)
  return (
    <View style={styles.container}>
      <Text>Article screen</Text>
    </View>
  );
}
export default TestScreen


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgb(85, 91, 110)',
    alignItems: 'center'
  }
});
