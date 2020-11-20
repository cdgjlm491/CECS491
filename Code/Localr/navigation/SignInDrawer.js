import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Home from '../screens/HomeScreen.js'
import Filter from '../screens/FilterScreen.js'
import Map from '../screens/MapScreen.js'
import ProfileStack from './ProfileStack'
import MapStack from './MapStack'
import Test from '../screens/TestScreen'
import Saved from '../screens/SavedArticlesScreen'
import Recently from '../screens/RecentlyViewedScreen'

const MyTheme = {
  colors: {
    primary: 'rgb(23, 170, 234)',
    //background: 'rgb(252, 252, 255)',
    card: 'rgb(85, 91, 110)',
    text: 'rgb(252, 252, 255)',
    border: 'rgb(85, 91, 110)',
    notification: 'rgb(255, 69, 58)',
  },
};

const Drawer = createDrawerNavigator()

export default function SignInStack() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Drawer.Navigator
        //openByDefault= {true}
        edgeWidth = {25}
        screenOptions={{headerShown: false}}
        >
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name= "User Profile" component={ProfileStack} />
        <Drawer.Screen name="Map" component={MapStack} />
        <Drawer.Screen name="Filter" component={Filter} />
        <Drawer.Screen name="Saved Articles" component={Saved} />
        <Drawer.Screen name="Recently Viewed" component={Recently} />
        <Drawer.Screen name="Test" component={Test} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}