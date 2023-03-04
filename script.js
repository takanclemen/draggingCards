/* class User{
    constructor(username,age){
        this.userName = username;
        this.age = age;
        this.active = false;
    }
    login(){
        console.log(`welcome ${this.userName}`);
        this.active = true;
        return this;

    }
    display(){
        if(this.active){
            console.log(`Hallo ${this.userName} is signed in`);
        }else{
            console.log('Wrong');
        }
    }
}

class Student extends User{
    constructor(semester,rank,username,age){
        super(username,age);
this.sem = semester;
this.rank = rank;
    }
}
const userOne = new User('Joshua',24);
userOne.login();
userOne.display();

const studentOne = new Student(8, 66,'John',34);
studentOne.login()
studentOne.display()
console.log(studentOne.sem,studentOne.userName,studentOne.rank) */

import Kanban from "./kanban.js";

/* console.log(Kanban.getAllTasks());

Kanban.updateTask(38833, {
    columnId:1,
    content: "Hallo new change"
})
console.log(Kanban.getAllTasks()); */
const todo = document.querySelector('.cards.todo');
const pending = document.querySelector('.cards.pending');
const completed = document.querySelector('.cards.completed');

const taskBox = [todo,pending,completed];

function addTaskCard(task,index){
const element = document.createElement('form');
element.className = "card";
element.draggable = true;
element.dataset.id = task.taskId;
element.innerHTML = ` 
<form class="card">
<input type="text" name="task" autocomplete="off" disabled="disabled" value="${task.content}" title="test">
<div>
    <span class="task-id">#${task.taskId}</span>
    <span>
        <button type="button" class="bi bi-pencil edit" data-id="${task.taskId}" title="edit"></button>
        <button type="button" class="bi bi-check update hide" data-id="${task.taskId}" title="update" data-column="${index}"></button>
        <button type="button" class="bi bi-trash delete" data-id="${task.taskId}" title="delete"></button>
    </span>
</div>
</form>
`;
taskBox[index].appendChild(element);
}

Kanban.getAllTasks().forEach((tasks,index) =>{
    tasks.forEach(task =>{
        addTaskCard(task,index);
    })
});

const addForm = document.querySelectorAll('.add');
addForm.forEach(form => {
    form.addEventListener('submit', event => {
        event.preventDefault();
        console.log('hallo');
       if(form.task.value){
        const task = Kanban.insertTask(form.submit.dataset.id, form.task.value.trim());
        addTaskCard(task, form.submit.dataset.id);
        form.reset();
        } 
        
    })
});

taskBox.forEach(column => {
    column.addEventListener('click', event => {
        event.preventDefault();
        if(event.target.classList.contains('edit')){
            event.target.parentElement.parentElement.previousElementSibling.removeAttribute("disabled");
            event.target.classList.add("hide");
            event.target.nextElementSibling.classList.remove("hide");
        }
        if(event.target.classList.contains('update')){
            event.target.parentElement.parentElement.previousElementSibling.setAttribute("disabled", "disabled");
            event.target.classList.add("hide");
            event.target.previousElementSibling.classList.remove("hide");

            const taskId = event.target.dataset.id;
            const columnId = event.target.dataset.column;
            const content = event.target.parentElement.parentElement.previousElementSibling.value;

            Kanban.updateTask(taskId,{columnId:columnId,content:content});
        }
        if(event.target.classList.contains("delete")){
            event.target.parentElement.parentElement.previousElementSibling.parentElement.remove();
            Kanban.deleteTask(event.target.dataset.id);
        }
    });
    column.addEventListener("dragstart", event => {
        if(event.target.classList.contains("card")){
            event.target.classList.add("dragging");

        }
    });
    column.addEventListener("dragover", event =>{
        const card = document.querySelector(".card");
        column.appendChild(card);
    });
    column.addEventListener("dragend", event =>{
        if(event.target.classList.contains("card")){
            event.target.classList.remove("dragging");

            const taskId = event.target.dataset.id;
            const columnId = event.target.parentElement.dataset.id;
            const content = event.target.task.value;
            Kanban.updateTask(taskId,{columnId:columnId,content:content});
        }
    });
})