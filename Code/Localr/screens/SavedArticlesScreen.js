import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Alert, Button, Text, SafeAreaView, FlatList, StatusBar, Linking } from 'react-native';
import { CheckBox, ListItem } from 'react-native-elements'
import Firebase from '../components/Firebase'
import { useIsFocused } from '@react-navigation/native';


const SavedArticlesScreen = () => {

  const [articles, setArticles] = useState([])
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log('useEffect')
    if (isFocused) {
    test().then(x => setArticles(x))
    }
  }, [isFocused])

  return (
    <View style={styles.container}>
      <FlatList
      inverted
        data={articles}
        renderItem={({ item }) => (
          <ListItem style={styles.item}
          title={item.Headline}
          subtitle={item.Url}
          containerStyle={styles.litem}
          textStyle={styles.litemt}
          onPress={() => Linking.openURL(item.Url)}/>
        )}
        keyExtractor={item => item.Url}
      />
    </View>
  );
}
export default SavedArticlesScreen

const test = async () => {
  const email = Firebase.auth().currentUser.email;
  const collectionName = "NewUsers"
  const db = Firebase.firestore();
  const ref = db.collection(collectionName).doc(email).collection('Saved')
  var alist = []
  //add try catch
  await ref.get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      //console.log(doc.id, " => ", doc.data());
      alist.push(doc.data())
    });
  });
  return alist
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    //USE THIS?, IT GETS THE DEVICES STATUS BAR HEIGHT?
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#555B6E',
  },
  item: {
    backgroundColor: '#E5E1EE',
    padding: 5,
    marginVertical: 4,
    marginHorizontal: 4,
  },
  title: {
    fontSize: 32,
  },
  litem: {
    //backgroundColor: '#555B6E',
  },
  litemt: {
    color: '#555B6E',
  },
});
