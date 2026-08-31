// Arrays and Functions

let list = [];

function addTask(task) {
    list.push(task);
    console.log(`Added: ${task}`);
}

function showTasks() {
    console.log("\nYour Tasks:");
    if (list.length === 0) {
        console.log("No tasks yet");
        return;
    }
    for (let i = 0; i < list.length; i++) {
        console.log(`${i+1}. ${list[i]}`);
    }
}

function completeTask(index) {
    if (index >= 0 && index < list.length) {
        let done = list[index];
        list.splice(index, 1);
        console.log(`Completed: ${done}`);
    } else {
        console.log("Invalid task number");
    }
}

function countTasks() {
    console.log(`Total tasks: ${list.length}`);
}


addTask("Buy groceries");
addTask("Walk the dog");
addTask("Read a book");
showTasks();
countTasks();
completeTask(1);
showTasks();
countTasks();