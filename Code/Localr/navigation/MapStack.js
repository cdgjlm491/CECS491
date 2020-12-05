import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Map from '../screens/MapScreen.js'
import Article from '../screens/ArticleScreen'


const Stack = createStackNavigator()

const MapStack = (props) => {
  return (
      <Stack.Navigator >
        <Stack.Screen name="Map" component={Map} options={{headerShown: false}}/>
        <Stack.Screen name="Article" component={Article} />
      </Stack.Navigator>

  )
}
export default MapStack;