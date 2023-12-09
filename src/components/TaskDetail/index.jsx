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
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

export default function TaskDetail({
    task,
    open,
    handleClose,
}) {
    const [editMode, setEditMode] = useState(false);

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

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
                            value={task.taskName}
                            fullWidth
                            onChange={(e) => console.log(e.target.value)} // Add your onChange logic here
                            margin="normal"
                        />
                    ) : (
                        <TextField
                        label="Task Name"
                        value={task.taskName}
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
                            value={task.taskDetail}
                            fullWidth
                            multiline
                            onChange={(e) => console.log(e.target.value)} // Add your onChange logic here
                            margin="normal"
                        />
                    ) : (
                        <TextField
                        label="Task Name"
                        value={task.taskDetail}
                        fullWidth
                        InputProps={{
                            readOnly: true,
                        }}
                        margin="normal"
                    />
                    )}

                    {task.subTaskArray && task.subTaskArray.length > 0 && (
                        <div style={{ marginTop: '16px' }}>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell><strong>Sub Task Name</strong></TableCell>
                                        <TableCell><strong>Sub Task Detail</strong></TableCell>
                                    </TableRow>
                                    {task.subTaskArray.map((subtsk) => (
                                        <TableRow key={subtsk.subTaskName}>
                                            <TableCell>{editMode ? (
                                                <TextField
                                                    value={subtsk.subTaskName}
                                                    fullWidth
                                                    onChange={(e) => console.log(e.target.value)} // Add your onChange logic here
                                                />
                                            ) : (
                                                subtsk.subTaskName
                                            )}</TableCell>
                                            <TableCell>{editMode ? (
                                                <TextField
                                                    value={subtsk.subTaskDetail}
                                                    fullWidth
                                                    onChange={(e) => console.log(e.target.value)} // Add your onChange logic here
                                                />
                                            ) : (
                                                subtsk.subTaskDetail
                                            )}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditToggle}>
                        {editMode ? 'Save' : 'Edit'}
                    </Button>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}
