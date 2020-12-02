import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Alert, Linking, Button,  ScrollView } from 'react-native';
import Firebase from '../components/Firebase'
import 'firebase/firestore';
import 'firebase/functions';
import { ThemeProvider, Text } from 'react-native-elements'
import theme from '../components/Theme'
import * as firebase from 'firebase';

//import * as Linking from 'expo-linking';
const RECENTLY_VIEWED_SIZE = 10

//todo cleanup firebase statements

const ArticleScreen = ({ route, navigation }) => {
  const article = route.params;

  return (
    <ThemeProvider theme={theme}>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.innerText}>
          <Text style={styles.textc}>Headline</Text>
          <Text style={styles.text}>{article.headline}</Text>
          </View>
          <View style={styles.innerText}>
          <Text style={styles.textc}>Description</Text>
          <Text style={styles.text}>{article.description}</Text>
          </View>
          <View style={styles.innerText}>
          <Text style={styles.textc}>Organization</Text>
          <Text style={styles.text}>{article.organization}</Text>
          </View>
          <View style={styles.innerText}>
          <Text style={styles.textc}>Date Published</Text>
          <Text style={styles.text}>{article.datePublished}</Text>
          </View>
          <View style={styles.innerText}>
          <Text style={styles.textc}>Url</Text>
          <Text style={styles.text}>{article.url}</Text>
          </View>
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
        </ScrollView>
      </View>
    </ThemeProvider>

  );
}

const saveArticle = async (article) => {
  //deep copy spread syntax
  article = { ...article }

  const uid = Firebase.auth().currentUser.uid;
  const userCollectionName = "users"
  article['timeSaved'] = firebase.firestore.Timestamp.fromDate(new Date());
  const db = Firebase.firestore();
  const ref = db.collection(userCollectionName).doc(uid).collection('saved')

  //try to make it unique
  //add try catch
  await ref.doc(article.datePublished.slice(0, 19) + article.geohash).set(article)
}


const viewArticle = async (article) => {
  //deep copy spread syntax
  article = { ...article }

  article['timeViewed'] = firebase.firestore.Timestamp.fromDate(new Date());
  const uid = Firebase.auth().currentUser.uid;
  const userCollectionName = "users"
  const db = Firebase.firestore();
  const ref = db.collection(userCollectionName).doc(uid).collection('recentlyViewed').orderBy('timeViewed').limit(11)

  await ref.get().then(res => {
    if (res.size >= RECENTLY_VIEWED_SIZE) {
      //console.log(res.docs[0].id)
      deleteDoc(db, userCollectionName, res.docs[0].id)
    }
  })

  const ref2 = db.collection(userCollectionName).doc(uid).collection('recentlyViewed')
  await ref2.doc(article.datePublished.slice(0, 19) + article.geohash).set(article)

  Linking.openURL(article.url)
}

const deleteDoc = async (db, userCollectionName, docid) => {
  await db.collection(userCollectionName).doc(uid).collection('recentlyViewed').doc(docid).delete();
}

export default ArticleScreen


const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: theme.colors.black
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 15
  },
  innerText: {
    alignItems: 'center',
    color: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    margin: 2,
    padding: 5,
  },
  text: {
    color: theme.colors.white
  },
  textc: {
    color: theme.colors.white,
  }
});