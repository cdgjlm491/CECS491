import React, { useState, useEffect, createContext } from 'react'
import Firebase from '../components/Firebase'
import SignInStack from './SignInDrawer'
import SignOutStack from './SignOutStack'

//read this to understand what is happening, there are two navigation containers depending if you are logged in or not, this file chooses which container to use.
//https://heartbeat.fritz.ai/how-to-manage-authentication-flows-in-react-native-with-react-navigation-v5-and-firebase-860f57ae20d3

export const AuthContext = createContext(null)

export default function AuthNavigator() {
    const [initializing, setInitializing] = useState(true)
    const [user, setUser] = useState(null)

    // Handle user state changes
    function onAuthStateChanged(result) {
      setUser(result)
      if (initializing) setInitializing(false)
    }

    useEffect(() => {
      const authSubscriber = Firebase.auth().onAuthStateChanged(onAuthStateChanged)

      // unsubscribe on unmount
      return authSubscriber
    }, [])

    if (initializing) {
      return null
    }

    return user ? (
      <AuthContext.Provider value={user}>
        <SignInDrawer/>
      </AuthContext.Provider>
    ) : (
      <SignOutStack />
    )
  }