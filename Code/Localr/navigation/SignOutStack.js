import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Login from '../screens/LoginScreen'
import Forgot from '../screens/ForgotPasswordScreen'

const Stack = createStackNavigator()

export default function SignOutStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Forgot Password" component={Forgot} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}