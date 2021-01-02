
import React from 'react';
import { View, FlatList } from 'react-native';
import TextField from '@material-ui/core/TextField';

import ConfirmAndDeleteButton from './ConfirmAndDeleteButton.js';
import EditButton from './EditButton.js';
import AddNewElementFab from './AddNewElementFab.js';

import createUUID from '../createUUUID.js';
import ProjectData from '../projectData.js';


const EditField = (props) => {
  return ( <View style={{flex: 1, flexDirection: 'row'}}>
           <TextField label={props.element.name} value={props.element.value} InputProps={{readOnly: true}} />
           <EditButton element={props.element} onEdit={props.onEdit} />
           <ConfirmAndDeleteButton element={props.element} onDelete={props.onDelete} />
         </View>);
}



function Editor(props) {
  const [article, setArticle] = React.useState({
    elements: [],
  });

  React.useEffect(() => {
    ProjectData.getArticleById(props.id, (data) => {
      setArticle(data);
      console.log(data);
    });
  }, [props.id]);

  const updateArticle = (elements) => {
    const newArticle = {
            id: article.id,
            elements: elements,
    };
    ProjectData.updateArticle(newArticle);
    setArticle(newArticle);


  };

  const addElement = () => {
    const data = Object.assign([], article.elements); 
    let newElement = {
      name: "Test-Name",
      value: "Test-Value",
      id: createUUID(),
    };
    newElement.editorOpen = true;

    data.push(newElement);
    updateArticle(data);
  };

  const deleteElement = (element) => {
    const index = article.elements.findIndex(obj => { return obj.id === element.id });
    const data = Object.assign([], article.elements);
    data.splice( index, 1);
    updateArticle(data);
  };

  const editElement = (element) => {
    const index = article.elements.findIndex(obj => { return obj.id === element.id });
    const data = Object.assign([], article.elements);
    data.splice(index, 1, element);
    updateArticle(data);
  };

  return <View style={{flex: 1, alignItems: 'stretch'}}>
           <View style={{flex: 1, flexDirection: 'center', alignItems: 'center'}}>
             <FlatList data={article.elements} renderItem={({item}) => <EditField element={item} onDelete={deleteElement} onEdit={editElement} />} />
           </View>
           <AddNewElementFab onAdd={addElement} />
         </View>;
}


export default Editor;
