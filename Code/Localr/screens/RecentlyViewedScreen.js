import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, StatusBar, Linking } from 'react-native';
import { ListItem, ThemeProvider, Text } from 'react-native-elements'
import Firebase from '../components/Firebase'
import { useIsFocused } from '@react-navigation/native';
import theme from '../components/Theme'

const RecentlyViewedScreen = () => {

  const [articles, setArticles] = useState([])
  const isFocused = useIsFocused();

  //use snapshot instead?
/*   useEffect(() => {
    console.log('useEffect')
    var alist = []
    const userRef = Firebase.firestore().collection('users').doc(Firebase.auth().currentUser.uid).collection('recentlyViewed');
    userRef.onSnapshot(docSnapshot => {
      docSnapshot.forEach(doc => {
        console.log(doc.data())
      alist.push(doc.data())
      })
      setArticles(alist)
  })
  }, [])
 */

  useEffect(() => {
    console.log('useEffect')
    if (isFocused) {
      getArticles().then(articles => setArticles(articles))
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
          onPress={() => Linking.openURL(item.url)}/>
        )}
        keyExtractor={item => String(item.geohash) + item.headline}
      />
    </View>
    </ThemeProvider>
  );
}
export default RecentlyViewedScreen

const getArticles = async () => {
  const uid = Firebase.auth().currentUser.uid;
  const collectionName = "users"
  const db = Firebase.firestore();
  const ref = db.collection(collectionName).doc(uid).collection('recentlyViewed').orderBy('timeViewed', 'desc')
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
