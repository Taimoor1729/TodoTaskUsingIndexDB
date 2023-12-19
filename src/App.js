import React, { Component, Fragment } from 'react';
import "./App.css";

import Header from "./components/Header";
import Tasks from "./components/Tasks";

const idb =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allTasks: [],
      selectedTaskIndex: null,
      addtaskModalOpen: false,
      state: {
        taskName: "",
        taskDetail: "",
        subTask: false,
        subTaskArray: []
      },
      subTaskState: {
        subTaskName: "",
        subTaskDetail: "",
      }
    };
  }

  insertDataInIndexedDb = () => {
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

  handleTaskModalOpen = () => {
    this.setState({ addtaskModalOpen: true });
  };

  handleTaskModalClose = () => {
    this.setState({ addtaskModalOpen: false });
  };

  handleChange = (event) => {
    const value = event.target.value;
    this.setState((prevState) => ({
      state: {
        ...prevState.state,
        [event.target.name]: value
      }
    }));
  };

  handleSubTaskChange = (event) => {
    const value = event.target.value;
    this.setState((prevState) => ({
      subTaskState: {
        ...prevState.subTaskState,
        [event.target.name]: value
      }
    }));
  };

  handleSubTaskClick = (event) => {
    event.preventDefault();
    this.setState((prevState) => ({
      state: {
        ...prevState.state,
        subTaskArray: [...prevState.state.subTaskArray, prevState.subTaskState]
      },
      subTaskState: {
        subTaskName: "",
        subTaskDetail: "",
      }
    }));
  };

  handleCheckbox = (event) => {
    this.setState((prevState) => ({
      state: { ...prevState.state, subTask: event.target.checked }
    }));
  };

  getAllData = () => {
    const dbPromise = idb.open("task-management", 1);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;

      var tx = db.transaction("taskList", "readonly");
      var taskList = tx.objectStore("taskList");
      const users = taskList.getAll();

      users.onsuccess = (query) => {
        this.setState({
           allTasks: query.srcElement.result
        });
      };

      tx.oncomplete = function () {
        db.close();
      };
    };
  };

  handleSubmit = (event) => {
    const{allTasks, state} = this.state;
    const {taskName, taskDetail, subTask, subTaskArray } = state;

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
          this.handleTaskModalClose()
          alert("Task added!");
          this.setState({
            ...state,
            taskName: null,
            taskDetail: null
          })
          // setAddUser(false);
          this.getAllData();
          event.preventDefault();
        };
      };
    } else {
      alert("Please enter all details");
    }
  };

  handleSubmitUpdate = (event) => {
    const dbPromise = idb.open("task-management", 1);

    if (event?.taskName || event?.taskDetail) {
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;
        var tx = db.transaction("taskList", "readwrite");
        var taskList = tx.objectStore("taskList");
        const users = taskList.put({
            id: event?.id,
            taskName: event?.taskName,
            taskDetail: event?.taskDetail,
            subTaskArray: event?.subTaskArray
          });

          users.onsuccess = (query) => {
            tx.oncomplete = function () {
              db.close();
            };
            alert("Task updated!");
            this.setState({
              ...this.state,
              taskName: null,
              taskDetail: null
            })
            // setEditUser(false);
            this.getAllData();
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

  deleteSelected = (task) => {
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
        this.getAllData();
      };
    };
  };

  handleDragStart = (index, task) => {
    this.setState({ selectedTaskIndex: index });
  };

  handleDragOver = (event) => {
    event.preventDefault();
    const element = event.target.closest('div');
    element.classList.add("highlight");
  };

  handleDragLeave = (event) => {
    event.preventDefault();
    const element = event.target.closest('div');
    if (element) {
      element.classList.remove("highlight");
    }
  };

  handleDrop = (e, task, index) => {
    e.preventDefault();
    const element = e.target.closest('div');
    element?.classList?.remove("highlight");
    const copyList = [...this.state.allTasks];

    if (
      this.state.selectedTaskIndex < 0 ||
      this.state.selectedTaskIndex >= copyList.length ||
      index < 0 ||
      index >= copyList.length ||
      this.state.selectedTaskIndex === index
    ) {
      return;
    }

    const temp = copyList[this.state.selectedTaskIndex];
    copyList[this.state.selectedTaskIndex] = copyList[index];
    copyList[index] = temp;

    this.setState({ allTasks: copyList });
  };

  componentDidMount() {
    this.insertDataInIndexedDb();
    this.getAllData();
  }

  render() {
    return (
      <Fragment>
        <Header
          addtaskModalOpen={this.state.addtaskModalOpen}
          state={this.state.state}
          subTaskState={this.state.subTaskState}
          handleChange={this.handleChange}
          handleSubTaskChange={this.handleSubTaskChange}
          handleSubmit={this.handleSubmit}
          handleCheckbox={this.handleCheckbox}
          handleSubTaskClick={this.handleSubTaskClick}
          handleTaskModalOpen={this.handleTaskModalOpen}
          handleTaskModalClose={this.handleTaskModalClose}
        />
        <Tasks
          taskList={this.state.allTasks}
          handleDragStart={this.handleDragStart}
          handleDragOver={this.handleDragOver}
          handleDragLeave={this.handleDragLeave}
          handleDrop={this.handleDrop}
          deleteSelected={this.deleteSelected}
          handleSubmitUpdate={this.handleSubmitUpdate}
        />
      </Fragment>
    );
  }
}

export default App;
