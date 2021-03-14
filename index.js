let tab = [
    { name: "all", status: false },
    { name: "active", status: false },
    { name: "completed", status: false }
];
let todoList = [];

function newToDo( e ) {
    if (e.key === "Enter" && e.target.value !== "") {  
        let li = document.createElement("LI");
        let id = '_' + Math.random().toString(36).substr(2, 9);
        li.id = id;

        var checkBox = document.createElement("INPUT");
        checkBox.type = "checkbox";
        checkBox.name = "item" + id;
        checkBox.addEventListener("click", function() {
            if (checkBox.checked) {
                tick(id, true);
            } else {
                tick(id, false);
            }
        })

        let label = document.createElement("LABEL");
        label.for = "item" + id;
        label.ondblclick  = function() {
            editing(id, true);
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
            editing(id, false);
        });
        edit.onkeypress = function(e) {
            if ( e.key === "Enter" ) {
                editing(id, false);
            }
        }

        li.appendChild(checkBox);
        li.appendChild(label);
        li.appendChild(deleteButton);
        li.appendChild(edit);

        todoList.push({id: id, item : li, status: true});

        if (todoList.length === 1){
            tab[0].status = true;
            document.getElementById(tab[0].name).className = "selected";
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
    let index = todoList.indexOf(todoList.filter( val => val.id === id )[0]);

    todoList.splice(index, 1);
    document.getElementById(id).remove();
    getCounter();
    if (todoList.length === 0) {
        hiddenFooter();
    }
    displayClearCompletedLink(countCompleted() !== 0);
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

function tick(id, arg) {
    todoList = todoList.map( val => {
        if (val.id === id) {
            val.status = !arg;
            let li = document.getElementById(val.id);
            arg ? li.getElementsByTagName("LABEL")[0].className = "checked" : li.getElementsByTagName("LABEL")[0].classList.remove("checked");
            if ((tab[1].status && arg) || (tab[2].status && !arg)) {
                li.remove();
            }
        }
        return val;
    } );
    
    displayClearCompletedLink(true);
    getCounter();
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
    let counter = document.createTextNode(todoList.filter( val => val.status ).length);
    let span = document.getElementById("counter");
    span.replaceChild(counter, span.childNodes[0]);
    return;
}

function getData(e) {
    let tabName = e.target.innerHTML.toLowerCase();
    let list = document.getElementById("todo-list");
    removeAllChildNodes(list);
    tab = tab.map( val => {
        val.status = val.name === tabName;
        if (val.status) {
            document.getElementById(val.name).className = "selected";
            let arr = ( val.name === "active" ) 
                    ? todoList.filter(val => val.status) 
                    : (val.name === "completed")
                        ? todoList.filter(val => !val.status) 
                        : todoList;
            arr.map( val => list.appendChild(val.item) );

        } else {
            document.getElementById(val.name).classList.remove("selected");
        }
        return val;
    } )

    return;
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    return;
}

function selectAll() {
    // kiem tra xem co can tick khong => tuc la trong mang co phan tu chua tick thi can tick cho het
    // check: true => tick all, nguoc lai untick all
    let check = todoList.filter( val => val.status ).length !== 0; 
    let list = document.getElementById("todo-list");
    let tabName = tab.filter( val => val.status )[0].name;

    todoList = todoList.map( val => {
        val.status = !check;
        val.item.getElementsByTagName("INPUT")[0].checked = check;
        let labelStyle = val.item.getElementsByTagName("LABEL")[0].classList;
        check ? labelStyle.add("checked") : labelStyle.remove("checked");

        // dang o tab "active", check = false 
        // dang o tab "completed", check = true 
        // => hien thi
        if ( (tabName === "active" && !check) || (tabName === "completed" && check) ) {
            list.appendChild(val.item); 
        } else if (tabName !== "all") {
            let li = document.getElementById(val.id);
            if (li !== null) li.remove(); // neu khong phai o tab "all" thi khong hien thi 
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

//true: dang edit, false: edit xong
function editing(id, arg) {
    let edit = document.getElementById("edit" + id);
    edit.style.visibility = arg ? "visible" : "hidden";
    
    let li = document.getElementById(id);
    li.childNodes[0].style.display = arg ? "none" : "block";
    li.childNodes[1].style.display = arg ? "none" : "block";

    if (arg) {
        let label = li.getElementsByTagName("LABEL")[0].innerHTML;
        edit.value = label;
        edit.focus();
        edit.scrollLeft = edit.scrollWidth;
    } else if (edit.value !== "") {
        li.getElementsByTagName("LABEL")[0].innerHTML = edit.value;
        let item = todoList.filter( ( val => val.id === id ) );
        todoList.splice( todoList.indexOf(item), 1, {id: id, item: li, status: item[0].status} );
    }
    return;
}