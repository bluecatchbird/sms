import React from "react";
import Editor from '../Editor/Editor.js';
import { HeaderBackButton } from '@react-navigation/stack';


const EditorScreen = ({ route, navigation }) => {
  navigation.setOptions({headerLeft: (props) => (
          <HeaderBackButton {...props} onPress={() => goToProject()} /> )});

  const setTitle = (newTitle) => {
    navigation.setOptions({title: "Article: " + newTitle}); 
  };

  const goToProject = (newTitle) => {
    navigation.navigate('Project', {projectId: route.params.projectId});
  };

  return (
          <Editor onGoToProject={goToProject} onTitleChange={setTitle} projectId={route.params.projectId} articleId={route.params.articleId} />
  );
};

export default EditorScreen;
