// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));
let tasks = [];

// Todo: create a function to generate a unique task id
function generateTaskId() {
  nextId++
  localStorage.setItem("nextId", JSON.stringify(nextId));
  return nextId;
}
function readProjectsFromStorage() {
  // ? Retrieve projects from localStorage and parse the JSON to an array.
  // ? We use `let` here because there is a chance that there are no projects in localStorage (which means the projects variable will be equal to `null`) and we will need it to be initialized to an empty array.
tasks = JSON.parse(localStorage.getItem('tasks'));

  // ? If no projects were retrieved from localStorage, assign projects to a new empty array to push to later.
  if (!tasks) {
    tasks = [];
  }

  // ? Return the projects array either empty or with data in it whichever it was determined to be by the logic right above.
  return tasks;
}

// ? Accepts an array of projects, stringifys them, and saves them in localStorage.
function saveProjectsToStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
// Todo: create a function to create a task card
function createTaskCard(task) {

  const taskCard = $('<div>')
    .addClass('card task-card draggable my-3')
    .attr('data-task-id', task.id);
  const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
  const cardBody = $('<div>').addClass('card-body');
  const cardDescription = $('<p>').addClass('card-text').text(task.description);
  const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
  const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);
  cardDeleteBtn.on('click', handleDeleteTask);

  // ? Sets the card background color based on due date. Only apply the styles if the dueDate exists and the status is not done.
  if (task.dueDate && task.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

    // ? If the task is due today, make the card yellow. If it is overdue, make it red.
    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }
  }

  // ? Gather all the elements created above and append them to the correct elements.
  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  // ? Return the card so it can be appended to the correct lane.
  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  const tasks = readProjectsFromStorage();

  // ? Empty existing project cards out of the lanes
  const todoList = $('#todo-cards');
  todoList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  // ? Loop through projects and create project cards for each status
  for (let task of tasks) {
    if (task.status === 'to-do') {
      todoList.append(createTaskCard(task));
    } else if (task.status === 'in-progress') {
      inProgressList.append(createTaskCard(task));
    } else if (task.status === 'done') {
      doneList.append(createTaskCard(task));
    }
  }
  // ? Use JQuery UI to make task cards draggable
  $('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,
    // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
    helper: function (e) {
      // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
      const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');
      // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  let taskTitle = document.getElementById("taskTitle");
  let taskDue = document.getElementById("taskDueDate");
  let taskDes = document.getElementById("taskDescription");
  console.log(taskTitle.value);
  console.log(taskDue.value);
  console.log(taskDes.value);

  let newTask = {
    id: generateTaskId(),
    title: taskTitle.value,
    description: taskDes.value,
    dueDate: taskDue.value,
    status: "to-do"
  }

  taskList.push(newTask)
console.log(taskList)
  localStorage.setItem("tasks", JSON.stringify(taskList))

  $('#formModal').modal('toggle')

  renderTaskList();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(id) {
  const taskId = $(this).attr('data-task-id');

  tasks = tasks.filter((task)=>task.id != taskId)
  saveProjectsToStorage(tasks);
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

  const taskId = ui.draggable[0].dataset.taskId;
console.log(taskId);
console.log(typeof taskId);

  const newStatus = event.target.id;

  for (let task of tasks) {

    if (task.id == taskId) {
      task.status = newStatus;
    }
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTaskList();

}

// Todo: when the page loads, render the task list, add event listeners, 
// make lanes droppable, and make the due date field a date picker

$(document).ready(function () {
  renderTaskList();
  let addTaskButton = document.getElementById("next");

  $("[name='task-due-date']").datepicker();
  $("[name='task-due-date']").attr("type", "text");

  $(".lane").droppable({
    accept: '.draggable',
    drop: handleDrop
  });

  addTaskButton.addEventListener("click", handleAddTask)

});
