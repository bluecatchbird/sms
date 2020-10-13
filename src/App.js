import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";

import DrawerNavigator from "./navigation/DrawerNavigator";
import Login from "./screens/Login";

import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedin: false,
    }
  }

  render() {
    return (
      <NavigationContainer>
        {this.state.loggedin == false ? (
        <Stack.Navigator>
          <Stack.Screen name="Login">
                {props => <Login onLogin={() => {this.setState({loggedin: true});}} />}
          </Stack.Screen>
        </Stack.Navigator>
        ) : (
        <DrawerNavigator onLogout={() => {this.setState({loggedin: false});}} />
        )}
      </NavigationContainer>
    );
  }
}
export default App

