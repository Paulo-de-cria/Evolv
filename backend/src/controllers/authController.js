const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const authController = {
    // Registrar novo usuário
    register: async (req, res) => {
        try {
            const { name, email, password, fitness_goals } = req.body;

            // Validar campos obrigatórios
            if (!name || !email || !password) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Nome, email e senha são obrigatórios'
                });
            }

            // Verificar se usuário já existe
            const { data: existingUser, error: userError } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .single();

            if (existingUser) {
                return res.status(409).json({
                    status: 'error',
                    message: 'Usuário já cadastrado com este email'
                });
            }

            // Hash da senha
            const hashedPassword = await bcrypt.hash(password, 12);

            // Inserir usuário no banco
            const { data: user, error: insertError } = await supabase
                .from('users')
                .insert([
                    {
                        name,
                        email,
                        password_hash: hashedPassword,
                        fitness_goals: fitness_goals || null,
                        created_at: new Date().toISOString()
                    }
                ])
                .select()
                .single();

            if (insertError) throw insertError;

            // Gerar token JWT
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            // Remover senha hash da resposta
            const { password_hash, ...userWithoutPassword } = user;

            res.status(201).json({
                status: 'success',
                message: 'Usuário criado com sucesso!',
                data: {
                    user: userWithoutPassword,
                    token
                }
            });

        } catch (error) {
            console.error('Erro no registro:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro interno do servidor'
            });
        }
    },

    // Login do usuário
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email e senha são obrigatórios'
                });
            }

            // Buscar usuário pelo email
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error || !user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Credenciais inválidas'
                });
            }

            // Verificar senha
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if (!isPasswordValid) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Credenciais inválidas'
                });
            }

            // Gerar token JWT
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            // Remover senha hash da resposta
            const { password_hash, ...userWithoutPassword } = user;

            res.json({
                status: 'success',
                message: 'Login realizado com sucesso!',
                data: {
                    user: userWithoutPassword,
                    token
                }
            });

        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro interno do servidor'
            });
        }
    },

    // Obter perfil do usuário
    getProfile: async (req, res) => {
        try {
            const userId = req.userId;

            const { data: user, error } = await supabase
                .from('users')
                .select('id, name, email, fitness_goals, created_at')
                .eq('id', userId)
                .single();

            if (error || !user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuário não encontrado'
                });
            }

            res.json({
                status: 'success',
                data: { user }
            });

        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro interno do servidor'
            });
        }
    },

    // Atualizar perfil do usuário
    updateProfile: async (req, res) => {
        try {
            const userId = req.userId;
            const { name, fitness_goals } = req.body;

            const { data: user, error } = await supabase
                .from('users')
                .update({
                    name,
                    fitness_goals,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select('id, name, email, fitness_goals, created_at, updated_at')
                .single();

            if (error) throw error;

            res.json({
                status: 'success',
                message: 'Perfil atualizado com sucesso!',
                data: { user }
            });

        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro interno do servidor'
            });
        }
    }
};

module.exports = authController;