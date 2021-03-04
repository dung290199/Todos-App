var all = 0;
var active = 0;
var completed = 0;
var todoList = {
    "active": [],
    "completed": []
};

function newToDo( e ) {
    if (e.key == "Enter") {
        // alert( "this is Enter!");
        var li = document.createElement("LI");
        let id = todoList.active.length + todoList.completed.length;
        li.setAttribute("id", id);

        var checkBox = document.createElement("INPUT");
        checkBox.type = "checkbox";
        checkBox.name = "item" + id;
        checkBox.addEventListener("click", function() {
            if (checkBox.checked) {
                addToCompleted(id);
            } else {
                removeFromCompleted(id);
            }
        })

        var label = document.createElement("LABEL");
        label.for = "item" + id;

        var todo = document.getElementById("new-todos").value;
        document.getElementById("new-todos").value = "";
        var text = document.createTextNode(todo);
        label.appendChild(text);
        
        var deleteButton = document.createElement("BUTTON");
        deleteButton.className = "delete";
        deleteButton.addEventListener("click", function() {
            deleteItem(id);
        });

        if (document.getElementById("todo-list").childElementCount === 0) {
            document.getElementsByClassName("footer")[0].style.visibility = "visible";
        }

        li.appendChild(checkBox);
        li.appendChild(label);
        li.appendChild(deleteButton);


        console.log("Todo: " + todo);
        console.log("Label: " + label);

        document.getElementById("todo-list").appendChild(li);

        

        // all = document.getElementById("todo-list").childElementCount;
        // active++;
        todoList.active.push(li);
        console.log("TodoList: " + todoList.active.join() + todoList.completed.join());

        console.log("All: " + all + ", Active: " + todoList.active.length);

        return false;
    }
}

function deleteItem( id ) {
    console.log("Id to remove: " + id);

    
    document.getElementById(id).remove();
    all = document.getElementById("todo-list").childElementCount;
    
    if (all === 0) {
        document.getElementsByClassName("footer")[0].style.visibility = "hidden";
    }
}

function addToCompleted( id ) {

    console.log("go in add");
    let item = document.getElementById(id);
    todoList.completed.push(item);
    todoList.active.splice( todoList.active.indexOf(item), 1 );

    console.log("Completed: " + todoList.completed.length + " active: " + todoList.active.length + " all: " + all);
}

function removeFromCompleted(id) {
    console.log("go in remove");
    let item = document.getElementById(id);
    todoList.active.push(item);
    todoList.completed.splice( todoList.completed.indexOf(item), 1 );

    console.log("Completed: " + todoList.completed.length + " active: " + todoList.active.length + " all: " + all);
}

function removeAllCompleted() {
    todoList.completed.map(val => {
        document.getElementById(val.id).remove();
    });
    todoList.completed = [];
    all = document.getElementById("todo-list").childElementCount;
    
    if (all === 0) {
        document.getElementsByClassName("footer")[0].style.visibility = "hidden";
    }
    console.log("complete.length: " + todoList.completed.length);
}