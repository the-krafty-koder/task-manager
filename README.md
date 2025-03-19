# Task Manager App

This is a task manager that allows users to add, edit and delete various tasks

## Running the app

- Clone the repo at https://github.com/the-krafty-koder/task-manager
- Once cloned, navigate to the project folder using a terminal and run
  > cd task-manager
  > npm install
- Once all dependencies are installed, run the following command to
  launch the app:
  > npm run dev
- Navigate to http://localhost:5173 on your browser to use the app

## Time taken

- It took me around 4-5 hours to implement core functionality including
  the bonus points. The little additional time was spent on refactoring and styling

## Implementation

- The app is composed of three main parts:

  - Task: represents the actual task
  - Stage: represents the three main stages (Pending, Progress, Complete)
  - Board: represents the container in which all stages are found

- A board acts as the container for all stages. Once tasks are retrieved
  from the redux store, either on mounting after change in state, the board filters and passes the corresponding tasks to each stage for display. Each stage loops through the tasks and renders them individually. Every task has a menu button attached to it responsible for viewing, editing and deleting the said task via modals.

- Redux toolkit was used to create a central store with functionality
  for adding, editing, deleting, setting, changing stage and reordering tasks in the store.

## Bonus points are covered in the implementation

- All bonus points were implemented

  1. Drag and drop between stages
     The library react-dnd was used to implement drag and drop. The whole board served as the drag and drop area, with a stage acting as the drop zone and a task acting as the draggable item. Whenever a stage noted a drop happen, a changeTaskStage method would be dispatched onto the store to update a task's new stage.

  2. Reordering
     During rendering, a stage takes note of each task's index as part of the tasks passed to it. The Stage passes an additional callback function (moveTask function) to a Task containing a dispatch to the store to reorder tasks based on the tracked index. Now whenever a task is being dragged, its index and the index of the task it is hovering over is monitored. If the indices are different, the moveTask callback function is called, updating the store with the new ordering and thereby 'dropping' the new task

  3. Persisting data
     On initial loading, the store loads data from localStorage using localStorage.getItem and whenever any changes are made to the store, a resulting change is made on localStorage to ensure consistency.

  4. Syncing tabs
     An event listener is added to the storage event so that whenever the localStorage is updated with new tasks in one tab, a dispatch is initiated, updating the store with tasks saved to local storage, and thereby updating other open tabs - which obtain data from the store

## Deployment

- The app is hosted on digital ocean.
- It is live at => https://stingray-app-dj8vv.ondigitalocean.app/
