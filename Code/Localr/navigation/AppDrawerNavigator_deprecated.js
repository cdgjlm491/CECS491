/*
import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/Mapcreen';
import FilterScreen from '../screens/FilterScreen';

const INITIAL_ROUTE_NAME = 'Login';
const Drawer = createDrawerNavigator();

export default function AppDrawerNavigator({ navigation, route }) {
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
      case 'Forgot':
        return 'Forgot';

    }
  }
  */