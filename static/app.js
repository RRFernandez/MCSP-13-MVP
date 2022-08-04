//selectors
const $todoList = $("#todo-list");
const $todoBtn = $(".todo-button")
const $todoInput = $(".todo-input")
const $filterOption = $(".filter-todo")


//functions

const createTodo = (data) => {
    for (let i = 0; i < data.length; i++) {
        const $todoDiv = $('<div></div>').addClass("todo-div");
        const $newTask = $('<li></li>').addClass("task");
        $todoDiv.append($newTask);
        const $completeBtn = $('<button></button>').html('<i class="fas fa-check"></i>');
        $completeBtn.addClass("complete-btn")
        $todoDiv.append($completeBtn);
        const $trashBtn = $('<button></button>').html('<i class="fas fa-trash"></i>');
        $trashBtn.addClass("trash-btn")
        $todoDiv.append($trashBtn);
        $todoDiv.append(JSON.stringify(data[i].name))
        $todoList.append($todoDiv);
        $todoInput.val("");
    }
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
            createTodo(data)
        });
};

const getTodo = (event) => {

    fetch("/todo")
        .then(res => res.json())
        .then(data => {
            console.log(data)
            createTodo(data)
        })

}


const deleteCheck = (e) => {
    const item = e.target;
    const deleteItem =
        fetch("/todo", {
            method: 'DELETE',
            headers: {
                "Content-type": "application/json"
            }
        })

    if (item.classList[0] === 'trash-btn') {
        const todo = item.parentElement;
        todo.classList.add('fall');
        todo.addEventListener('transitioned', () => {
            todo.remove();
            deleteItem(todo);
        })

    }

    if (item.classList[0] === "complete-btn") {
        const todo = item.parentElement;
        todo.classList.toggle('completed');
    }
}

function filterTodo(e) {
    const todos = e.childElement;
    for (let e = 0; e < todos.length; i++) {
        switch (e.target.value) {
            case "all":
                todos.style.display = "flex";
                break;
            case "completed":
                if (todos.classList.contains("completed")) {
                    todos.style.display = "flex";
                } else {
                    todos.style.display = "none";
                }
                break;
            case "uncompleted":
                if (!todos.classList.contains('completed')) {
                    todos.style.display = "flex";
                } else {
                    todos.style.display = "none";
                }
                break;
        }
    };
}

//event listeners
$todoBtn.on('click', addTodo)
$todoList.on('click', deleteCheck)
$filterOption.on('click', filterTodo)

//called function
getTodo();