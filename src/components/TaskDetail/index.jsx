import React, { Fragment, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';

export default function TaskDetail({
    task,
    open,
    handleClose,
    handleSubmitUpdate
}) {
    const [editMode, setEditMode] = useState(false);
    const [taskName, setTaskName] = useState(task.taskName);
    const [taskDetail, setTaskDetail] = useState(task.taskDetail);
    const [subTaskArray, setSubTaskArray] = useState(task.subTaskArray || []);
    // const [subTaskName, setSubTaskName] = useState();
    // const [subTaskDetail, setSubTaskDetail] = useState("");

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    const handleTaskChange = (event) => {
        const { name, value } = event.target;
        if (name === "taskName") {
            setTaskName(value)
        }
        else if (name === "taskDetail") {
            setTaskDetail(value)
        }
    };

    const handleSubTaskChange = (index, field, value) => {
        // Check if the new value is not empty before updating the state
        if (value.trim() !== "") {
            const updatedSubTaskArray = [...subTaskArray];

            updatedSubTaskArray[index] = {
                ...updatedSubTaskArray[index],
                [field]: value,
            };

            setSubTaskArray(updatedSubTaskArray);
        }
    };

    const handleSave = (event, id) => {
        event.preventDefault();
        handleSubmitUpdate({
            id,
            taskName,
            taskDetail,
            subTaskArray,
        });
    }

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
                    {editMode ? (
                        <TextField
                            label="Task Name"
                            value={taskName}
                            name="taskName"
                            fullWidth
                            onChange={handleTaskChange}
                            margin="normal"
                        />
                    ) : (
                        <TextField
                            label="Task Name"
                            value={taskName}
                            fullWidth
                            InputProps={{
                                readOnly: true,
                            }}
                            margin="normal"
                        />
                    )}
                </DialogTitle>

                <DialogContent>
                    {editMode ? (
                        <TextField
                            label="Task Detail"
                            value={taskDetail}
                            name='taskDetail'
                            fullWidth
                            multiline
                            onChange={handleTaskChange}
                            margin="normal"
                        />
                    ) : (
                        <TextField
                            label="Task Name"
                            value={taskDetail}
                            fullWidth
                            InputProps={{
                                readOnly: true,
                            }}
                            margin="normal"
                        />
                    )}

                    {subTaskArray && subTaskArray.length > 0 && (
                        <div style={{ marginTop: '16px' }}>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell><strong>Sub Task Name</strong></TableCell>
                                        <TableCell><strong>Sub Task Detail</strong></TableCell>
                                    </TableRow>
                                    {subTaskArray.map((subtask, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <TextField
                                                    value={subtask.subTaskName}
                                                    name='subTaskName'
                                                    fullWidth
                                                    onChange={(e) => handleSubTaskChange(index, 'subTaskName', e.target.value)}
                                                    InputProps={{
                                                        readOnly: !editMode,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={subtask.subTaskDetail}
                                                    name='subTaskDetail'
                                                    fullWidth
                                                    onChange={(e) => handleSubTaskChange(index, 'subTaskDetail', e.target.value)}
                                                    InputProps={{
                                                        readOnly: !editMode,
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    {editMode ? (
                        <Button onClick={(e) => handleSave(e, task.id)} color="primary">
                            Save Changes
                        </Button>
                    ) : (<Button onClick={handleEditToggle}>
                        Edit
                    </Button>)}
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}
