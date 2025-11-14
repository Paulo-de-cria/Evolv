const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();

// ✅ CORS CONFIGURADO CORRETAMENTE
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ✅ LIDAR COM PREFLIGHT REQUESTS
app.options('*', cors());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // limite de 100 requests por IP
});

// Middlewares
app.use(helmet());
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ✅ MIDDLEWARE DE LOG PARA DEBUG
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Origin:', req.headers.origin);
    console.log('Authorization:', req.headers.authorization ? 'Present' : 'Missing');
    next();
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

// Rota de saúde
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: '🚀 Evolv Backend está funcionando!',
        timestamp: new Date().toISOString(),
        cors: 'CORS configurado ✅'
    });
});

// Rota 404
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Rota não encontrada'
    });
});

// Error handler global
app.use((error, req, res, next) => {
    console.error('Erro:', error);
    res.status(500).json({
        status: 'error',
        message: 'Erro interno do servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

module.exports = app;