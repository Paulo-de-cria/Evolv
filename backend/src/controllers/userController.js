const supabase = require('../config/supabase');

const userController = {
    // Obter perfil do usuário
    getUserProfile: async (req, res) => {
        try {
            const userId = req.userId;

            const { data: user, error } = await supabase
                .from('users')
                .select('id, name, email, fitness_goals, created_at, updated_at')
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
    updateUserProfile: async (req, res) => {
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
    },

    // Alterar senha do usuário
    changePassword: async (req, res) => {
        try {
            const userId = req.userId;
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Senha atual e nova senha são obrigatórias'
                });
            }

            // Buscar usuário com senha
            const { data: user, error } = await supabase
                .from('users')
                .select('password_hash')
                .eq('id', userId)
                .single();

            if (error || !user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuário não encontrado'
                });
            }

            // Verificar senha atual
            const bcrypt = require('bcryptjs');
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
            
            if (!isCurrentPasswordValid) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Senha atual incorreta'
                });
            }

            // Hash da nova senha
            const hashedNewPassword = await bcrypt.hash(newPassword, 12);

            // Atualizar senha
            await supabase
                .from('users')
                .update({
                    password_hash: hashedNewPassword,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            res.json({
                status: 'success',
                message: 'Senha alterada com sucesso!'
            });

        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro interno do servidor'
            });
        }
    }
};

module.exports = userController;