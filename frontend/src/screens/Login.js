import React, { Component } from 'react';
import { TouchableOpacity, View, Text, TextInput, Button, StyleSheet } from 'react-native';

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
  constructor() {
    super();
    this.state = {
      username: "",
      password: ""
    }
  }
  render(navigation) {
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>Login Lagerverwaltung</Text>
        <TextInput style={styles.input}
          placeholder="Benutzername"
          value={this.state.username}
          onChangeText={text => this.setState({username: text})}
        />
        <TextInput style={styles.input}
          secureTextEntry
          placeholder="Passwort"
          value={this.state.password}
          onChangeText={text => this.setState({password: text})}
        />
        <TouchableOpacity style={styles.button}
          onPress={() => {this.props.onLogin(this.state.username, this.state.password)}}>
          <Text style={styles.text}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Login;
