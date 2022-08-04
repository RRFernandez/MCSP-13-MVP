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
    $todoDiv.append(JSON.stringify(data.name))
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
            console.log(data)
            createTodo(data)
        })

}

function deleteIt() {
    fetch("/todo", {
            method: 'DELETE'
        })
        .then(() => {
            console.log('Deleted')
        })
}

const deleteCheck = (e) => {
    const item = e.target;


    if (item.classList[0] === 'trash-btn') {
        const todo = item.parentElement;
        todo.classList.add('fall');
        todo.addEventListener('transitioned', () => {
            todo.remove();
            deleteIt();
        })

    }

    if (item.classList[0] === "complete-btn") {
        const todo = item.parentElement;
        todo.classList.toggle('completed');
    }
}

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
$todoList.on('click', deleteCheck)
$filterOption.on('click', filterTodo)

//called function
getTodo();