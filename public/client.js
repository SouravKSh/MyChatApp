const socket = io();

//setting password to the site
const password = "@fastaslight";

do{
    pass = prompt("enter the password:");
}while(pass!==password);

let username="";
while(!username){
    username = prompt("Enter Your Name:");
}

//When someone join the chat
document.addEventListener('DOMContentLoaded', ()=>{
    const joinDiv = document.createElement("div");
    const pjoin = document.createElement("p");
    pjoin.classList.add("pjoin");
    const t = `
        Welcome to the Chat ${username}!
    `; 
    pjoin.innerHTML= t;
    joinDiv.innerHTML = t;
    joinDiv.classList.add("joined"); 
    addMsg.appendChild(joinDiv);
}, false);

function userJoined(name, type){
    const joinDiv = document.createElement("div");
    const pjoin = document.createElement("p");
    pjoin.classList.add("pjoin");
    const t = `
        ${name} ${type} the chat
    `; 
    pjoin.innerHTML= t;
    joinDiv.innerHTML = t;
    joinDiv.classList.add("joined"); 
    addMsg.appendChild(joinDiv);
}

const input = document.querySelector("#text");
const form = document.querySelector(".input-field");
const addMsg = document.querySelector(".msg-container");

form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const date = new Date();
    const hr = date.getHours() <= 9 ? "0" + date.getHours() : date.getHours();
    const min = date.getMinutes() <= 9 ? "0" + date.getMinutes() : date.getMinutes();
    const time = hr + ":" + min;
    const data = {
        name: username,
        message: input.value,
        time: time 
    }
    if(input.value)
    {
        appendMsg(data, "outgoing");
        input.value="";
        scrollToNew(); 

        //sending message to server
        socket.emit("message", data);
    }

});


function appendMsg(data, type){

    const msgDiv = document.createElement("div");

    const singleMsgTag = `
            <p>${data.name}&nbsp;${data.time}</p>
            <h4>${data.message}</h4>
    `;

    msgDiv.innerHTML=singleMsgTag;
    msgDiv.classList.add("single-msg", type);
    addMsg.appendChild(msgDiv);
}

function scrollToNew(){
    addMsg.scrollTop = addMsg.scrollHeight;
}

//receiving the message from the server
socket.on("broadmsg", (msg)=>{
    appendMsg(msg,"incoming");
    scrollToNew();
});

//broadcast the user joined
socket.emit("new-user", username);

socket.on("user-joined", (name)=>{
    userJoined(name, "joined");
    scrollToNew();
});

//broadcast when user disconnects
socket.on("brd-disconnect", (user)=>{
    userJoined(user, "left");
    scrollToNew();
});