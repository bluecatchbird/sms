import React, {Component} from "react";
import { View, Button, Text, StyleSheet } from "react-native";

import FontAwesomeIcon from 'react-native-vector-icons/dist/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/dist/Entypo';

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});


class Home extends Component {
  constructor() {
    super();
    this.state = {
      articles: []
    }
  }

  componentWillMount() {
    fetch("http://localhost:8882/article")
    .then( response => response.json())
    .then(data => this.setState({articles: data.articles}))
    .catch(error => alert(error));
  }

  render() {
    return (
      <View style={styles.center}>
        <Text>This is the home screen</Text>
        <Button
	        title="Go to About Screen"
	        onPress={() => this.props.navigation.navigate("About")}
	      />
        <Button
	        title="Open drawer"
	        onPress={() => this.props.navigation.toggleDrawer()}
	      />
        {this.state.articles.map((obj) => {
                return(<Text>{obj.name}</Text>);
        })}
      </View>
    );
  }
}

export default Home;

