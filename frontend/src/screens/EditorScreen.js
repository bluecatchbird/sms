import React from "react";
import Editor from '../Editor/Editor.js';

const EditorScreen = ({ route, navigation }) => {
  return (
          <Editor id={route.params.id} />
  );
};

export default EditorScreen;
