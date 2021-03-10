const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');

const PORT = process.env.PORT || 3000;
const maxRooms = 10;
let activeRooms = 0;

server.listen(PORT, () => {
    console.log(`TCP Socket listening on port ${PORT}...`);
});

app.use(express.static(path.join(__dirname, "public")));


io.on('connection', (socket) => {
    let addedUser = false;

    socket.on('createRoom', (username) => {
        if (addedUser) return;
        if(activeRooms >= maxRooms){
            return socket.emit('tooManyRooms');
        }
        socket.username = username;
        addedUser = true;
        const roomID = generateRoomID(7);
        socket.join(roomID);
        activeRooms++;
        socket.emit('joinRoom');
    });

});

function generateRoomID(len) {
    let res = '';
    let pool = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < len; i++) {
        res += pool.charAt(Math.floor(Math.random() * pool.length));
    }
    return res;
}