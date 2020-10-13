import React, { Component } from "react";

import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";

import { MainStackNavigator } from "./StackNavigator";

const Drawer = createDrawerNavigator();

class DrawerNavigator extends Component {
  render() {
    return (
      <Drawer.Navigator initialRouteName="Home" drawerContent={props => {
      return (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem label="Logout" onPress={() => this.props.onLogout()} />
        </DrawerContentScrollView>
      )
    }}>
        <Drawer.Screen name="Home" component={MainStackNavigator} />
      </Drawer.Navigator>
    );
  }
}

export default DrawerNavigator;

