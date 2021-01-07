import React from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});


const Home = ({ navigation }) => {
  const [ projects, setProjects] = React.useState([]);
  const [ update, setUpdate] = React.useState(true);

  React.useEffect(() => {
      if(update) {
        const request = new Request('http://127.0.0.1:8000/project')
        fetch(request)
              .then(res => res.json())
              .then(data=> {
                setProjects(data)
              });

        setUpdate(false);
      }
  },[update]);

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
	    onPress={() => navigation.navigate("Project",{projectId: "1234"})}
	    />
      <View style={{flex: 1, flexDirection: 'center', alignItems: 'center'}}>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <Grid container spacing={2}>
              {projects.map((project, index) => (
                <Grid key={index} item xs={12}>
                  <View>
                    <Button
                      onPress={() => {navigation.navigate('Project', {projectId: project.id} )}}
                      title={project.name}
                    />
                    <Button>
                      <DeleteIcon onClick={() => { alert(project.id)}}/>
                    </Button>
                  </View>
                </Grid>
              ))}
          </Grid>
        </View>
      </View>
    </View>
  );
};

export default Home;

