const users = [];

// Join user to chat
function userJoin ( id, username, room ) {
    const user = { id, username, room };
    users.push(user);
    return user;
}

function getCurrentUser ( id ) {
    return users.find(user => user.id === id);
}

function userLeaves ( id ) {
    const idx = users.findIndex(user => user.id === id);
    if ( idx >= 0 ) {
        const lu = users[idx];
        users.splice(idx, 1);
        return lu;
    }
}

function getRoomUsers ( room ) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin, getCurrentUser, userLeaves, getRoomUsers
};
