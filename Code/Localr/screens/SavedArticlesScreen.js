import React, { useState, useEffect } from 'react'
import { View, StyleSheet,  FlatList, StatusBar, Linking } from 'react-native';
import { ListItem, ThemeProvider } from 'react-native-elements'
import Firebase from '../components/Firebase'
import { useIsFocused } from '@react-navigation/native';
import theme from '../components/Theme'


const SavedArticlesScreen = () => {

  const [articles, setArticles] = useState([])
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log('useEffect')
    if (isFocused) {
      pullArticles().then(x => setArticles(x))
    }
  }, [isFocused])

  return (
    <ThemeProvider theme={theme}>
      <View style={styles.container}>
        <FlatList
          data={articles}
          renderItem={({ item }) => (
            <ListItem style={styles.item}
              title={item.headline}
              subtitle={item.url}
              onPress={() => Linking.openURL(item.url)} />
          )}
          keyExtractor={item => item.url}
        />
      </View>
    </ThemeProvider>

  );
}
export default SavedArticlesScreen

const pullArticles = async () => {
  const uid = Firebase.auth().currentUser.uid;
  const collectionName = "users"
  const db = Firebase.firestore();
  const ref = db.collection(collectionName).doc(uid).collection('saved').orderBy('timeSaved', 'desc')
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
    backgroundColor: theme.colors.black,
  },
  item: {
    //backgroundColor: '#E5E1EE',
    padding: 5,
    marginVertical: 4,
    marginHorizontal: 4,
  },
});
