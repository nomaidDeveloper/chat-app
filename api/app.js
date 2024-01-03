const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const { sequelize } = require('./db'); // Adjust the path as needed
const authRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const morgan = require('morgan');
const app = express();
app.use(morgan('dev'))
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: '*', credentials: true,
    },
});

require('dotenv').config();

app.use(cors());
app.use(express.json());

sequelize
    .sync()
    .then(() => {
        console.log('DB Connection Successful');
    })
    .catch((err) => {
        console.error(err.message);
    });

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Event: User joins the chat
    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id);

        // Broadcast to all clients that the user is typing
        socket.broadcast.emit('user-joined', userId);
    });

    // Event: User starts typing
    socket.on('typing', (userId) => {
        // Broadcast to all clients that the user is typing
        socket.broadcast.emit('user-typing', userId);
    });

    // Event: User stops typing
    socket.on('stop-typing', (userId) => {
        // Broadcast to all clients that the user stopped typing
        socket.broadcast.emit('user-stop-typing', userId);
    });

    // Event: User sends a message
    socket.on('send-msg', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-receive', data.msg);
        }
    });

    // Event: User disconnects
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        // Remove user from onlineUsers map
        for (const [key, value] of onlineUsers.entries()) {
            if (value === socket.id) {
                onlineUsers.delete(key);
                // Broadcast to all clients that the user left
                socket.broadcast.emit('user-left', key);
                break;
            }
        }
    });
});
