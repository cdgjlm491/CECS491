import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Button } from 'react-native';
import { CheckBox } from 'react-native-elements'
import Firebase from '../components/Firebase'

const FilterScreen = () => {

  //I don't like this, but it works

  const [business, setBusiness] = useState(false);
  const [entertainment, setEntertainment] = useState(false);
  const [health, setHealth] = useState(false);
  const [politics, setPolitics] = useState(false);
  const [crime, setCrime] = useState(false);
  const [science, setScience] = useState(false);
  const [sports, setSports] = useState(false);
  const [travel, setTravel] = useState(false);


const getTopics = async () => {
  const email = Firebase.auth().currentUser.email;
  const collectionName = "NewUsers"
  const db = Firebase.firestore();
  const ref = db.collection(collectionName).doc(email)

  //add try catch
  const doc = await ref.get();

  if (!doc.exists) {
    console.log('No such document!');
  } else {
    console.log('Document data:', doc.data());
    return doc.data().Interests
  }

}


const update = async () => {
  topiclist = []
  const email = Firebase.auth().currentUser.email;

  if (politics) {
    topiclist.push('politics')
  }
  if (business) {
    topiclist.push('business')
  }
  if (crime) {
    topiclist.push('crime')
  }
  if (entertainment) {
    topiclist.push('entertainment')
  }
  if (health) {
    topiclist.push('health')
  }
  if (sports) {
    topiclist.push('sports')
  }
  if (travel) {
    topiclist.push('travel')
  }
  if (science) {
    topiclist.push('science & tech')
  }
  console.log(topiclist)


  //add try catch
  const ref = await Firebase.firestore().collection('NewUsers').doc(email)
  const res = await ref.update({ Interests: topiclist })
}

  useEffect(() => {
    // Runs after the first render() lifecycle
    getTopics().then(topiclist => {
      console.log(topiclist)
      topiclist.forEach(topic => {
        switch (topic) {
          case 'business':
            setBusiness(true)
            break;
          case 'entertainment':
            setEntertainment(true)
            break;
          case 'health':
            setHealth(true)
            break;
          case 'politics':
            setPolitics(true)
            break;
          case 'crime':
            setCrime(true)
            break;
          case 'science & tech':
            setScience(true)
            break;
          case 'sports':
            setSports(true)
            break;
          case 'travel':
            setTravel(true)
            break;
          default:
            console.log('error')
        }
      })
    })
  }, []);


  return (
    <View style={styles.contentContainer}>
      <CheckBox
        title='Politics'
        checked={politics}
        onPress={() => setPolitics(!politics)}
        style={styles.checkbox}
      />
      <CheckBox
        title='Business'
        checked={business}
        onPress={() => setBusiness(!business)}
        style={styles.checkbox}
      />
      <CheckBox
        title='Crime'
        checked={crime}
        onPress={() => setCrime(!crime)}
        style={styles.checkbox}
      />
      <CheckBox
        title='Health'
        checked={health}
        onPress={() => setHealth(!health)}
        style={styles.checkbox}
      />
      <CheckBox
        title='Entertainment'
        checked={entertainment}
        onPress={() => setEntertainment(!entertainment)}
        style={styles.checkbox}
      />
      <CheckBox
        title='Science and tech'
        checked={science}
        onPress={() => setScience(!science)}
        style={styles.checkbox}
      />
      <CheckBox
        title='Travel'
        checked={travel}
        onPress={() => setTravel(!travel)}
        style={styles.checkbox}
      />
      <CheckBox
        title='Sports'
        checked={sports}
        onPress={() => setSports(!sports)}
        style={styles.checkbox}
      />
      <Button title='Update' onPress={() => update()}></Button>
    </View>
  );

}
export default FilterScreen




const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    paddingTop: 15
  },
  button: {
    marginTop: 10
  },
  input: {
    marginTop: 10
  },
  image: {
    height: 200,
    width: 200,
    resizeMode: 'contain',
  },
  logoContainer: {
    alignItems: 'center',
  },
  icon: {
    marginRight: 10
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
