import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import FilterScreen from '../screens/FilterScreen';

const Drawer = createDrawerNavigator();
const INITIAL_ROUTE_NAME = 'Login';

export default function DrawerNavigator({ navigation, route }) {
    // Set the header title on the parent stack navigator depending on the
    // currently active tab. Learn more in the documentation:
    // https://reactnavigation.org/docs/en/screen-options-resolution.html
    navigation.setOptions({ headerTitle: getHeaderTitle(route) });
  
    return (
      <Drawer.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Home',
            //tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-code-working" />,
          }}
        />
        <Drawer.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: 'Login',
            swipeEnabled: false
            //tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
          }}
        />
        <Drawer.Screen
        name="Filter"
        component={FilterScreen}
        options={{
          title: 'Filter',
          //tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
        }}
      />    
    </Drawer.Navigator>
    );
  }

  
  function getHeaderTitle(route) {
    const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;
  
    switch (routeName) {
      case 'Home':
        return 'Local News';
      case 'Login':
        return 'Login';
      case 'Filter':
        return 'Filter';     
    }
  }