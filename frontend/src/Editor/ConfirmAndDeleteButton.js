import React from 'react';

import { View } from 'react-native';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import DeleteIcon from '@material-ui/icons/Delete';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const ConfirmAndDeleteButton = (props) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleApprove = () => {
    props.onDelete(props.element);
    handleClose();
  };

  return (
      <View>
        <Button onClick={handleClickOpen}>
          <DeleteIcon />
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
        >
          <DialogTitle>{"Delete Item"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Do you want to delete this item?
            </DialogContentText>
            <TextField
              margin="dense"
              label={props.element.name}
              defaultValue={props.element.value}
              fullWidth
              InputProps={{readOnly: true}}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Abort
            </Button>
            <Button onClick={handleApprove} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </View>
  );
};

export default ConfirmAndDeleteButton;
