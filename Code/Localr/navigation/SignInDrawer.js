import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Home from '../screens/HomeScreen.js'
import Filter from '../screens/FilterScreen.js'
import Map from '../screens/MapScreen.js'


const Drawer = createDrawerNavigator()

export default function SignInStack() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        openByDefault= {true}
        edgeWidth = {25}>
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Map" component={Map} />
        <Drawer.Screen name="Filter" component={Filter} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}