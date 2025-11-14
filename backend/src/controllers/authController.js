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

            // Verificar se JWT_SECRET está configurado
            if (!process.env.JWT_SECRET) {
                console.error('❌ JWT_SECRET não configurado no .env');
                return res.status(500).json({
                    status: 'error',
                    message: 'Configuração do servidor incompleta. Verifique o arquivo .env'
                });
            }

            // Verificar se usuário já existe
            const { data: existingUser, error: userError } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .single();

            // Se encontrar usuário, retorna erro de conflito
            if (existingUser) {
                return res.status(409).json({
                    status: 'error',
                    message: 'Usuário já cadastrado com este email'
                });
            }

            // Se o erro não for "não encontrado" (PGRST116), lança o erro
            if (userError && userError.code !== 'PGRST116') {
                console.error('Erro ao verificar usuário existente:', userError);
                throw userError;
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

            if (insertError) {
                console.error('Erro ao inserir usuário:', insertError);
                // Mensagens mais específicas baseadas no erro
                if (insertError.code === '23505') {
                    return res.status(409).json({
                        status: 'error',
                        message: 'Email já cadastrado'
                    });
                }
                if (insertError.code === '42P01') {
                    return res.status(500).json({
                        status: 'error',
                        message: 'Tabela users não encontrada no banco de dados. Verifique a configuração do Supabase.'
                    });
                }
                throw insertError;
            }

            if (!user) {
                throw new Error('Usuário não foi criado');
            }

            // Gerar token JWT
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
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
            console.error('Detalhes do erro:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            res.status(500).json({
                status: 'error',
                message: error.message || 'Erro interno do servidor',
                ...(process.env.NODE_ENV === 'development' && { 
                    details: error.message,
                    code: error.code 
                })
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

            // Verificar se JWT_SECRET está configurado
            if (!process.env.JWT_SECRET) {
                console.error('❌ JWT_SECRET não configurado no .env');
                return res.status(500).json({
                    status: 'error',
                    message: 'Configuração do servidor incompleta. Verifique o arquivo .env'
                });
            }

            // Buscar usuário pelo email
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            // Tratar erros específicos do Supabase
            if (error) {
                console.error('Erro ao buscar usuário:', error);
                
                // Erro de tabela não encontrada
                if (error.code === '42P01') {
                    return res.status(500).json({
                        status: 'error',
                        message: 'Tabela users não encontrada no banco de dados. Verifique a configuração do Supabase.'
                    });
                }
                
                // Erro de permissão (RLS)
                if (error.code === '42501' || error.message?.includes('permission denied')) {
                    return res.status(500).json({
                        status: 'error',
                        message: 'Erro de permissão no banco de dados. Verifique as políticas RLS no Supabase.'
                    });
                }
                
                // Usuário não encontrado (PGRST116 é o código quando .single() não encontra nada)
                if (error.code === 'PGRST116') {
                    return res.status(401).json({
                        status: 'error',
                        message: 'Credenciais inválidas'
                    });
                }
                
                // Outros erros
                throw error;
            }

            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Credenciais inválidas'
                });
            }

            // Verificar se o usuário tem password_hash
            if (!user.password_hash) {
                console.error('Usuário sem password_hash encontrado:', user.id);
                return res.status(500).json({
                    status: 'error',
                    message: 'Erro na configuração do usuário. Contate o suporte.'
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
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
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
            console.error('Detalhes do erro:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            res.status(500).json({
                status: 'error',
                message: error.message || 'Erro interno do servidor',
                ...(process.env.NODE_ENV === 'development' && { 
                    details: error.message,
                    code: error.code 
                })
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