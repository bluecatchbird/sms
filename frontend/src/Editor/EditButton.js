import React from 'react';

import { View } from 'react-native';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import EditIcon from '@material-ui/icons/Edit';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const EditButton = (props) => {
  let editorOpen = false;
  if ( props.element.editorOpen ) {
    editorOpen = true;
  };

  const [states, setStates] = React.useState({
          open: editorOpen,
          name: props.element.name,
          value: props.element.value,
  });

  const handleClickOpen = () => {
    setStates({
            open: true,
            name: states.name,
            value: states.value,
    });
  };

  const handleClose = () => {
    setStates({
            open: false,
            name: states.name,
            value: states.value,
    });
  };
  
  const handleApprove = () => {
    const returnedElement = {
            id: props.element.id,
            name: states.name,
            value: states.value,
    };
    props.onEdit(returnedElement);
    handleClose();
  };

  const valueChanged = (event) => {
    setStates({
            open: states.open,
            name: states.name,
            value: event.target.value,
    });
  };

  const nameChanged = (event) => {
    setStates({
            open: states.open,
            name: event.target.value,
            value: states.value,
    });
  };

  return (
      <View>
        <Button onClick={handleClickOpen}>
          <EditIcon />
        </Button>
        <Dialog
          open={states.open}
          onClose={handleClose}
        >
          <DialogTitle>{"Update Item"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please make your changes.
            </DialogContentText>
            <TextField
              margin="dense"
              label="Name"
              defaultValue={props.element.name}
              onChange={nameChanged}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Value"
              defaultValue={props.element.value}
              onChange={valueChanged}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Abort
            </Button>
            <Button onClick={handleApprove} color="primary" autoFocus>
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </View>
  );
};

export default EditButton;


