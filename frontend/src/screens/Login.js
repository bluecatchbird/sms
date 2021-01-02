import React, { Component } from 'react';
import { TouchableOpacity, View, Text, TextInput, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
     container: {
             margin: "15%",
             flex: 1,
             flexDirection: "column",
             justifyContent: "center",
          },
     input: {
             height: 40,
             marginTop: 12,
             borderColor: 'gray',
             borderWidth: 1,
             borderRadius: 4,
          },
    titleText: {
          fontSize: 30,
          height: 40,
          textAlign: "center",          
        },
    button: {
          marginTop: 12,
          justifyContent: "center",
          height: 40,
          backgroundColor: "powderblue",
          borderRadius: 4,

    },
    text: {
          fontColor: "white",
          textAlign: "center",          
    }
})

class Login extends Component {
  render(navigation) {
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>Login Lagerverwaltung</Text>
        <TextInput style={styles.input}
          placeholder="Benutzername"/>
        <TextInput style={styles.input}
          secureTextEntry
          placeholder="Passwort"/>
        <TouchableOpacity style={styles.button}
          onPress={() => {this.props.onLogin()}}>
          <Text style={styles.text}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Login;
