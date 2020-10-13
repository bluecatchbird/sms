import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});

class Login extends Component {
  render(navigation) {
    return (
      <View style={styles.center}>
        <Text>Login Lagerverwaltung</Text>
        <TextInput
          placeholder="Benutzername"/>
        <TextInput
          secureTextEntry
          placeholder="Passwort"/>
        <Button
            title="Login"
            onPress={() => {this.props.onLogin()}}/>
      </View>
    );
  }
}

export default Login;
