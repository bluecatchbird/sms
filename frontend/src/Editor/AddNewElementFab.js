import React from 'react';

import { View } from 'react-native';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { Button } from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Grid from '@material-ui/core/Grid';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import TimerIcon from '@material-ui/icons/Timer';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';


const AddNewElementFab = (props) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const fabStyles = {
        position: 'absolute',
        right: 15,
        bottom: 15,
  };

  const handleAddText = () => {
    props.onAdd();
    handleClose();
  };

  const choices = [
    {
      event: handleAddText,
      startIcon: <TextFieldsIcon />,
      text: "Text",
    },
    {
      event: null,
      startIcon: <AllInclusiveIcon />,
      text: "Nummer(not implemented yet)",
    },
    {
      event: null,
      startIcon: <TimerIcon />,
      text: "Date(not implemented yet)",
    },
    {
      event: null,
      startIcon: <PhotoLibraryIcon />,
      text: "Images(not implemented yet)",
    },
  ];

  return (
      <View>
        <Fab onClick={handleClickOpen} style={fabStyles} color="primary" aria-label="add">
          <AddIcon />
        </Fab>
        <Dialog
          open={open}
          onClose={handleClose}
        >
          <DialogTitle>{"Add a new item"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please select the type of item you want to add
            </DialogContentText>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Grid container spacing={2}>
                  {choices.map((value, index) => (
                    <Grid key={index} item xs={12}>
                      <Button
                        style={{backgroundColor: "LightGray", justifyContent: "flex-start"}}
                        fullWidth
                        onClick={value.event}
                        startIcon={value.startIcon}
                      >
                      {value.text}
                      </Button>
                    </Grid>
                  ))}
              </Grid>
            </View>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Abort
            </Button>
          </DialogActions>
        </Dialog>
      </View>
  );
};


export default AddNewElementFab;
