import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import { MainStackNavigator } from "./StackNavigator";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={MainStackNavigator} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;

