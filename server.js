const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
const port =process.env.PORT || 3000;

app.use(express.static(__dirname+'/public'))

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})

//set up for socket.io 

const io = require("socket.io")(server);

var users = {};
io.on("connection",(socket)=>{
    // console.log(socket.id);
    socket.on("new-user-joined", (username)=>{
        users[socket.id]= username;
        //console.log(users)
        socket.broadcast.emit('user-connected', username);
        io.emit('users-list', users);
    })

    socket.on("disconnect",()=>{
        socket.broadcast.emit('user-disconnected', user=users[socket.id])
        delete users[socket.id];
        io.emit('users-list', users);
    })
    socket.on("message",(data)=>{
        socket.broadcast.emit('message', {user: data.user, msg: data.msg});
    })
})
//end
server.listen(port,()=>{
    console.log("Server started at" + port);
    io.emit('users-list', users);
})

 
