const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
// const bodyparser = require("body-parser");

const port = process.env.PORT || 3000;

app.use(express.static(__dirname+ "/public"));
// app.use(bodyparser.urlencoded({ extended: false }))

app.get("/", function(req,res){
    res.sendFile(__dirname+"/index.html");
});

//Socket.io 

const io = require("socket.io")(server);
const users = {};

io.on("connection", function(socket){
    console.log("Connected");
    
    socket.on("message", (msg)=>{
        socket.broadcast.emit("broadmsg",msg);
    });

    socket.on("new-user", (name)=>{
        users[socket.id]=name;
        socket.broadcast.emit("user-joined",name); 
    });

    socket.on("disconnect", ()=>{
        socket.broadcast.emit("brd-disconnect", users[socket.id]);
        delete users[socket.id];
    });
    
});


server.listen(port, function(){
    console.log("Listening at Port: "+ port);
});
