
import React from 'react';
import { Linking, TouchableOpacity, View, FlatList, Text, Image } from 'react-native';
import TextField from '@material-ui/core/TextField';

import EditButton from './EditButton.js';
import AddNewElementFab from './AddNewElementFab.js';
import ConfirmDialog from '../Dialog/ConfirmDialog.js';

import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';

const EditField = (props) => {
  return ( <View style={{flex: 1, flexDirection: 'row'}}>
           <TextField label={props.element.name} value={props.element.value} InputProps={{readOnly: true}} />
           <EditButton element={props.element} onEdit={props.onEdit} />
           <Button onClick={() => props.onDelete(props.element)}>
             <DeleteIcon />
           </Button>
         </View>);
}



function Editor(props) {
  const [article, setArticle] = React.useState({elements: [], images: [], notes: "" });
  const [deleteState, setDeleteState] = React.useState({dialogOpen: false, itemToDelete: null});
  const [imageData, setImageData] = React.useState([]);

  React.useEffect(() => {
    if(article.id === undefined) {
    	getArticleFromBackend();
    }
  });


  const getArticleFromBackend = (callback) => {
    const request = new Request('http://127.0.0.1:8000/project/' + props.projectId +
                                '/article/' + props.articleId)
    fetch(request)
          .then(res => {
	    if(!res.ok) {
	      props.onGoToProject();
	    }
	    return res.json()
	  })
          .then(data=> {
	    if(data) {
              setArticle(data)
              props.onTitleChange(data.name);
              var imageList = data.images.map(x => "http://127.0.0.1:8000/project/" + props.projectId + "/article/" + props.articleId + "/image/" + x.id);
              setImageData(imageList);
              if(callback) { callback(data) }
	    }
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

  const newFileUpload = (data) => {
    let photo = document.getElementById("filePicker").files[0];
    let formData = new FormData();
    
    formData.append("image", photo);
    const url = 'http://127.0.0.1:8000/project/' + props.projectId +
                                '/article/' + props.articleId + '/image';
    fetch(url, {method: "POST", body: formData})
          .then(res => {
	    if(!res.ok) {
	      throw new Error('error posting image');
	    }
	    return res.json()
	  })
          .then(data=> {
            setArticle(data);
          })
          .catch(error => console.error(error));
  };

  const deleteImage = (imageId) => {
    const request = new Request('http://127.0.0.1:8000/project/' + props.projectId +
                                '/article/' + props.articleId + '/image/' + imageId,
            {method: 'DELETE'});
    fetch(request)
          .then(res => res.json())
          .then(data=> setArticle(data))
          .catch(error => console.error(error));
  };

  const updateNotes = (data) => {
    const dataToSend = JSON.stringify({text: data.target.value});
    const request = new Request('http://127.0.0.1:8000/project/' + props.projectId +
                                '/article/' + props.articleId + '/notes',
            {method: 'PATCH', body: dataToSend});
    fetch(request)
          .catch(error => console.error(error));
	  
  };

  return <View style={{flex: 1, alignItems: 'stretch'}}>
          <ConfirmDialog onConfirm={() => deleteElement(deleteState.itemToDelete)} onClose={() => setDeleteState({dialogOpen: false})} open={deleteState.dialogOpen}
                  title="Delete Element" content="Do you want to delete the element?" abortLabel="Abort" confirmLabel="Delete" />
           <View style={{flex: 1, flexDirection: 'center', alignItems: 'center'}}>
             <GridList cellHeight={160} cols={3} style={{width: "100%", height: '250'}}>
	         <GridListTile key="add image">
		 <Paper evelation={3} style={{height: '100%', flex: 1, justifyContent: 'center'}}>
		   <TouchableOpacity onPress={() => document.getElementById('filePicker').click()} style={{widht: "100%", height: "100%"}}>
		     <View style={{height: '100%', flex: 1, justifyContent: 'space-around', alignItems: 'center'}}>
		       <AddAPhotoIcon style={{fontSize: 60}} />
                       <Text>Add new Image</Text>
                       <input type="file" id="filePicker" accept=".jpg,.png,.jpeg" style={{display: "none"}} onChange={newFileUpload} />
                     </View>
                   </TouchableOpacity>
                 </Paper>
		 </GridListTile>
               {article.images.map(x => ({id: x.id,
		                          url:"http://127.0.0.1:8000/project/" + props.projectId + "/article/" + props.articleId + "/image/" + x.id}))
                 .map((imageData) => (
                 <GridListTile key={imageData.url}>
		   <TouchableOpacity onPress={() => Linking.openURL(imageData.url)} style={{width: "100%", height: "100%"}}>
                     <Image source={{uri: imageData.url}} style={{width: "100%", height: "100%"}}/>
                   </TouchableOpacity>
	           <Fab style={{overflow: 'visible', position: 'absolute', bottom: 10, right: 10}}>
                     <Button onClick={() => deleteImage(imageData.id)}>
                       <DeleteIcon />
		     </Button>
		   </Fab>
                 </GridListTile>
               ))}
             </GridList>
             <FlatList data={article.elements} extraData={article} renderItem={({item}) => <EditField element={item} onDelete={() => setDeleteState({dialogOpen: true, itemToDelete: item})} onEdit={editElement} />} />
	     <TextField
	       style={{width: '97%'}}
               label="Notes"
               multiline
               rows={(article.notes.match(/\n/g) || '').length + 1}
               defaultValue={article.notes}
               variant="outlined"
	       onChange={updateNotes}
             />
           </View>
           <AddNewElementFab onAdd={addElement} />
         </View>;
}


export default Editor;
