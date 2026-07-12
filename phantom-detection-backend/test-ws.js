const { io } = require('socket.io-client');
const axios = require('axios');

async function run() {
    try {
        const res = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@phantom.com',
            password: 'password123'
        });
        const token = res.data.token;
        const socket = io('http://localhost:5000', {
            auth: { token }
        });

        socket.on('connect', () => {});

        socket.on('fraudAlert', (data) => {});

        socket.on('connect_error', (err) => {});

        socket.on('disconnect', () => {});

        setTimeout(() => {
            socket.disconnect();
            process.exit(0);
        }, 10000);
    } catch (e) {}
}

run();
