import React from "react";
import { Button } from '@material-ui/core';
import { createStackNavigator } from "@react-navigation/stack";
//import Icon from 'react-native-vector-icons/FontAwesome';
import MenuIcon from '@material-ui/icons/Menu';

import Home from "../screens/Home";
import About from "../screens/About";
import Contact from "../screens/Contact";

const Stack = createStackNavigator();

const screenOptionStyle = ({route, navigation}) => ({
  headerStyle: {
    backgroundColor: "#9AC4F8",
  },
  headerTitleStyle: {
    alignSelf: 'center',
  },
  headerTintColor: "black",
  headerBackTitle: "Back",
});

const homeOptionStyle = ({route, navigation}) => ({
  headerLeft: () => (
    <Button
      onClick={() => navigation.toggleDrawer()}
    >
      <MenuIcon size="large"/>
    </Button>
  )

});

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Home" options={homeOptionStyle} component={Home} />
      <Stack.Screen name="About" component={About} />
    </Stack.Navigator>
  );
}

const ContactStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Contact" component={Contact} />
    </Stack.Navigator>
  );
}

export { MainStackNavigator, ContactStackNavigator };
