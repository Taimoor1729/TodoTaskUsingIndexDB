import "./App.css";
import { Fragment, useEffect, useState } from "react";

import Header from "./components/Header";
import Tasks from "./components/Tasks";

const idb =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

const insertDataInIndexedDb = () => {
  if (!idb) {
    return;
  }

  const request = idb.open("task-management", 1);

  request.onerror = function (event) {
    console.error("An error occurred with IndexedDB");
    console.error(event);
  };

  request.onupgradeneeded = function (event) {
    const db = request.result;

    if (!db.objectStoreNames.contains("taskList")) {
      db.createObjectStore("taskList", { keyPath: "id" });
    }
  };

  request.onsuccess = function () {

    const db = request.result;

    var tx = db.transaction("taskList", "readwrite");
    // var taskList = tx.objectStore("taskList");

    return tx.complete;
  };
};

const App = () => {

  const [allTasks, setAllTasks] = useState([]);
  const [selectedTaskIndex, setSelectedtaskIndex] = useState(null);
  const [addtaskModalOpen, setAddTaskModalOpen] = useState(false);

  const [state, setState] = useState({
    taskName: "",
    taskDetail: "",
    subTask: false,
    subTaskArray: []
  })

  const [subTaskState, setSubTaskState] = useState({
    subTaskName: "",
    subTaskDetail: "",
  })


  const {
    taskName,
    taskDetail,
    subTask,
    subTaskArray
  } = state;

  const handleTaskModalOpen = () => {
    setAddTaskModalOpen(true);
  }

  const handleTaskModalClose = () => {
    setAddTaskModalOpen(false);
  }


  const handleChange = (event) => {
    const value = event.target.value;
    setState({
      ...state,
      [event.target.name]: value
    })
  }

  const handleSubTaskChange = (event) => {
    const value = event.target.value;
    setSubTaskState({
      ...subTaskState,
      [event.target.name]: value
    })
  }

  const handleSubTaskClick = (event) => {
    event.preventDefault();
    setState({
      ...state,
      subTaskArray: [...state.subTaskArray, subTaskState]
    });

    setSubTaskState({
      subTaskName: "",
      subTaskDetail: "",
    })
  }

  const handleCheckbox = (event) => {
    setState({ ...state, subTask: event.target.checked })
  }

  const getAllData = () => {
    const dbPromise = idb.open("task-management", 1);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;

      var tx = db.transaction("taskList", "readonly");
      var taskList = tx.objectStore("taskList");
      const users = taskList.getAll();

      users.onsuccess = (query) => {
        setAllTasks(query.srcElement.result);
      };

      tx.oncomplete = function () {
        db.close();
      };
    };
  };


  const handleSubmit = (event) => {
    const dbPromise = idb.open("task-management", 1);

    if (taskName && taskDetail) {
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;

        var tx = db.transaction("taskList", "readwrite");
        var taskList = tx.objectStore("taskList");

        const users = taskList.put({
          id: allTasks?.length + 1,
          taskName,
          taskDetail,
          subTask,
          subTaskArray
        });

        users.onsuccess = (query) => {
          tx.oncomplete = function () {
            db.close();
          };
          handleTaskModalClose()
          alert("Task added!");
          setState({
            ...state,
            taskName: null,
            taskDetail: null
          })
          // setAddUser(false);
          getAllData();
          event.preventDefault();
        };
      };
    } else {
      alert("Please enter all details");
    }

  }

  const handleSubmitUpdate = (event ) => {
    const dbPromise = idb.open("task-management", 1);

    if (event?.taskName || event?.taskDetail) {
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;
        var tx = db.transaction("taskList", "readwrite");
        var taskList = tx.objectStore("taskList");

  //       if (addUser) {
  //         const users = taskList.put({
  //           id: allTasks?.length + 1,
  //           taskName,
  //           taskDetail,
  //           subTask,
  //           subTaskArray
  //         });

  //         users.onsuccess = (query) => {
  //           tx.oncomplete = function () {
  //             db.close();
  //           };
  //           alert("Task added!");
  //           setState({
  //             ...state,
  //             taskName: null,
  //             taskDetail: null
  //           })
  //           setAddUser(false);
  //           getAllData();
  //           event.preventDefault();
  //         };
  //       } else {

          const users = taskList.put({
            id: event?.id,
            taskName: event?.taskName,
            taskDetail: event?.taskDetail,
            subTaskArray: [...event?.subTaskArray]
          });

          users.onsuccess = (query) => {
            tx.oncomplete = function () {
              db.close();
            };
            alert("Task updated!");
            setState({
              ...state,
              taskName: null,
              taskDetail: null
            })
            // setEditUser(false);
            getAllData();
            // setSelectedUser({});
            // event.preventDefault();
          };
        }
  //     };
    } 
  else {
      alert("Please enter all details");
    }
  };

  const deleteSelected = (task) => {
    const dbPromise = idb.open("task-management", 1);

    dbPromise.onsuccess = function () {
      const db = dbPromise.result;
      var tx = db.transaction("taskList", "readwrite");
      var taskList = tx.objectStore("taskList");
      const deleteTask = taskList.delete(task.id);

      deleteTask.onsuccess = (query) => {
        tx.oncomplete = function () {
          db.close();
        };
        alert("Task deleted!");
        getAllData();
      };
    };
  };


  //  Drag & Drop line items start
  const handleDragStart = (index, task) => {
    // e.dataTransfer.setData("text/plain", index);
    setSelectedtaskIndex(index);

  };

  const handleDragOver = (event) => {
    event.preventDefault();
    const element = event.target.closest('div');
    element.classList.add("highlight");
  }

  const handleDragLeave = (event) => {
    event.preventDefault();
    const element = event.target.closest('div');
    if (element) {
      element.classList.remove("highlight");
    }
  }

  const handleDrop = (e, task, index) => {
    e.preventDefault();
    const element = e.target.closest('div');
    element?.classList?.remove("highlight");
    const copyList = [...allTasks];

    if (
      selectedTaskIndex < 0 ||
      selectedTaskIndex >= copyList.length ||
      index < 0 ||
      index >= copyList.length ||
      selectedTaskIndex === index
    ) {
      return;
    }

    const temp = copyList[selectedTaskIndex];
    copyList[selectedTaskIndex] = copyList[index];
    copyList[index] = temp;

    setAllTasks(copyList);
    
  }


  useEffect(() => {
    insertDataInIndexedDb();
    getAllData();
  }, []);

  return (
    <Fragment>
      <Header
        addtaskModalOpen={addtaskModalOpen}
        state={state}
        subTaskState={subTaskState}
        handleChange={handleChange}
        handleSubTaskChange={handleSubTaskChange}
        handleSubmit={handleSubmit}
        handleCheckbox={handleCheckbox}
        handleSubTaskClick={handleSubTaskClick}
        handleTaskModalOpen={handleTaskModalOpen}
        handleTaskModalClose={handleTaskModalClose}

      />
      <Tasks
        taskList={allTasks}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
        deleteSelected={deleteSelected}
        handleSubmitUpdate={handleSubmitUpdate}
      />
    </Fragment>
  );
};

export default App;
