const supabase = require('../config/supabase');

class OrderItem {
    // Buscar itens do pedido
    static async findByOrderId(orderId) {
        const { data, error } = await supabase
            .from('order_items')
            .select(`
                *,
                products (
                    name,
                    image_url,
                    description
                )
            `)
            .eq('order_id', orderId);

        if (error) throw error;
        return data;
    }

    // Criar item do pedido
    static async create(itemData) {
        const { data, error } = await supabase
            .from('order_items')
            .insert([itemData])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Criar múltiplos itens
    static async createMultiple(itemsData) {
        const { data, error } = await supabase
            .from('order_items')
            .insert(itemsData)
            .select();

        if (error) throw error;
        return data;
    }

    // Calcular total do pedido
    static async calculateOrderTotal(orderId) {
        const { data, error } = await supabase
            .from('order_items')
            .select('quantity, unit_price')
            .eq('order_id', orderId);

        if (error) throw error;

        const total = data.reduce((sum, item) => {
            return sum + (item.quantity * item.unit_price);
        }, 0);

        return total;
    }
}

module.exports = OrderItem;