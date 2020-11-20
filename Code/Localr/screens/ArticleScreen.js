import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Alert, Linking, Button, Text } from 'react-native';
import Firebase from '../components/Firebase'
import 'firebase/firestore';
import 'firebase/functions';
//import * as Linking from 'expo-linking';
const RECENTLY_VIEWED_SIZE = 10

//todo cleanup firebase statements

const ArticleScreen = ({ route, navigation }) => {
  const article = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.innerText}>{article.Headline}</Text>
      <Text style={styles.innerText}>{article.Description}</Text>
      <Text style={styles.innerText}>{article.Org}</Text>
      <Text style={styles.innerText}>{article['Publish Date']}</Text>
      <Text style={styles.innerText}>{article.Url}</Text>
      <View style={styles.buttonContainer}>
        <Button style={styles.test}
          title="Save Article"
          onPress={() => saveArticle(article)}>
        </Button>
        <View></View>
        <Button style={styles.test}
          title="Open Article"
          onPress={() => viewArticle(article)}>
        </Button>
      </View>
    </View>

  );
}

const saveArticle = async (article) => {
  const email = Firebase.auth().currentUser.email;
  var d = new Date()
  article['Time Saved'] = d.getTime()
  //add try catch
  const db = Firebase.firestore();
  const ref =  db.collection('NewUsers').doc(email).collection('Saved')
  //try to make it unique
  const res = await ref.doc(article['Publish Date'].slice(0, 19) + article.Geohash).set(article)
}


const viewArticle = async (article) => {
  var d = new Date()
  article['Time Viewed'] = d.getTime()
  const email = Firebase.auth().currentUser.email;
  const collectionName = "NewUsers"
  const db = Firebase.firestore();
  const ref = db.collection(collectionName).doc(email).collection('Recently').orderBy('Time Viewed').limit(11)
  var docid = null
  await ref.get().then(res => {
    if(res.size >= RECENTLY_VIEWED_SIZE) {
      console.log(res.docs[0].id)
      docid = res.docs[0].id
    }
  })
  const ref2 = db.collection(collectionName).doc(email).collection('Recently')
  const res = await ref2.doc(article['Publish Date'].slice(0, 19) + article.Geohash).set(article)
  if(docid != null){
    const res2 = await db.collection(collectionName).doc(email).collection('Recently').doc(docid).delete();
    }
    Linking.openURL(article.Url)
}

/*
const test = async (article) => {
  const email = Firebase.auth().currentUser.email;
  const collectionName = "NewUsers"
  const db = Firebase.firestore();
  const ref = db.collection(collectionName).doc(email).collection('Articles')
  articles = []
  //add try catch
  await ref.get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      console.log(doc.id, " => ", doc.data());
      articles.push(doc.data())
    });
  });
}
*/

export default ArticleScreen


const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgb(85, 91, 110)'
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  innerText: {
    color: 'rgb(252, 252, 255)',
    paddingTop: '5%'
  }
});