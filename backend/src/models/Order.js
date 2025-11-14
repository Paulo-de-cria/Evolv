const supabase = require('../config/supabase');

class Order {
    // Buscar pedido por ID
    static async findById(id) {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    quantity,
                    unit_price,
                    products (
                        id,
                        name,
                        image_url,
                        description
                    )
                )
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    // Buscar pedidos do usuário
    static async findByUserId(userId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        const { data, error, count } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    quantity,
                    unit_price,
                    products (
                        name,
                        image_url
                    )
                )
            `, { count: 'exact' })
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        return {
            orders: data,
            pagination: {
                current_page: page,
                total_pages: Math.ceil(count / limit),
                total_orders: count,
                orders_per_page: limit
            }
        };
    }

    // Criar pedido
    static async create(orderData) {
        const { data, error } = await supabase
            .from('orders')
            .insert([orderData])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Atualizar status do pedido
    static async updateStatus(id, status) {
        const { data, error } = await supabase
            .from('orders')
            .update({ 
                status,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Adicionar itens ao pedido
    static async addItems(orderId, items) {
        const orderItems = items.map(item => ({
            order_id: orderId,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price
        }));

        const { data, error } = await supabase
            .from('order_items')
            .insert(orderItems)
            .select();

        if (error) throw error;
        return data;
    }

    // Buscar todos os pedidos (admin)
    static async findAll(page = 1, limit = 10, status = null) {
        const offset = (page - 1) * limit;

        let query = supabase
            .from('orders')
            .select(`
                *,
                users (
                    name,
                    email
                ),
                order_items (
                    quantity,
                    unit_price,
                    products (
                        name
                    )
                )
            `, { count: 'exact' });

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        return {
            orders: data,
            pagination: {
                current_page: page,
                total_pages: Math.ceil(count / limit),
                total_orders: count,
                orders_per_page: limit
            }
        };
    }

    // Estatísticas de pedidos (admin)
    static async getStats() {
        const { data, error } = await supabase
            .from('orders')
            .select('status, total_amount');

        if (error) throw error;

        const stats = {
            total_orders: data.length,
            total_revenue: data.reduce((sum, order) => sum + order.total_amount, 0),
            status_count: {
                pending: data.filter(order => order.status === 'pending').length,
                processing: data.filter(order => order.status === 'processing').length,
                shipped: data.filter(order => order.status === 'shipped').length,
                delivered: data.filter(order => order.status === 'delivered').length,
                cancelled: data.filter(order => order.status === 'cancelled').length
            }
        };

        return stats;
    }
}

module.exports = Order;