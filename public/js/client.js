const socket = io();

var username;
var chats= document.querySelector('.chats');
var users_list = document.querySelector('.users-list');
var users_count = document.querySelector('.users-count');
var msg_send = document.querySelector('#btn');
var users_msg = document.querySelector('#users-msg');

do{
    username = prompt("Enter your name: "); 
}while(!username);

socket.emit("new-user-joined", username)

socket.on("user-connected",(socket_name)=>{
    userJoinLeft(socket_name, 'joined');
})

function userJoinLeft(name, status) {
    let div = document.createElement("div")
    div.classList.add('user-joined')
    let content =`<p><b> ${name}</b> ${status} the chat </p>`;
    div.innerHTML= content;
    chats.appendChild(div);
    chats.scrollTop= chats.scrollHeight;
    
}
socket.on("user-disconnected",(user)=>{
    userJoinLeft(user, 'left');
});

socket.on('users-list',(users)=>{
    users_list.innerHTML="";
    users_arr= Object.values(users);
    for (i = 0;  i< users_arr.length; i++) {
        let p = document.createElement('p');
        p.innerText=users_arr[i];
        users_list.appendChild(p);
    }
    users_count.innerHTML=users_arr.length;
});

msg_send.addEventListener('click', ()=>{
    let data={
        user: username,
        msg: users_msg.value
    }; 
    if (users_msg.value!='') {
        appendMessage(data,'outgoing');
        socket.emit('message', data);
        users_msg.value='';
    }
});

function appendMessage(data,status){
    let div= document.createElement('div');
    div.classList.add('message',status);
    let content = `
    <h5>${data.user}</h5>
    <p>${data.msg}</p>
    `;
    div.innerHTML=content;
    chats.appendChild(div);
    chats.scrollTop= chats.scrollHeight;

}

socket.on('message', (data)=>{
    appendMessage(data,'incoming');
})