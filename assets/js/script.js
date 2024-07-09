// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    nextId++
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {

    let taskContainer = document.createElement("div");
    let titleEl = document.createElement("h3");
    let descriptionEl = document.createElement("p");
    let dueDateEl = document.createElement("p");

    titleEl.textContent = task.title;
    descriptionEl.textContent = task.description;
    dueDateEl.textContent = task.dueDate;

    taskContainer.appendChild(titleEl);
    taskContainer.appendChild(descriptionEl);
    taskContainer.appendChild(dueDateEl);
    taskContainer.className="taskCard"
    taskContainer.style.zIndex = "100";
    return taskContainer;

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

const projects = generateTaskId();

  const todoList = $('#to-do');
  todoList.empty();

  const inProgressList = $('#in-progress');
  inProgressList.empty();

  const doneList = $('#done');
  doneList.empty();
  
for (let index = 0; index < taskList.length; index++) {
    const task = taskList[index];
    let taskEl = createTaskCard(task);
    console.log(taskEl);
    document.getElementById("to-do").appendChild(taskEl);
}

$(".taskCard" ).draggable({ opacity: 0.7, helper: "clone"});

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
let taskTitle = document.getElementById("taskTitle");
let taskDue = document.getElementById("taskDueDate");
let taskDes = document.getElementById("taskDescription");
console.log(taskTitle.value);
console.log(taskDue.value);
console.log(taskDes.value);

let newTask ={
    id: generateTaskId(),
    title: taskTitle.value,
    description: taskDes.value,
    dueDate: taskDue.value,
}

taskList.push(newTask)

localStorage.setItem("tasks", JSON.stringify(taskList))

$('#formModal').modal('toggle')

renderTaskList();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const projectId = $(this).attr('data-project-id');
    const projects = generateTaskId();
  
    
    projects.forEach((project) => {
      if (project.id === taskId) {
        projects.splice(projects.indexOf(project), 1);
      }
    });
    saveProjectsToStorage(projects);
    printProjectData();

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

const projects = generateTaskId();


const taskId = ui.draggable[0].dataset.nextId;


const newStatus = event.target.id;

for (let project of projects) {
 
  if (project.id === taskId) {
    project.status = newStatus;
  }
}

localStorage.setItem('projects', JSON.stringify(projects));
printProjectData();

}

// Todo: when the page loads, render the task list, add event listeners, 
// make lanes droppable, and make the due date field a date picker

$(document).ready(function () {
    renderTaskList();
let addTaskButton= document.getElementById("next");

$( "[name='task-due-date']" ).datepicker();
$( "[name='task-due-date']" ).attr("type", "text");

$( ".lane" ).droppable({
    drop: handleDrop
  });

addTaskButton.addEventListener("click", handleAddTask)

});
