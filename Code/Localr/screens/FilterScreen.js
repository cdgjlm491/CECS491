import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Alert, Linking, Button, Text } from 'react-native';
import { CheckBox } from 'react-native-elements'


const FilterScreen = (props) => {

const [filterList, setFilterList] = useState(
  {"Sports": true, "Politics": true, "Business": true, "Entertainment": true, "Health": true, "Science and Technology": true, "Travel": true});

    const checkButtons = () => {
        var buttons = [];
        for(var name in filterList) {
              buttons.push(
              <CheckBox
              key={Math.random()}
              title= {name}
              checked={filterList[name]}
              onPress={() =>  changeCheck(name)}
              />
            )
        }
        return buttons;
    }

    const changeCheck = (name) => {
      filterListCopy = filterList
      filterListCopy[name] = !filterListCopy[name]
      setFilterList(filterListCopy)
      console.log(filterList)
    }

    return (
      <View style={styles.contentContainer}>
        {checkButtons()}
        <Button title = 'Update'></Button>
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
