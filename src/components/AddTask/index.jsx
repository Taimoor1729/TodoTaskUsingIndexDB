import React, { Fragment } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddTaskForm from '../AddTaskForm';

export default function AddTaskDialog({
    open,
    handleClose,
    state,
    subTaskState,
    handleChange,
    handleSubTaskChange,
    handleSubmit,
    handleCheckbox,
    handleSubTaskClick
}) {

    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >
                <DialogTitle id="alert-dialog-title" textAlign="center">
                    Add Task
                </DialogTitle>
                <DialogContent>
                    <AddTaskForm
                        state={state}
                        subTaskState={subTaskState}
                        handleChange={handleChange}
                        handleSubTaskChange={handleSubTaskChange}
                        handleSubmit={handleSubmit}
                        handleCheckbox={handleCheckbox}
                        handleSubTaskClick={handleSubTaskClick}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}
