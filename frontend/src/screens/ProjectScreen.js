import React from "react";
import { View } from 'react-native';

import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';

import AddNewArticleButton from '../Project/AddNewArticleButton.js';
import ProjectData from '../projectData.js';


const ProjectScreen = ({ navigation }) => {
  const [project, setProject] = React.useState([]);
  const [update, setUpdate] = React.useState(true);

  React.useEffect(() => {
      if(update) {
        updateProject();
        setUpdate(false);
      }
  },[update]);

  const updateProject = () => {
    ProjectData.read(setProject);
    setUpdate(true);
  };

  const createNewArticle = (name) => {
    ProjectData.createNewArticle(name, (article) => {
      updateProject();
	    navigation.navigate("Editor", {
        id: article.id,
      });
    });

  };

  const deleteArticleById = (id) => {
    ProjectData.deleteById(id);
    updateProject();
  }

  return (
        <View style={{flex: 1, flexDirection: 'center', alignItems: 'center'}}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <Grid container spacing={2}>
                {project.map((value, index) => (
                  <Grid key={index} item xs={12}>
                    <View style={{flex: 1, flexDirection: 'row', width: "100%"}}>
                      <Button
                        fullWidth
                        onClick={() => {navigation.navigate("Editor", {id: value.id})}}
                      >
                      Article: {value.elements.find(obj => {return obj.name === "Name"}).value}
                      </Button>
                      <Button>
                        <DeleteIcon onClick={() => { deleteArticleById(value.id)}}/>
                      </Button>
                    </View>
                  </Grid>
                ))}
            </Grid>
          </View>
          <AddNewArticleButton onAddArticle={createNewArticle}/>
        </View>
  );
};

export default ProjectScreen;
