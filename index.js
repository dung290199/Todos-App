let todoList = [];
let tab;

function newToDo( e ) {
    if (e.key === "Enter") {
        let li = document.createElement("LI");
        let id = todoList.length;
        li.id = id;

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

        let label = document.createElement("LABEL");
        label.for = "item" + id;
        label.ondblclick  = function() {
            editing(id);
        }

        let todo = document.getElementById("new-todos").value;
        document.getElementById("new-todos").value = "";
        let text = document.createTextNode(todo);
        label.appendChild(text);
        
        let deleteButton = document.createElement("BUTTON");
        deleteButton.className = "delete";
        deleteButton.addEventListener("click", function() {
            deleteItem(id);
        });

        let edit = document.createElement("INPUT");
        edit.id = "edit" + id;
        edit.className = "edit";
        edit.addEventListener("focusout", function() {
            update(id);
        });
        edit.onkeypress = function(e) {
            if ( e.key === "Enter" ) {
                update(id);
            }
        }
        

        if (document.getElementById("todo-list").childElementCount === 0) {
            document.getElementsByClassName("footer")[0].style.visibility = "visible";
            document.getElementById("all").className = "selected";
        }

        li.appendChild(checkBox);
        li.appendChild(label);
        li.appendChild(deleteButton);
        li.appendChild(edit);

        document.getElementById("todo-list").appendChild(li);
        let icon = document.getElementById("selectAll");
        icon.style.visibility = "visible";
        icon.onclick = function(event) {
            selectAll(event);
        }

        todoList.push({id: id, item : li, status: true});
        tab = "all";
        getCounter();

        return false;
    }
}

function deleteItem( id ) {
    let index = todoList.filter( ( val, index ) => {
        if ( val.id === id ) {
            return index;
        }
    } );

    todoList.splice(index, 1);
    document.getElementById(id).remove();
    getCounter();
    if (todoList.length === 0) {
        document.getElementsByClassName("footer")[0].style.visibility = "hidden";
        document.getElementById("selectAll").style.visibility = "hidden";
    } else {
        displayClearCompletedLink(countCompleted() !== 0);
    }
    return;
}

function addToCompleted( id ) {
    todoList.map( val => {
        if (val.id === id) {
            val.status = false;
            let li = document.getElementById(val.id);
            li.getElementsByTagName("LABEL")[0].className = "checked";
            if (tab === "active") {
                li.remove();
            }
        }
        return;
    } );
    
    displayClearCompletedLink(true);
    getCounter();
    return;
}

function removeFromCompleted(id) {
    todoList.map( val => {
        if ( val.id === id ) {
            val.status = true;
            let li = document.getElementById(val.id);
            li.getElementsByTagName("LABEL")[0].classList.remove("checked");
            if ( tab === "completed" ) {
                li.remove();
            }
        }
        return;
    } );

    displayClearCompletedLink( countCompleted() !== 0 );

    getCounter();
    return;
}

function clearCompleted() {
    todoList = todoList.filter(val => {
        if (!val.status) {
            document.getElementById(val.id).remove();
            return false;
        } else {
            return true;
        }
    });

    getCounter();
    if (todoList.length === 0) {
        document.getElementsByClassName("footer")[0].style.visibility = "hidden";
        document.getElementById("selectAll").style.visibility = "hidden";
        displayClearCompletedLink(false);
    } 
    return;
}

function getCounter() {
    let span = document.getElementById("counter");
    let counter = document.createTextNode(todoList.filter( val => val.status ).length);
    if (span.childNodes.length === 0) {
        span.appendChild(counter);
    } else {
        span.replaceChild(counter, span.childNodes[0]);
    }

    return;
}

function all() {
    document.getElementById("all").className = "selected";
    document.getElementById("active").classList.remove("selected");
    document.getElementById("completed").classList.remove("selected");

    let list = document.getElementById("todo-list");

    todoList.map( val => {
        list.appendChild(val.item);
    });
    tab = "all";

    return;
}

function active() {
    document.getElementById("active").className = "selected";
    document.getElementById("all").classList.remove("selected");
    document.getElementById("completed").classList.remove("selected");

    let list = document.getElementById("todo-list");
    removeAllChildNodes(list);

    let arr = todoList.filter(val => val.status);
    arr.map( val => list.appendChild(val.item) );
    tab = "active";

    return;
}

function completed() {
    document.getElementById("completed").className = "selected";
    document.getElementById("active").classList.remove("selected");
    document.getElementById("all").classList.remove("selected");

    let list = document.getElementById("todo-list");
    removeAllChildNodes(list);

    let arr = todoList.filter(val => !val.status);
    arr.map( val => list.appendChild(val.item) );
    tab = "completed";
    return;
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    return;
}

function selectAll() {
    let check = todoList.filter( val => val.status );
    if ( check.length !== 0 ) {
        todoList = todoList.map( val => {
            val.status = false;
            let li = document.getElementById(val.id.toString());
            li.getElementsByTagName("INPUT")[0].checked =  true;
            li.getElementsByTagName("LABEL")[0].className = "checked";
            if (tab === "active") {
                li.remove();
            }
            return val;

        } );
        displayClearCompletedLink(true);
    } else {
        todoList = todoList.map( val => {
            val.status = true;
            let li = document.getElementById(val.id.toString());
            li.getElementsByTagName("INPUT")[0].checked = false;
            li.getElementsByTagName("LABEL")[0].classList.remove("checked");
            if ( tab === "completed" ) {
                li.remove();
            }
            return val;
        } );
        displayClearCompletedLink(false);
    }
    getCounter();
    return;
}

function countCompleted() {
    return todoList.filter( val => !val.status ).length;
}

function displayClearCompletedLink( arg ) {
    document.getElementsByClassName("footer")[0].getElementsByTagName("A")[3].style.visibility = arg ? "visible" : "hidden";
    return;
}

function editing(id) {
    let edit = document.getElementById("edit" + id);
    edit.style.visibility = "visible";
    
    let li = document.getElementById(id);
    let label = li.getElementsByTagName("LABEL")[0].innerHTML;
    edit.value = label;
    edit.focus();
    edit.scrollLeft = edit.scrollWidth;

    li.childNodes[0].style.display = "none";
    li.childNodes[1].style.display = "none";
    return;
    
}

function update(id) {
    
    let edit = document.getElementById("edit" + id);
    edit.style.visibility = "hidden";

    let li = document.getElementById(id);
    li.getElementsByTagName("LABEL")[0].innerHTML = edit.value;
    li.childNodes[0].style.display = "block";
    li.childNodes[1].style.display = "block";

    let item = todoList.filter( ( val => val.id === id ) );
    todoList.splice( todoList.indexOf(item), 1, {id: id, item: li, status: item[0].status} );

    return;
}