const jwt = require('jsonwebtoken');

const authMiddleware = {
    // Middleware de autenticação obrigatória
    authenticateToken: (req, res, next) => {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

            if (!token) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Token de acesso não fornecido'
                });
            }

            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(403).json({
                        status: 'error',
                        message: 'Token inválido ou expirado'
                    });
                }

                req.userId = decoded.userId;
                req.userEmail = decoded.email;
                next();
            });
        } catch (error) {
            console.error('Erro na autenticação:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro interno do servidor'
            });
        }
    },

    // Middleware de autenticação opcional
    optionalAuth: (req, res, next) => {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (token) {
                jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                    if (!err) {
                        req.userId = decoded.userId;
                        req.userEmail = decoded.email;
                    }
                });
            }

            next();
        } catch (error) {
            // Continua mesmo com erro de autenticação opcional
            next();
        }
    },

    // Middleware para verificar se é admin
    requireAdmin: (req, res, next) => {
        try {
            // Primeiro verifica autenticação
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Token de acesso não fornecido'
                });
            }

            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if (err) {
                    return res.status(403).json({
                        status: 'error',
                        message: 'Token inválido ou expirado'
                    });
                }

                // Verificar se usuário é admin
                const supabase = require('../config/supabase');
                const { data: user } = await supabase
                    .from('users')
                    .select('is_admin')
                    .eq('id', decoded.userId)
                    .single();

                if (!user || !user.is_admin) {
                    return res.status(403).json({
                        status: 'error',
                        message: 'Acesso restrito para administradores'
                    });
                }

                req.userId = decoded.userId;
                req.userEmail = decoded.email;
                next();
            });
        } catch (error) {
            console.error('Erro na verificação de admin:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro interno do servidor'
            });
        }
    }
};

module.exports = authMiddleware;