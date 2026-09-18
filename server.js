const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const router=require('./router/router.js');
const {socketManager}=require('./socket/socketManager.js');
// Serve the 'public' folder directly
app.use(express.static('/'));


// custom middleware to authenticate requests


// impport routes here
app.use("/",router);



io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);
         socketManager(socket);
    // Jab ek user type karega, Yjs ek update generate karega. 
    // Server us update ko baaki sabhi users ko broadcast kar dega.
    socket.on('document-update', (updateData) => {
        socket.broadcast.emit('document-update', updateData);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running smoothly on http://localhost:${PORT}`);
});
