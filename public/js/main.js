const socket = io();
const chatForm = document.getElementById("chat-form");
const msgContainer = document.getElementById("message-container");
const roomEle = document.getElementById("room-name");
const usersEle = document.getElementById("users");

const url = new URL(location.href);
const qs = {};
url.searchParams.forEach(( val, key ) => {
    qs[key] = val;
});

// Join userroom
socket.emit("joinRoom", qs);

function outputMessage ( message ) {
    const div = document.createElement("div");
    div.classList.add("message");
    if ( message.userName === qs.username) {
        div.classList.add("my-message");
    }
    div.innerHTML = `
        <p class="meta">${message.userName} <span>${message.time}</span></p>
        <p class="text">${message.text}</p>
    `;
    msgContainer.appendChild(div);
    msgContainer.scrollTop = msgContainer.scrollHeight;
}

socket.on("message", message => {
    outputMessage(message);
});

socket.on("roomUsers", roomUsers => {
    roomEle.innerText = roomUsers.room;
    usersEle.innerHTML = roomUsers.users.map(( user ) => `<li>${user.username}</li>`).join("");
});

chatForm.addEventListener("submit", e => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;

    // Send message to server
    socket.emit("chatMessage", msg);
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

document.getElementById("leave-btn").addEventListener("click", () => {
    window.history.back();
});