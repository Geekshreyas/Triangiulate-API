const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['https://triangiulate-api.vercel.app', 'http://localhost:5173', 'http://localhost:5000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
});

app.set('socketio', io);

const jwt = require('jsonwebtoken');
const User = require('./models/User');

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error('Authentication error: No token provided'));
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) return next(new Error('Authentication error: User not found'));
        
        socket.user = user;
        next();
    } catch (err) {
        next(new Error('Authentication error: Invalid token'));
    }
});

io.on('connection', (socket) => {
    const role = socket.user.role.toLowerCase();
    if (['adjudicator', 'superadmin'].includes(role)) {
        socket.join('adjudicators_room');
    }

    socket.on('disconnect', () => {});
});

app.use(cors({
    origin: ['https://triangiulate-api.vercel.app', 'http://localhost:5173', 'http://localhost:5000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/claims', require('./routes/claimRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/audit', require('./routes/auditRoutes'));

const errorHandler = require('./middlewares/errorHandler');

app.get('/', (req, res) => {
    res.send('Phantom Detection API is running...');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {});