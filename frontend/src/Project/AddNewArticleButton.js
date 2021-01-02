import React from "react";
import { Button } from '@material-ui/core';
import { View } from 'react-native';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const AddNewArticleButton = (props) => {
  const [states, setStates] = React.useState({
          open: false,
          name: null,
          enableCreateButton: false,
  });

  const handleClickOpen = () => {
    setStates({
          open: true,
          name: null,
          enableCreateButton: false,
    });
  };

  const handleClose = () => {
    setStates({
          open: false,
          name: null,
          enableCreateButton: false,
    });
  };
  
  const fabStyles = {
        position: 'absolute',
        right: 15,
        bottom: 15,
  };

  const nameChanged = (event) => {
    const currentName = event.target.value;

    let nameToSet = null;
    let enableButton = false;
    if (currentName && 0 < currentName.length) {
      nameToSet = currentName;
      enableButton = true;
    }

    setStates({
          open: states.open,
          name: nameToSet,
          enableCreateButton: enableButton,
    });
  };

  const createNewArticle = () => {
    props.onAddArticle(states.name);
    handleClose();
  };

  const createNewElementOnEnter = (event) => {
    if (event.key === 'Enter') {
      createNewArticle();
    }
  };

  return (
        <View style={{flex: 1, flexDirection: 'center', alignItems: 'center'}}>
          <Fab onClick={handleClickOpen} style={fabStyles} color="primary" aria-label="add">
            <AddIcon />
          </Fab>
          <Dialog
            open={states.open}
            onClose={handleClose}
          >
            <DialogTitle>{"Add a new item"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter the name of the new article
                <TextField
                  margin="dense"
                  label="Name"
                  onChange={nameChanged}
                  fullWidth
                  autoFocus
                  onKeyPress={createNewElementOnEnter}
                />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Abort
              </Button>
	            <Button onClick={createNewArticle} disabled={!states.enableCreateButton} color="primary">
                Create new Article
              </Button>
            </DialogActions>
          </Dialog>
        </View>
  );
};

export default AddNewArticleButton;
