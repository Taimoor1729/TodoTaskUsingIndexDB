import React, { Fragment } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import AddTaskDialog from '../AddTask';

export default function Header({
  state,
  subTaskState,
  handleChange,
  handleSubTaskChange,
  handleSubmit,
  handleCheckbox,
  handleSubTaskClick,
  addtaskModalOpen,
  handleTaskModalClose,
  handleTaskModalOpen
}) {

  return (
    <Fragment>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Task Management
            </Typography>
            <Button color="inherit" onClick={handleTaskModalOpen}>Add Task</Button>
          </Toolbar>
        </AppBar>
      </Box>
      {
        addtaskModalOpen && (
          <AddTaskDialog
            open={addtaskModalOpen}
            handleClose={handleTaskModalClose}
            state={state}
            subTaskState={subTaskState}
            handleChange={handleChange}
            handleSubTaskChange={handleSubTaskChange}
            handleSubmit={handleSubmit}
            handleCheckbox={handleCheckbox}
            handleSubTaskClick={handleSubTaskClick}
          />
        )
      }
    </Fragment>
  );
}