import React, { Fragment } from "react";
import {
    Box,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
} from "@mui/material";

const AddTaskForm = ({
    state,
    subTaskState,
    handleChange,
    handleSubTaskChange,
    handleSubmit,
    handleCheckbox,
    handleSubTaskClick
}) => {

    const { taskName, subTask, taskDetail } = state || {};
    const { subTaskName, subTaskDetail } = subTaskState || {};


    return (
        <Box style={{marginTop: "10px"}}>
            <TextField
                label="Task Name"
                variant="outlined"
                fullWidth
                required
                name="taskName"
                value={taskName}
                onChange={handleChange}
            />
            <br />
            <TextField
                label="Task Details"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                name="taskDetail"
                value={taskDetail}
                onChange={handleChange}
            />
            <br />
            <FormControlLabel
                control={
                    <Checkbox checked={subTask} name="subTask" onChange={(e) => handleCheckbox(e)} />
                }
                label="Subtask"
                disabled = {!taskName  || !taskDetail }
            />
            {
                subTask && (
                    <Fragment>
                        <TextField
                            label="Sub Task Name"
                            variant="outlined"
                            fullWidth
                            required
                            name="subTaskName"
                            value={subTaskName}
                            onChange={handleSubTaskChange}
                        />
                        <br />
                        <TextField
                            label="Sub Task Details"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            name="subTaskDetail"
                            value={subTaskDetail}
                            onChange={handleSubTaskChange}
                        />
                        <Button variant="contained" size="small" style={{float: 'right'}} type="submit"  onClick={handleSubTaskClick}>
                            Add sub Task
                        </Button>
                    </Fragment>

                )
            }
            <br />
            <Button variant="contained" type="submit" size="small" onClick={handleSubmit}>
                Create Task
            </Button>
        </Box>
    );
};

export default AddTaskForm;