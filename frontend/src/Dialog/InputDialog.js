import React from 'react';

import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const InputDialog = (props) => {
  const [open, setOpen] = React.useState(props.open);
  const [value, setValue] = React.useState(props.value);

  const handleApprove = () => {
    props.onConfirm(value);
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setValue(props.value);
    if(props.onClose) {
      props.onClose()
    }
  };

  React.useEffect(() => {
    setOpen(props.open)
  },[props.open]);

  const inputChanged = (event) => {
    const currentInput = event.target.value;
    setValue(currentInput);
  };

  return (
        <Dialog
          open={open}
          onClose={handleClose}
        >
          <DialogTitle>{props.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <DialogContentText>
                {props.content}
                <TextField
                  margin="dense"
                  label={props.inputName}
                  value={value}
                  onChange={inputChanged}
                  fullWidth
                  autoFocus
                />
              </DialogContentText>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              {props.abortLabel}
            </Button>
            <Button onClick={handleApprove} color="primary" autoFocus>
              {props.confirmLabel}
            </Button>
          </DialogActions>
        </Dialog>
  );
  
};

export default InputDialog;
