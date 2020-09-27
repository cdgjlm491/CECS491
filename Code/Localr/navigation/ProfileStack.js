import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Profile from '../screens/ProfileScreen'
import UpdateProfile from '../screens/UpdateProfileScreen'



const Stack = createStackNavigator()

const ProfileStack = (props) => {
  return (
      <Stack.Navigator>
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Update Profile" component={UpdateProfile} />
      </Stack.Navigator>

  )
}
export default ProfileStack;