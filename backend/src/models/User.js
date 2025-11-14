const supabase = require('../config/supabase');

class User {
    // Buscar usuário por ID
    static async findById(id) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    // Buscar usuário por email
    static async findByEmail(email) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    // Criar novo usuário
    static async create(userData) {
        const { data, error } = await supabase
            .from('users')
            .insert([userData])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Atualizar usuário
    static async update(id, updateData) {
        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Verificar se email já existe
    static async emailExists(email) {
        const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return !!data;
    }

    // Buscar usuários com paginação (admin)
    static async findAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        const { data, error, count } = await supabase
            .from('users')
            .select('id, name, email, fitness_goals, created_at', { count: 'exact' })
            .range(offset, offset + limit - 1)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return {
            users: data,
            pagination: {
                current_page: page,
                total_pages: Math.ceil(count / limit),
                total_users: count,
                users_per_page: limit
            }
        };
    }
}

module.exports = User;