import React, { useState } from 'react'
import { View, StyleSheet, Alert, Linking, Button } from 'react-native';
import { CheckBox } from 'react-native-elements'

////////////////////////////////

// REDO ALL OF THIS

////////////////////////////////
const FilterScreen = (props) => {

    /*
    state = {
        tags: [
            {value: "Sports", isChecked: true},
            {value: "Politics", isChecked: true},
            {value: "Business", isChecked: true},
            {value: "Entertainment", isChecked: true},
            {value: "Health", isChecked: true},
            {value: "Science and Technology", isChecked: true},
            {value: "Travel", isChecked: true}
        ]
    }
    */

   const [filterList, setFilterList] = useState([
    {value: "Sports", isChecked: true},
    {value: "Politics", isChecked: true},
    {value: "Business", isChecked: true},
    {value: "Entertainment", isChecked: true},
    {value: "Health", isChecked: true},
    {value: "Science and Technology", isChecked: true},
    {value: "Travel", isChecked: true}
]);

    const checkButtons = (filterList) => {
        var buttons = [];
        for(let i = 0; i < filterList.length; i++) {
            buttons.push(
                <CheckBox
                title= {filterList[i].value}
                checked={checked}
                //onPress={() =>  Alert.alert('', (typeof setFilterList).toString())}
            />
            )
        }
        return buttons;
    }

        return (
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                   {checkButtons(filterList)}
                </View>
                <View style={styles.mapDrawerOverlay} />
            </View>
        );

}
export default FilterScreen

/*

//NOT MINE, updates the state when a checkbox is pressed, this is needed because the state should be immutable. Needs more research.
//https://stackoverflow.com/a/49502115
const handleChange = (e) => {
    // 1. Make a shallow copy of the items
    let tags = [...state.tags];
    // 2. Make a shallow copy of the item you want to mutate
    let tag = {...tags[e]};
    // 3. Replace the property you're intested in
    tag.isChecked = !tag.isChecked;
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    tags[e] = tag;
    // 5. Set the state to our new copy
    setState({tags});
}
//end not mine
*/



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
