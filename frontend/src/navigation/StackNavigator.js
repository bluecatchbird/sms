import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import EntypoIcon from 'react-native-vector-icons/dist/Entypo';

import Home from "../screens/Home";
import About from "../screens/About";
import Contact from "../screens/Contact";
import ProjectScreen from "../screens/ProjectScreen.js";
import EditorScreen from "../screens/EditorScreen.js";

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

const homeOptionStyle = ({navigation}) => ({
  headerLeft: () => {
    return(
      	<EntypoIcon name="menu" size={30} onPress={() => navigation.toggleDrawer()}/>
    )
  }

});

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Home" options={homeOptionStyle} component={Home} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="Project" component={ProjectScreen} />
      <Stack.Screen name="Editor" component={EditorScreen} />
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
