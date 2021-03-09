let todoList = [];
let tab = [
    { name: "all", status: false },
    { name: "active", status: false },
    { name: "completed", status: false }
];

function newToDo( e ) {
    if (e.key === "Enter") {
        let li = document.createElement("LI");
        let id = '_' + Math.random().toString(36).substr(2, 9);
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

        li.appendChild(checkBox);
        li.appendChild(label);
        li.appendChild(deleteButton);
        li.appendChild(edit);

        todoList.push({id: id, item : li, status: true});

        if (todoList.length === 1){
            selectedTab("all");
            document.getElementsByClassName("footer")[0].style.visibility = "visible";
            let icon = document.getElementById("selectAll");
            icon.style.visibility = "visible";
            icon.onclick = function(event) {
                selectAll(event);
            }
        } 
        if ( tab.filter( val => val.status )[0].name !== "completed" ) {
            document.getElementById("todo-list").appendChild(li);
        }
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
        hiddenFooter();
    }
    displayClearCompletedLink(countCompleted() !== 0);
    return;
}

function addToCompleted( id ) {
    todoList = todoList.map( val => {
        if (val.id === id) {
            val.status = false;
            let li = document.getElementById(val.id);
            li.getElementsByTagName("LABEL")[0].className = "checked";
            if (tab[1].status) {
                li.remove();
            }
        }
        return val;
    } );
    
    displayClearCompletedLink(true);
    getCounter();
    return;
}

function removeFromCompleted(id) {
    todoList = todoList.map( val => {
        if ( val.id === id ) {
            val.status = true;
            let li = document.getElementById(val.id);
            li.getElementsByTagName("LABEL")[0].classList.remove("checked");
            if ( tab[2].status ) {
                li.remove();
            }
        }
        return val;
    } );

    displayClearCompletedLink( countCompleted() !== 0 );

    getCounter();
    return;
}

function clearCompleted() {
    todoList = todoList.filter(val => {
        if (!val.status && ( tab[0].status || tab[2].status )) {
            document.getElementById(val.id).remove();
        }
        return val.status;
    });

    getCounter();
    if (todoList.length === 0) {
        hiddenFooter();
    } 
    displayClearCompletedLink(false);

    return;
}

function hiddenFooter() {
    tab = tab.map( val => {
        val.status = false;
        return val;
    });
    document.getElementsByClassName("footer")[0].style.visibility = "hidden";
    document.getElementById("selectAll").style.visibility = "hidden";
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

function getAll() {
    selectedTab("all");

    let list = document.getElementById("todo-list");
    todoList.map( val => {
        list.appendChild(val.item);
    });

    return;
}

function getActive() {
    selectedTab("active");

    let list = document.getElementById("todo-list");
    removeAllChildNodes(list);

    let arr = todoList.filter(val => val.status);
    arr.map( val => list.appendChild(val.item) );

    return;
}

function getCompleted() {
    selectedTab("completed");

    let list = document.getElementById("todo-list");
    removeAllChildNodes(list);

    let arr = todoList.filter(val => !val.status);
    arr.map( val => list.appendChild(val.item) );
    return;
}

function selectedTab(name) {
    tab = tab.map( val => {
        val.status = val.name === name;
        if (val.status) {
            document.getElementById(val.name).className = "selected";
        } else {
            document.getElementById(val.name).classList.remove("selected");
        }
        return val;
    });

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
    let list = document.getElementById("todo-list");
    todoList = ( check.length !== 0 ) 
                ? todoList.map( val => {
                        val.status = false;
                        val.item.getElementsByTagName("INPUT")[0].checked =  true;
                        val.item.getElementsByTagName("LABEL")[0].className = "checked";
                        if (tab[1].status) {
                            document.getElementById(val.id).remove();
                        } else if (tab[2].status) {
                            list.appendChild(val.item);                        
                        }
                        return val;
                    } )
                : todoList.map( val => {
                        val.status = true;
                        val.item.getElementsByTagName("INPUT")[0].checked = false;
                        val.item.getElementsByTagName("LABEL")[0].classList.remove("checked");
                        if ( tab[2].status ) {
                            document.getElementById(val.id).remove();
                        } else if ( tab[1].status ) {
                            list.appendChild(val.item);
                        }
                        return val;
                    } );
    displayClearCompletedLink( countCompleted() !== 0);
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