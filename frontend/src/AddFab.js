import React from "react";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const AddFab = (props) => {

  const fabStyles = {
        position: 'absolute',
        right: 15,
        bottom: 15,
  };

  return (
          <Fab onClick={props.onClick} style={fabStyles} color="primary" aria-label="add">
            <AddIcon />
          </Fab>
  )
}

export default AddFab;
