import React from "react";
import Editor from '../Editor/Editor.js';

const EditorScreen = ({ route, navigation }) => {
  return (
          <Editor projectId={route.params.projectId} articleId={route.params.articleId} />
  );
};

export default EditorScreen;
