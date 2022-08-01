const $list = $("#list");
const $task = $("#task");

fetch("/todo")
    .then(res => res.json())
    .then(data => {
        console.log(data)
        $list.append(JSON.stringify(data))
    });