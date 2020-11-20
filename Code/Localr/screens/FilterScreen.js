import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Button } from 'react-native';
import { CheckBox, ThemeProvider } from 'react-native-elements'
import Firebase from '../components/Firebase'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';

const theme = {
  CheckBox: {
    uncheckedColor: '#17AAEA',
    checkedColor: '#F05D5E',
  },
};

const FilterScreen = () => {

  const [topics, setTopics] = useState({
    'business': false, 'entertainment': false, 'health': false, 'politics': false,
    'crime': false, 'science': false, 'sports': false, 'travel': false
  })


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
      //console.log('Document data:', doc.data());
      return doc.data().Interests
    }
  }


  const update = async () => {
    topiclist = []
    const email = Firebase.auth().currentUser.email;
    for (key in topics) {
      if (topics[key]) {
        topiclist.push(key.toString())
      }
    }


    //add try catch
    const ref = await Firebase.firestore().collection('NewUsers').doc(email)
    const res = await ref.update({ Interests: topiclist })
  }

  useEffect(() => {
    // Runs after the first render() lifecycle
    console.log('useEffect')
    getTopics().then(topiclist => {
      topicstate = {
        'business': false, 'entertainment': false, 'health': false, 'politics': false,
        'crime': false, 'science': false, 'sports': false, 'travel': false
      }
      //console.log(topiclist)
      topiclist.forEach(topic => {
        topicstate[topic] = true
      })
      setTopics(topicstate)
      console.log('useEffect set')
    })
  }, []);

  const updateTopics = (topic) => {
    topicstate = { ...topics }
    topicstate[topic] = !topicstate[topic]
    setTopics(topicstate)
  }

  //can't get this to work for some reason
  /*
  const generateCheckBoxes = () => {
    checkList = []
    for (topic in topics) {
    checkList.push(<CheckBox
    title={topic.charAt(0).toUpperCase() + topic.slice(1)}
    checked={topics[topic]}
    onPress={() => updateTopics(topic)}
    style={styles.checkbox}
    key={uuidv4()}
   />
    )}
    return (
     <View>
       {checkList}
     </View>
   );
   }
 */

  return (
    <View style={styles.container}>
      <ThemeProvider theme={theme}>
        <CheckBox
          containerStyle={styles.checkb}
          textStyle={styles.checkt}
          title='Politics'
          checked={topics['politics']}
          onPress={() => updateTopics('politics')}
          style={styles.checkbox}
        />
        <CheckBox
          containerStyle={styles.checkb}
          textStyle={styles.checkt}
          title='Business'
          checked={topics['business']}
          onPress={() => updateTopics('business')}
          style={styles.checkbox}
        />
        <CheckBox
          containerStyle={styles.checkb}
          textStyle={styles.checkt}
          title='Crime'
          checked={topics['crime']}
          onPress={() => updateTopics('crime')}
          style={styles.checkbox}
        />
        <CheckBox
          containerStyle={styles.checkb}
          textStyle={styles.checkt}
          title='Health'
          checked={topics['health']}
          onPress={() => updateTopics('health')}
          style={styles.checkbox}
        />
        <CheckBox
          containerStyle={styles.checkb}
          textStyle={styles.checkt}
          title='Entertainment'
          checked={topics['entertainment']}
          onPress={() => updateTopics('entertainment')}
          style={styles.checkbox}
        />
        <CheckBox
          containerStyle={styles.checkb}
          textStyle={styles.checkt}
          title='Science and tech'
          checked={topics['science']}
          onPress={() => updateTopics('science')}
          style={styles.checkbox}
        />
        <CheckBox
          containerStyle={styles.checkb}
          textStyle={styles.checkt}
          title='Travel'
          checked={topics['travel']}
          onPress={() => updateTopics('travel')}
          style={styles.checkbox}
        />
        <CheckBox
          containerStyle={styles.checkb}
          textStyle={styles.checkt}
          title='Sports'
          checked={topics['sports']}
          onPress={() => updateTopics('sports')}
          style={styles.checkbox}
        />
      </ThemeProvider>
      <Button title='Update' onPress={() => update()}></Button>
    </View>
  );

}
export default FilterScreen




const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(85, 91, 110)'
  },
  checkb: {
    backgroundColor: 'rgb(85, 91, 110)',
    borderColor: 'rgb(23, 170, 234)'
  },
  checkt: {
    color: 'rgb(252, 252, 255)',
  }
});
