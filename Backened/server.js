const express = require("express"); 
const dotenv = require("dotenv"); 
const {chats} = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes=require("./routes/userRoutes");
const chatRoutes=require("./routes/chatRoutes");
const {notFound,errorHandler}=require('./middleware/errorMiddleware');
const messageRoutes =require("./routes/messageRoutes");
const path =require('path');

dotenv.config();

connectDB();
const app = express();

app.use(express.json()); // to access JSON Data

// app.get("/",(req,res) =>{
//     res.send("API is running"); 

// })
app.use("/api/user",userRoutes); 
// app.use("/",userRoutes); 
// app.get('/', function(req, res) {
//     // var string = encodeURIComponent('something that would break');
//     res.redirect('/api/user');
//   });
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes);

// -------------Deployment --------

const __dirname1 =path.resolve();
// console.log("Serving from:", path.join(__dirname1, "/frontend/build"));
console.log(process.env.NODE_ENV);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname1,"/frontend/build")));


    app.get('*',(req,res) =>{
        res.sendFile(path.resolve(__dirname1,"frontend","build" , "index.html"));
    })
}else{
    app.get("/",(req,res) =>{
        res.send("API is Running Successfully");
    })
}

// -------------Deployment----------


app.use(notFound);
app.use(errorHandler);


const PORT=process.env.PORT || 5000
const server= app.listen(PORT ,console.log(`API is running at Port ${PORT} `.yellow.bold));

const io =require('socket.io')(server,{
    pingTimeout : 60000,
    cors:{
        origin:"http://localhost:3000"
    }
});

io.on("connection",(socket) =>{
    // console.log("connected to the socket");

    socket.on('setup',(userData) =>{
        socket.join(userData._id);
        // console.log(userData._id);
        
        socket.emit('connected');
    });

    socket.on('join chat',(room) => {
        socket.join(room);
        console.log("user joined Room "+room);        
    });
    socket.on('typing' ,(room) => socket.in(room).emit("typing"));
    socket.on('stop typing' ,(room) => socket.in(room).emit("stop typing") );

    socket.on('new message',(newMessageRecieved) =>{
        var chat= newMessageRecieved.chat;
        if(!chat.users) return console.log('chat.users not defined');
        
        chat.users.forEach(user => {
            if(user._id == newMessageRecieved.sender._id)   return ;

            socket.in(user._id).emit("Message recieved",newMessageRecieved);
        });
    });

    socket.off("setup",() =>{
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
        
    })
})