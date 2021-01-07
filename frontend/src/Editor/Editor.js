
import React from 'react';
import { View, FlatList } from 'react-native';
import TextField from '@material-ui/core/TextField';

import ConfirmAndDeleteButton from './ConfirmAndDeleteButton.js';
import EditButton from './EditButton.js';
import AddNewElementFab from './AddNewElementFab.js';


const EditField = (props) => {
  return ( <View style={{flex: 1, flexDirection: 'row'}}>
           <TextField label={props.element.name} value={props.element.value} InputProps={{readOnly: true}} />
           <EditButton element={props.element} onEdit={props.onEdit} />
           <ConfirmAndDeleteButton element={props.element} onDelete={props.onDelete} />
         </View>);
}



function Editor(props) {
  const [article, setArticle] = React.useState({elements: [] });

  React.useEffect(() => {
    getArticleFromBackend()
  },[]);


  const getArticleFromBackend = (callback) => {
    const request = new Request('http://127.0.0.1:8000/project/' + props.projectId +
                                '/article/' + props.articleId)
    fetch(request)
          .then(res => res.json())
          .then(data=> {
            setArticle(data)
            if(callback) { callback(data) }
          })
          .catch(error => console.error(error));
  };

  const addElement = () => {
    const newElement = {
      name: "Test-Name",
      value: "Test-Value",
    };
    const dataToSend = JSON.stringify(newElement);
    const request = new Request('http://127.0.0.1:8000/project/' + props.projectId +
                                '/article/' + props.articleId + '/element',
            {method: 'POST', body: dataToSend});
    fetch(request)
          .then(res => res.json())
          .then(data=> {
                  getArticleFromBackend((newArticle) => {

                    let newArticleData = Object.assign({}, newArticle);
                    const indexOfNewElement = newArticle.elements.findIndex(obj => { return obj.id === data.id });
                    newArticleData.elements[indexOfNewElement].editorOpen=true;
                    setArticle(newArticleData);
                  })
          })
          .catch(error => console.error(error));
  };

  const deleteElement = (element) => {
    const request = new Request('http://127.0.0.1:8000/project/' + props.projectId +
                                '/article/' + props.articleId + '/element/' + element.id,
            {method: 'DELETE'});
    fetch(request)
          .then(res => res.json())
          .then(data=> getArticleFromBackend())
          .catch(error => console.error(error));
  };

  const editElement = (element) => {
    const dataToSend = JSON.stringify(element);
    const request = new Request('http://127.0.0.1:8000/project/' + props.projectId +
                                '/article/' + props.articleId + '/element/' + element.id,
            {method: 'PATCH', body: dataToSend});
    fetch(request)
          .then(res => res.json())
          .then(data=> {
                  getArticleFromBackend();
          })
          .catch(error => console.error(error));
  };

  return <View style={{flex: 1, alignItems: 'stretch'}}>
           <View style={{flex: 1, flexDirection: 'center', alignItems: 'center'}}>
             <FlatList data={article.elements} extraData={article} renderItem={({item}) => <EditField element={item} onDelete={() => deleteElement(item)} onEdit={editElement} />} />
           </View>
           <AddNewElementFab onAdd={addElement} />
         </View>;
}


export default Editor;
