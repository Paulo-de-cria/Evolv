const supabase = require('../config/supabase');

const orderController = {
    // Criar novo pedido
    createOrder: async (req, res) => {
        try {
            const userId = req.userId;
            const { items, shipping_address, payment_method } = req.body;

            // Validar dados
            if (!items || !items.length) {
                return res.status(400).json({
                    status: 'error',
                    message: 'O pedido deve conter pelo menos um item'
                });
            }

            // Calcular total
            let total = 0;
            for (const item of items) {
                const { data: product } = await supabase
                    .from('products')
                    .select('price')
                    .eq('id', item.product_id)
                    .single();

                if (!product) {
                    return res.status(404).json({
                        status: 'error',
                        message: `Produto com ID ${item.product_id} não encontrado`
                    });
                }

                total += product.price * item.quantity;
            }

            // Criar pedido
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert([
                    {
                        user_id: userId,
                        total_amount: total,
                        status: 'pending',
                        shipping_address,
                        payment_method,
                        created_at: new Date().toISOString()
                    }
                ])
                .select()
                .single();

            if (orderError) throw orderError;

            // Adicionar itens do pedido
            const orderItems = items.map(item => ({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // Atualizar estoque dos produtos
            for (const item of items) {
                await supabase
                    .from('products')
                    .update({ 
                        stock_quantity: supabase.sql`stock_quantity - ${item.quantity}` 
                    })
                    .eq('id', item.product_id);
            }

            res.status(201).json({
                status: 'success',
                message: 'Pedido criado com sucesso!',
                data: { order }
            });

        } catch (error) {
            console.error('Erro ao criar pedido:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro interno do servidor'
            });
        }
    },

    // Obter pedidos do usuário
    getUserOrders: async (req, res) => {
        try {
            const userId = req.userId;

            const { data: orders, error } = await supabase
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
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            res.json({
                status: 'success',
                data: { orders }
            });

        } catch (error) {
            console.error('Erro ao buscar pedidos:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro interno do servidor'
            });
        }
    },

    // Obter pedido específico
    getOrderById: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.userId;

            const { data: order, error } = await supabase
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
                .eq('user_id', userId)
                .single();

            if (error || !order) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Pedido não encontrado'
                });
            }

            res.json({
                status: 'success',
                data: { order }
            });

        } catch (error) {
            console.error('Erro ao buscar pedido:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro interno do servidor'
            });
        }
    },

    // Atualizar status do pedido (admin)
    updateOrderStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Status inválido'
                });
            }

            const { data: order, error } = await supabase
                .from('orders')
                .update({ 
                    status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            res.json({
                status: 'success',
                message: 'Status do pedido atualizado com sucesso!',
                data: { order }
            });

        } catch (error) {
            console.error('Erro ao atualizar pedido:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro interno do servidor'
            });
        }
    }
};

module.exports = orderController;