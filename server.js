const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const io = new Server(server, {
    cors: {
        origin: CORS_ORIGIN,
        methods: ['GET', 'POST'],
    },
});

app.use(cors());
app.use(express.json());

const PORT = process.env.SOCKET_PORT || 3001;

// Store online users and drivers
const onlineUsers = new Map(); // userId -> socketId
const ambulanceLocations = new Map(); // ambulanceId -> { lat, lng, socketId }

io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // User/Driver authentication
    socket.on('authenticate', (data) => {
        const { userId, role, ambulanceId } = data;
        onlineUsers.set(userId, socket.id);

        if (role === 'driver' && ambulanceId) {
            socket.join(`ambulance:${ambulanceId}`);
            console.log(`🚑 Driver ${userId} authenticated for ambulance ${ambulanceId}`);
        }

        socket.userId = userId;
        socket.role = role;
        socket.ambulanceId = ambulanceId;
    });

    // Ambulance location update
    socket.on('ambulance:location', (data) => {
        const { ambulanceId, lat, lng, status } = data;

        ambulanceLocations.set(ambulanceId, { lat, lng, status, socketId: socket.id });

        // Broadcast to all users
        io.emit('ambulances:update', {
            ambulanceId,
            location: { lat, lng },
            status,
        });

        console.log(`📍 Ambulance ${ambulanceId} location updated: ${lat}, ${lng}`);
    });

    // Emergency request created
    socket.on('emergency:created', (data) => {
        const { requestId, ambulanceId, pickupLocation, patient } = data;

        // Notify specific ambulance driver
        if (ambulanceId) {
            io.to(`ambulance:${ambulanceId}`).emit('emergency:new', {
                requestId,
                pickupLocation,
                patient,
                timestamp: new Date(),
            });

            console.log(`🚨 Emergency request ${requestId} sent to ambulance ${ambulanceId}`);
        }
    });

    // Driver accepts request
    socket.on('emergency:accept', (data) => {
        const { requestId, ambulanceId, driverId } = data;

        // Notify the patient
        io.emit('emergency:accepted', {
            requestId,
            ambulanceId,
            driverId,
            timestamp: new Date(),
        });

        console.log(`✅ Emergency request ${requestId} accepted by driver ${driverId}`);
    });

    // Driver declines request
    socket.on('emergency:decline', (data) => {
        const { requestId, ambulanceId } = data;

        io.emit('emergency:declined', {
            requestId,
            ambulanceId,
            timestamp: new Date(),
        });

        console.log(`❌ Emergency request ${requestId} declined`);
    });

    // Status update (on_way, arrived, picked, completed)
    socket.on('emergency:status', (data) => {
        const { requestId, status, ambulanceId } = data;

        io.emit('emergency:status-update', {
            requestId,
            status,
            ambulanceId,
            timestamp: new Date(),
        });

        console.log(`📝 Emergency request ${requestId} status: ${status}`);
    });

    // Join emergency room for real-time updates
    socket.on('emergency:join', (requestId) => {
        socket.join(`emergency:${requestId}`);
        console.log(`🔔 User joined emergency room: ${requestId}`);
    });

    // Leave emergency room
    socket.on('emergency:leave', (requestId) => {
        socket.leave(`emergency:${requestId}`);
    });

    // Get all ambulance locations
    socket.on('ambulances:get', (callback) => {
        const locations = Array.from(ambulanceLocations.entries()).map(([id, data]) => ({
            ambulanceId: id,
            location: { lat: data.lat, lng: data.lng },
            status: data.status,
        }));

        callback(locations);
    });

    // Driver status update
    socket.on('driver:status', (data) => {
        const { ambulanceId, status } = data;

        io.emit('ambulance:status', {
            ambulanceId,
            status,
            timestamp: new Date(),
        });
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);

        // Remove from online users
        if (socket.userId) {
            onlineUsers.delete(socket.userId);
        }

        // Remove ambulance location
        if (socket.ambulanceId) {
            ambulanceLocations.delete(socket.ambulanceId);

            // Notify all users
            io.emit('ambulance:offline', {
                ambulanceId: socket.ambulanceId,
            });
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 WebSocket server running on port ${PORT}`);
});
