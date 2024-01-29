
const express = require("express");
const twig = require("twig");
const socketio = require('socket.io');

const app = express();
app.set("twig options", {
    allowAsync: true,
    strict_variables: false
});

app.get('/', function(req, res){
    res.render('index.twig', {
        message : "Hello"
    });
});

const server = app.listen(5000, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Server started")
    }
});

const io = socketio(server);

io.on('connection', (socket) => {
    console.log(socket.id)
    socket.on("chat", (msg,userid,room) => {
      if(msg&&room&&userid){
            socket.join(room)
            io.to(userid).emit("chat",msg);
        }else if(msg&&room){
            socket.join(room);
            socket.broadcast.to(room).emit("chat",msg);
        } else if(userid){
            socket.broadcast.to(userid).emit("chat", msg);
        }else if(room){
            
            socket.join(room);
           
        }else{
            socket.broadcast.emit("chat",msg);
        }
    });
    console.log('New connection');
});
