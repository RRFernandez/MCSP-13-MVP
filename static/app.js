//selectors
const $todoList = $("#todo-list");
const $todoBtn = $(".todo-button")
const $todoInput = $(".todo-input")
const $filterOption = $(".filter-todo")


//functions

const createTodo = (data) => {
    for (let i = 0; i < data.length; i++) {
        //todo div
        const $todoDiv = $('<div></div>').addClass("todo-div");
        //todo task
        const $newTask = $('<li></li>').addClass("task");
        $newTask.append(data[i].name)
        $todoDiv.append($newTask);
        //complete button on task
        const $completeBtn = $('<button></button>').html('<i class="fas fa-check"></i>');
        $completeBtn.addClass("complete-btn")
        $todoDiv.append($completeBtn);
        //trash button on task
        const $trashBtn = $('<button></button>').html('<i class="fas fa-trash"></i>');
        $trashBtn.addClass("trash-btn")
        $todoDiv.append($trashBtn);
        //append it to the list body
        $todoList.append($todoDiv);
        // $todoDiv.append(data[i].name)
        //clears input field
        $todoInput.val("");
    }
}


const setTodo = (data) => {
    const $todoDiv = $('<div></div>').addClass("todo-div");
    const $newTask = $('<li></li>').addClass("task");
    $todoDiv.append($newTask);
    const $completeBtn = $('<button></button>').html('<i class="fas fa-check"></i>');
    $completeBtn.addClass("complete-btn")
    $todoDiv.append($completeBtn);
    const $trashBtn = $('<button></button>').html('<i class="fas fa-trash"></i>');
    $trashBtn.addClass("trash-btn")
    $todoDiv.append($trashBtn);
    $todoDiv.append(data.name)
    $todoList.append($todoDiv);
    $todoInput.val("");
}

const addTodo = (event) => {
    event.preventDefault();
    const newTodo = {
        "name": $todoInput.val(),
        "list_id": 1
    }
    fetch("/todo", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTodo)
        })
        .then(res => res.json())
        .then(data => {
            setTodo(data)
        });
};

const getTodo = (event) => {

    fetch("/todo")
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            createTodo(data)
                // $todoList.on('click', deleteCheck)
        })

}


$todoList.on('click', (e) => {

    const item = e.target;
    const checkItem = e.target
    const name = item.innerHTML
    console.log(name)

    fetch(`/todo/${name}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then((data) => {
            // console.log(data)
        })

    if (checkItem.classList[0] === 'trash-btn') {
        const todo = checkItem.parentElement;
        // console.log(todo)
        todo.classList.add('fall');
        todo.addEventListener('transitioned', () => {
            todo.remove();
        })

    }

    if (checkItem.classList[0] === "complete-btn") {
        const todo = checkItem.parentElement;
        todo.classList.toggle('completed');
    }
})

function filterTodo(e) {
    const todos = $todoList.children();
    todos.each((todo) => {
        switch (e.target.value) {
            case "all":
                todo.show = "flex";
                break;
            case "completed":
                if (todo.hasClass("completed")) {
                    todo.show = "flex";
                } else {
                    todo.show = "none";
                }
                break;
            case "uncompleted":
                if (!todo.hasClass('completed')) {
                    todo.show = "flex";
                } else {
                    todo.show = "none";
                }
                break;
        }
    });
}

//event listeners
$todoBtn.on('click', addTodo)
    // $todoList.on('click', deleteCheck)
$filterOption.on('click', filterTodo)

//called function
getTodo();