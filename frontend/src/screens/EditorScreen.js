import React from "react";
import Editor from '../Editor/Editor.js';
import { HeaderBackButton } from '@react-navigation/stack';


const EditorScreen = ({ route, navigation }) => {
  navigation.setOptions({headerLeft: (props) => (
          <HeaderBackButton {...props} onPress={() => navigation.navigate('Project', {projectId: route.params.projectId})} /> )});

  const setTitle = (newTitle) => {
    navigation.setOptions({title: "Article: " + newTitle}); 
  };

  return (
          <Editor onTitleChange={setTitle} projectId={route.params.projectId} articleId={route.params.articleId} />
  );
};

export default EditorScreen;
