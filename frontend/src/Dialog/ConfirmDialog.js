import React from 'react';

import { Button } from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const ConfirmDialog = (props) => {
  const [open, setOpen] = React.useState(props.open);

  const handleApprove = () => {
    props.onConfirm();
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    if(props.onClose) {
      props.onClose()
    }
  };

  React.useEffect(() => {
    setOpen(props.open)
  },[props.open]);

  return (
        <Dialog
          open={open}
          onClose={handleClose}
        >
          <DialogTitle>{props.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {props.content}
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

export default ConfirmDialog;
