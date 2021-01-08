import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from "@react-navigation/stack";

import DrawerNavigator from "./navigation/DrawerNavigator";
import Login from "./screens/Login";


const Stack = createStackNavigator();


const App = () => {
  const [loggedin, setLoggedin] = React.useState(false);

  React.useEffect(() => {
    AsyncStorage.getItem('loggedin')
    .then((token) => {
      if(token !== null && token === "true") {
        setLoginState(true);
      }
    }).catch((error) => {
      console.log(error);
    });
  },[]);

  const setLoginState = (loginState) => {
    setLoggedin(loginState);
    AsyncStorage.setItem('loggedin', loginState);
  }

  return (
    <NavigationContainer linking>
      {loggedin === false ? (
      <Stack.Navigator>
        <Stack.Screen name="Login">
              {props => <Login onLogin={() => {setLoginState(true);}} />}
        </Stack.Screen>
      </Stack.Navigator>
      ) : (
      <DrawerNavigator onLogout={() => {setLoginState(false);}} />
      )}
    </NavigationContainer>
  );
};

export default App;
