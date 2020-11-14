const checkBoxes = document.querySelectorAll('input[type="checkbox"]');
const inputText = document.querySelector('input[type="text"]');
const form = document.querySelector('form');
const ul = document.querySelector('ul');
const datesHeading = document.querySelector('header h1');
const taskHeading = document.querySelector('.todos h2');
const formErrorSpan = document.querySelector('form span');
const addSpanIcon = document.querySelector('header span i');
const setDates = () => {
  let now = new Date();

  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  let months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const day = days[now.getDay()];
  const month = months[now.getMonth()];
  datesHeading.textContent = `${day}, ${month}  ${now.getDate()}`;
};

const countTodos = () => {
  // length of list element (todos)
  const ulLength = ul.children.length;
  taskHeading.textContent = `${ulLength} ${ulLength === 1 ? 'task' : 'tasks'}`;
};

const addToLocalStorage = (value, time) => {
  const todos = localStorage.getItem('todos');
  if (!todos) {
    localStorage.setItem('todos', JSON.stringify([{ value, time }]));
  } else {
    const todosArr = JSON.parse(todos);
    const newTodos = [...todosArr, { value, time }];
    localStorage.setItem('todos', JSON.stringify(newTodos));
  }
};
const getTodosFromLocalStorage = () => {
  const todos = localStorage.getItem('todos');
  if (todos) {
    const todosArr = JSON.parse(todos);
    for (let i = 0; i < todosArr.length; i++) {
      addToUI(todosArr[i].value, todosArr[i].time);
    }
  }
};

const addTodos = () => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // <=== hidding error span ===>
    formErrorSpan.style.display = 'none';
    // <=== hidding error span ===>

    const value = inputText.value;
    if (value.trim() !== '') {
      const now = new Date();
      const timeOfCreation = now.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        seconds: 'numeric',
        hour12: true,
      });
      // <=== adding to localStorage ===>
      addToLocalStorage(value, timeOfCreation);

      addToUI(value, timeOfCreation);

      inputText.value = '';
    } else {
      formErrorSpan.style.display = 'block';
    }
  });
};
const addToUI = (value, timeOfCreation) => {
  // <==== creating all ELEMENTS ====>
  const list = document.createElement('LI');
  const labelContainer = document.createElement('LABEL');
  const inputCheckBox = document.createElement('INPUT');
  const parentDiv = document.createElement('DIV');
  const childrenDiv = document.createElement('DIV');
  const spanTodo = document.createElement('SPAN');
  const spanTime = document.createElement('SPAN');
  // <==== creating all ELEMENTS ====>

  //  adding all classes
  list.classList.add('animate');
  inputCheckBox.setAttribute('type', 'checkbox');
  inputCheckBox.classList.add('checkbox');
  inputCheckBox.classList.add('option-input');
  parentDiv.classList.add('todo-content');
  spanTodo.textContent = value;
  spanTime.textContent = `${timeOfCreation}`;
  childrenDiv.classList.add('underline');
  // adding all classes

  // appending to parent Elements
  labelContainer.appendChild(inputCheckBox);
  parentDiv.appendChild(childrenDiv);
  parentDiv.appendChild(spanTodo);
  parentDiv.appendChild(spanTime);
  list.appendChild(labelContainer);
  list.appendChild(parentDiv);
  // appending to parent Elements

  // appending to DOM
  ul.appendChild(list);
  // appending To DOM
  countTodos();
};

const doneTodo = () => {
  ul.addEventListener('click', (e) => {
    if (e.target.tagName === 'INPUT') {
      // DISABLES THE CLICK
      e.target.disabled = true;

      const divTodoContainer = e.target.parentElement.nextElementSibling;
      if (e.target.checked) {
        divTodoContainer.classList.add('done-todo');
        divTodoContainer.firstElementChild.classList.add('line-thought');
        setTimeout(() => {
          divTodoContainer.parentElement.classList.add('done');
          removeTodo();
        }, 500);
      } else {
        underline.classList.remove('done-todo');
        underline.firstElementChild.classList.remove('line-thought');
      }
    }
  });
};
const removeFromLocalStorage = (value, timeOfCreation) => {
  const todosArr = JSON.parse(localStorage.getItem('todos'));
  const todosIndex = todosArr.findIndex(
    (todo) => todo.value === value && todo.time === timeOfCreation
  );
  todosArr.splice(todosIndex, 1);
  localStorage.removeItem('todos');
  localStorage.setItem('todos', JSON.stringify(todosArr));
};
const removeTodo = () => {
  const list = ul.childNodes;
  setTimeout(() => {
    list.forEach((li) => {
      if (li.classList.contains('done')) {
        const value = document.querySelector(
          'li.done .todo-content span:nth-child(2) '
        );
        const timeOfCreation = li.lastChild.lastChild.textContent;
        removeFromLocalStorage(value.textContent, timeOfCreation);
        ul.removeChild(li);
        countTodos();
      }
    });
  }, 800);
};

const showHideForms = () => {
  // add event listenner to the parent element of the icon
  addSpanIcon.parentElement.addEventListener('click', () => {
    // check if forms are not showing
    if (addSpanIcon.classList.contains('fa-plus')) {
      addSpanIcon.setAttribute('class', ' fas fa-minus');
      form.style.display = 'block';
    } else {
      addSpanIcon.setAttribute('class', 'fas fa-plus');
      form.style.display = 'none';
    }
  });
};

const runApp = () => {
  setInterval(() => {
    setDates();
  }, 0);
  showHideForms();
  addTodos();
  getTodosFromLocalStorage();
  doneTodo();
};

runApp();
