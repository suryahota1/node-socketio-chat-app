const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser, userLeaves, getRoomUsers } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = "ChatCord";

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when client connects
io.on("connection", socket => {
    socket.on("joinRoom", ({ username, room }) => {
        // Welcome current user
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        socket.emit("message", formatMessage(botName, "Welcome to ChatCord"));

        // Inform others about the current user
        socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} has joined the chat`));
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    socket.on("chatMessage", msg => {
        const currUser = getCurrentUser(socket.id);
        io.to(currUser.room).emit("message", formatMessage(currUser.username, msg));
    });

    // Inform other when one user leaves
    socket.on("disconnect", () => {
        const currUser = userLeaves(socket.id);
        if ( currUser ) {
            io.to(currUser.room).emit("message", formatMessage(botName, `${currUser.username} has left the chat`));
            io.to(currUser.room).emit("roomUsers", {
                room: currUser.room,
                users: getRoomUsers(currUser.room)
            });
        }
    });
})

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
})