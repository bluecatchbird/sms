
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import TextField from '@material-ui/core/TextField';

import ConfirmAndDeleteButton from './ConfirmAndDeleteButton.js';
import EditButton from './EditButton.js';
import AddNewElementFab from './AddNewElementFab.js';

function createUUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c==='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

const EditField = (props) => {
  return ( <View style={{flex: 1, flexDirection: 'row'}}>
           <TextField label={props.element.name} value={props.element.value} InputProps={{readOnly: true}} />
           <EditButton element={props.element} onEdit={props.onEdit} />
           <ConfirmAndDeleteButton element={props.element} onDelete={props.onDelete} />
         </View>);
}



function Editor() {
  const [states, setStates] = React.useState({
    elements: [],
  });


  React.useEffect(() => {
    setStates({
            elements: [getRandomElement(), getRandomElement(), getRandomElement()],
    });
  }, []);

  const getRandomElement = () => {
    return {
            name: Math.random().toString(36).substring(7),
            value: Math.random().toString(36).substring(7),
            id: createUUID(),
    };
  }

  const addElement = () => {
    const data = Object.assign([], states.elements); 
    let newElement = {
      name: "Name",
      value: "Value",
      id: createUUID(),
    };
    newElement.editorOpen = true;

    data.push(newElement);
    setStates({
            elements: data,
    });
  };

  const deleteElement = (element) => {
    const index = states.elements.findIndex(obj => { return obj.id === element.id });
    const data = Object.assign([], states.elements);
    data.splice( index, 1);
    setStates({
            elements: data,
    });
  };

  const editElement = (element) => {
    const index = states.elements.findIndex(obj => { return obj.id === element.id });
    const data = Object.assign([], states.elements);
    data.splice(index, 1, element);

    setStates({
            elements: data,
    });
  };

  const fabStyles = {
        position: 'absolute',
        right: 15,
        bottom: 15,
  };

  return <View style={{flex: 1, alignItems: 'stretch'}}>
           <View style={{flex: 1, flexDirection: 'center', alignItems: 'center'}}>
             <FlatList data={states.elements} renderItem={({item}) => <EditField element={item} onDelete={deleteElement} onEdit={editElement} />} />
           </View>
           <AddNewElementFab onAdd={addElement} />
         </View>;
}


export default Editor;
