const supabase = require('../config/supabase');

class Product {
    // Buscar produto por ID
    static async findById(id) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    // Buscar todos os produtos com filtros
    static async findAll(filters = {}) {
        const {
            page = 1,
            limit = 12,
            category,
            search,
            min_price,
            max_price,
            sort_by = 'created_at',
            sort_order = 'desc'
        } = filters;

        const offset = (page - 1) * limit;

        let query = supabase
            .from('products')
            .select('*', { count: 'exact' });

        // Aplicar filtros
        if (category) {
            query = query.eq('category', category);
        }

        if (search) {
            query = query.ilike('name', `%${search}%`);
        }

        if (min_price) {
            query = query.gte('price', parseFloat(min_price));
        }

        if (max_price) {
            query = query.lte('price', parseFloat(max_price));
        }

        // Aplicar ordenação e paginação
        const { data, error, count } = await query
            .order(sort_by, { ascending: sort_order === 'asc' })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        return {
            products: data,
            pagination: {
                current_page: page,
                total_pages: Math.ceil(count / limit),
                total_products: count,
                products_per_page: limit
            }
        };
    }

    // Criar produto
    static async create(productData) {
        const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Atualizar produto
    static async update(id, updateData) {
        const { data, error } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Deletar produto
    static async delete(id) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }

    // Buscar produtos por categoria
    static async findByCategory(category) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category', category)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }

    // Obter categorias únicas
    static async getCategories() {
        const { data, error } = await supabase
            .from('products')
            .select('category')
            .not('category', 'is', null);

        if (error) throw error;

        const categories = [...new Set(data.map(item => item.category))];
        return categories;
    }

    // Atualizar estoque
    static async updateStock(id, quantity) {
        const { data, error } = await supabase
            .from('products')
            .update({ stock_quantity: quantity })
            .eq('id', id)
            .select('stock_quantity')
            .single();

        if (error) throw error;
        return data;
    }

    // Buscar produtos em destaque
    static async getFeaturedProducts(limit = 8) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .gte('stock_quantity', 1)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data;
    }
}

module.exports = Product;