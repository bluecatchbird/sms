import React from "react";
import { View } from 'react-native';

import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';

import ConfirmDialog from '../Dialog/ConfirmDialog.js';
import InputDialog from '../Dialog/InputDialog.js';
import AddFab from '../AddFab.js';

import { HeaderBackButton } from '@react-navigation/stack';


const ProjectScreen = ({ route, navigation }) => {
  const [articles, setArticles] = React.useState([]);
  const [update, setUpdate] = React.useState(true);
  const [deleteState, setDeleteState] = React.useState({dialogOpen: false, itemToDelete: null});
  const [addState, setAddState] = React.useState(false);


  React.useEffect(() => {
      if(update) {
        updateProject();
        setUpdate(false);
        navigation.setOptions({headerLeft: (props) => (
                <HeaderBackButton {...props} onPress={() => navigation.navigate('Home')} /> )});
      }
  },[update]);

  const updateProject = () => {
    const request = new Request('http://127.0.0.1:8000/project/' + route.params.projectId)
    fetch(request)
          .then(res => res.json())
          .then(data=> {
            navigation.setOptions({ title: "Project: " + data.name});
            setArticles(data.articles)
          });

    setUpdate(true);
  };

  const createNewArticle = (name) => {
    const request = new Request('http://127.0.0.1:8000/project/' + route.params.projectId + '/article?name=' + name,
            {method: 'POST'});
    fetch(request)
      .then(res => res.json())
      .then(res => {
        updateProject();
        alert(res.json())
        navigateToArticle(res.id);
      })
      .catch(error => {
        console.error(error)
      });
  };

  const navigateToArticle = (articleId) => {
	    navigation.navigate("Editor", {
        projectId: route.params.projectId,
        articleId: articleId,
      });
  };

  const deleteArticleById = (id) => {
    const request = new Request('http://127.0.0.1:8000/project/' + route.params.projectId + '/article/' + id,
            {method: 'DELETE'});
    fetch(request)
      .then(res => updateProject())
      .catch(error => console.error(error));
  }

  const fabStyles = {
        position: 'absolute',
        right: 15,
        bottom: 15,
  };

  return (
        <View style={{flex: 1, flexDirection: 'center', alignItems: 'center'}}>
          <ConfirmDialog onConfirm={() => deleteArticleById(deleteState.itemToDelete.id)} onClose={() => setDeleteState({dialogOpen: false})} open={deleteState.dialogOpen}
                  title="Delete Article" content="Do you want to delete the Article?" abortLabel="Abort" confirmLabel="Delete" />

          <InputDialog onConfirm={(name) => {setAddState(false); createNewArticle(name);}} onClose={() => setAddState(false)} open={addState}
                  title="Create Article" value="" content="Enter name of new article" abortLabel="Abort" confirmLabel="Add" />

          <View style={{flex: 1, flexDirection: 'column'}}>
            <Grid container spacing={2}>
                {articles.map((value, index) => (
                  <Grid key={index} item xs={12}>
                    <View style={{flex: 1, flexDirection: 'row', width: "100%"}}>
                      <Button
                        fullWidth
                        onClick={() => {navigateToArticle(value.id)}}
                      >
                      Article: {value.name}
                      </Button>
                      <Button>
                        <DeleteIcon onClick={() => { setDeleteState({dialogOpen: true, itemToDelete: value})}}/>
                      </Button>
                    </View>
                  </Grid>
                ))}
            </Grid>
          </View>
          <AddFab onClick={() => setAddState(true)} />
        </View>
  );
};

export default ProjectScreen;
