import React, { Fragment, useState } from 'react';
import './style.css'
import TaskDetail from '../TaskDetail';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Tasks = ({
    taskList,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    deleteSelected,
    handleSubmitUpdate
}) => {

    const [detailmodalOpen, setDetailModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);


    const handleTaskDEtail = (task) => {
        setSelectedTask(task);
        setDetailModalOpen(true);
    }

    const handleModalClose = () => {
        setDetailModalOpen(false);
        setSelectedTask(null);
    }

    return (
        <Fragment>
            <div className="cards">
                {
                    taskList && Array.isArray(taskList) && taskList.length > 0 ?
                        taskList.map((task, index) => (
                            <div
                                key={index}
                                className="card"
                                draggable={true}
                                onDragStart={() => handleDragStart(index, task)}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, task, index)}
                                onClick={() => handleTaskDEtail(task)}

                            >
                                {/* <p onClick={(e) => {
                                     e.stopPropagation();
                                     deleteSelected(task)
                                }}> */}
                                   <DeleteForeverIcon onClick={(e) => {
                                     e.stopPropagation();
                                     deleteSelected(task)}}  /> 
                                {/* </p> */}
                                <h5>{task.taskName}</h5>
                                <p>{task.taskDetail}</p>

                            </div>
                        ))
                        : <div className="card">Click on Add task for adding the Task</div>
                }
            </div>
            {
                detailmodalOpen && (
                    <TaskDetail
                        open={detailmodalOpen}
                        task={selectedTask}
                        handleClose={handleModalClose} 
                        handleSubmitUpdate={handleSubmitUpdate}
                        />
                        
                )
            }
        </Fragment>
    )
}

export default Tasks