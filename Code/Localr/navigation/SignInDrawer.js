import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Home from '../screens/HomeScreen.js'
import Filter from '../screens/FilterScreen.js'
import Map from '../screens/MapScreen.js'
=======
//import ProfileApp from '../screens/ProfileScreen.js'
import ProfileStack from './ProfileStack'
import Test from '../screens/TestScreen'

const Drawer = createDrawerNavigator()

export default function SignInStack() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        //openByDefault= {true}
        edgeWidth = {25}>
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name= "User Profile" component={ProfileStack} />
        <Drawer.Screen name="Map" component={Map} />
        <Drawer.Screen name="Filter" component={Filter} />
        <Drawer.Screen name="Test" component={Test} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}