import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator } from "@react-navigation/stack";

import DrawerNavigator from "./navigation/DrawerNavigator";
import Login from "./screens/Login";


const Stack = createStackNavigator();



class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedin: false,
    }
  }

  componentWillMount() {
    AsyncStorage.getItem('loggedin')
    .then((token) => {
      if(token !== null && token === "true") {
        this.setLoginState(true);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  setLoginState(loginState) {
    this.setState({loggedin: loginState});
    AsyncStorage.setItem('loggedin', loginState);
    console.log("state: " + loginState);
  }

  render() {
    return (
      <NavigationContainer linking>
        {this.state.loggedin === false ? (
        <Stack.Navigator>
          <Stack.Screen name="Login">
                {props => <Login onLogin={() => {this.setLoginState(true);}} />}
          </Stack.Screen>
        </Stack.Navigator>
        ) : (
        <DrawerNavigator onLogout={() => {this.setLoginState(false);}} />
        )}
      </NavigationContainer>
    );
  }
}
export default App

