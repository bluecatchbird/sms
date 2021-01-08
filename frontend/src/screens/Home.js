import React from "react";
import { View, Button, Text } from "react-native";
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';

import ButtonUI from '@material-ui/core/Button';
import ConfirmDialog from '../Dialog/ConfirmDialog.js';
import InputDialog from '../Dialog/InputDialog.js';
import AddFab from '../AddFab.js';

const Home = ({ navigation }) => {
  const [ projects, setProjects] = React.useState([]);
  const [ update, setUpdate] = React.useState(true);
  const [ deleteState, setDeleteState] = React.useState({dialogOpen: false, itemToDelete: null});
  const [ addDialogOpen, setAddDialogOpen] = React.useState(false);

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


  const deleteProject = (project) => {
    const request = new Request('http://127.0.0.1:8000/project/' + project.id,
            {method: 'DELETE'});
    fetch(request)
      .then(res => setUpdate(true))
      .catch(error => console.error(error));

    setDeleteState({dialogOpen: false, itemToDelete: null});   
  };

  const createNewProject = (name) => {
    const request = new Request('http://127.0.0.1:8000/project?name=' + name,
            {method: 'POST'});
    fetch(request)
      .then(res => res.json())
      .then(res => {
        setUpdate(true);
        navigation.navigate('Project', {projectId: res.id});
        console.log(res);
      })
      .catch(error => {
        console.error(error)
      });
  };


  console.log(addDialogOpen);

  return (
    <View style={{flex:1}}>
      <ConfirmDialog onConfirm={() => deleteProject(deleteState.itemToDelete)} onClose={() => setDeleteState({dialogOpen: false})} open={deleteState.dialogOpen}
              title="Delete Project" content="Do you want to delete the project?" abortLabel="abort" confirmLabel="Delete" />

      <InputDialog onConfirm={(name) => {setAddDialogOpen(false); createNewProject(name);}} onClose={() => setAddDialogOpen(false)} open={addDialogOpen}
              title="Create project" value="" content="Enter name of new Project" abortLabel="Abort" confirmLabel="Add" />

      <View style={{flex: 1, flexDirection: 'center', alignItems: 'center'}}>
        <Text>Projects:</Text>
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


        <View style={{flex: 1, flexDirection: 'column'}}>
          <Grid container spacing={2}>
              {projects.map((project, index) => (
                <Grid key={index} item xs={12}>
                  <View style={{flex: 1, flexDirection: 'row', width: "100%"}}>
                    <ButtonUI fullWidth onClick={() => {navigation.navigate('Project', {projectId: project.id} )}}>
                      {project.name}
                    </ButtonUI>
                    <ButtonUI onClick={() => setDeleteState({dialogOpen: true, itemToDelete: project})}>
                      <DeleteIcon />
                    </ButtonUI>
                  </View>
                </Grid>
              ))}
          </Grid>
        </View>
      </View>
      <AddFab onClick={() => setAddDialogOpen(true)} />
    </View>
  );
};

export default Home;

