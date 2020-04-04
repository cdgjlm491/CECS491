import * as React from 'react';
import { StyleSheet, View} from 'react-native';
import { CheckBox } from 'react-native-elements'




export default class FilterScreen extends React.Component {
    state = {
        tags: [
            {value: "Sports", isChecked: true},
            {value: "Politics", isChecked: true},
            {value: "Education", isChecked: true},
            {value: "Celebrity", isChecked: true}
        ]

    }

    //there must be a better way to do this without so much code reuse
    //todo: more research

    //NOT MINE, updates the state when a checkbox is pressed, this is needed because the state should be immutable.
    //https://stackoverflow.com/a/49502115
    handleChange(e) {
        // 1. Make a shallow copy of the items
        let tags = [...this.state.tags];
        // 2. Make a shallow copy of the item you want to mutate
        let tag = {...tags[e]};
        // 3. Replace the property you're intested in
        tag.isChecked = !tag.isChecked;
        // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        tags[e] = tag;
        // 5. Set the state to our new copy
        this.setState({tags});
    }

    checkButtons() {
        const buttons = [];
        for(let i = 0; i < this.state.tags.length; i++) {
            buttons.push(
                <CheckBox
                title= {this.state.tags[i].value}
                checked={this.state.tags[i].isChecked}
                onPress={() => this.handleChange(i)}
            />
            )
        }
        return buttons;
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                   {this.checkButtons()}                            
                </View>
            </View>
        )
    }

}

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
});
