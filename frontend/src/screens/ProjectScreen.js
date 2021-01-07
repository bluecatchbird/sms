import React from "react";
import { View } from 'react-native';

import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';

import AddNewArticleButton from '../Project/AddNewArticleButton.js';

import { HeaderBackButton } from '@react-navigation/stack';

const ProjectScreen = ({ route, navigation }) => {
  const [articles, setArticles] = React.useState([]);
  const [update, setUpdate] = React.useState(true);

  navigation.setOptions({headerLeft: (props) => (
          <HeaderBackButton {...props} onPress={() => navigation.navigate('Home')} /> )});

  React.useEffect(() => {
      if(update) {
        updateProject();
        setUpdate(false);
      }
  },[update]);

  const updateProject = () => {
    const request = new Request('http://127.0.0.1:8000/project/' + route.params.projectId)
    fetch(request)
          .then(res => res.json())
          .then(data=> {
            setArticles(data.articles)
            navigation.setOptions({ title: "Project: " + data.name});
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

  return (
        <View style={{flex: 1, flexDirection: 'center', alignItems: 'center'}}>
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
