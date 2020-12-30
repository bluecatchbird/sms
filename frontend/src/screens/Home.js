import React from "react";
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


const Home = ({ navigation }) => {
  return (
    <View style={styles.center}>
      <Text>This is the home screen</Text>
      <Button
	  title="Go to About Screen"
	  onPress={() => navigation.navigate("About")}
	  />
      <Button
	  title="Open drawer"
	  onPress={() => navigation.toggleDrawer()}
	  />
      <Button
	  title="Open editor"
	  onPress={() => navigation.navigate("Editor")}
	  />
    </View>
  );
};

export default Home;

