import React from "react";
import { View, Button, Text, StyleSheet } from "react-native";

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
	  title="Open project"
	  onPress={() => navigation.navigate("Project")}
	  />
    </View>
  );
};

export default Home;

