const supabase = require('../config/supabase');

const cartController = {
    // Obter carrinho do usuário
    getCart: async (req, res) => {
        try {
            const userId = req.userId;

            const { data: cartItems, error } = await supabase
                .from('cart_items')
                .select(`
                    id,
                    quantity,
                    products (
                        id,
                        name,
                        price,
                        image_url,
                        stock_quantity
                    )
                `)
                .eq('user_id', userId);

            if (error) throw error;

            // Calcular total
            const total = cartItems.reduce((sum, item) => {
                return sum + (item.products.price * item.quantity);
            }, 0);

            res.json({
                status: 'success',
                data: {
                    items: cartItems,
                    total: parseFloat(total.toFixed(2)),
                    item_count: cartItems.length
                }
            });

        } catch (error) {
            console.error('Erro ao buscar carrinho:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro interno do servidor'
            });
        }
    },

    // Adicionar item ao carrinho
    addToCart: async (req, res) => {
        try {
            const userId = req.userId;
            const { product_id, quantity = 1 } = req.body;

            // Verificar se produto existe
            const { data: product, error: productError } = await supabase
                .from('products')
                .select('id, stock_quantity')
                .eq('id', product_id)
                .single();

            if (productError || !product) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Produto não encontrado'
                });
            }

            // Verificar estoque
            if (product.stock_quantity < quantity) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Quantidade solicitada indisponível em estoque'
                });
            }

            // Verificar se item já está no carrinho
            const { data: existingItem, error: cartError } = await supabase
                .from('cart_items')
                .select('id, quantity')
                .eq('user_id', userId)
                .eq('product_id', product_id)
                .single();

            let result;
            if (existingItem) {
                // Atualizar quantidade
                result = await supabase
                    .from('cart_items')
                    .update({
                        quantity: existingItem.quantity + quantity,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingItem.id)
                    .select()
                    .single();
            } else {
                // Adicionar novo item
                result = await supabase
                    .from('cart_items')
                    .insert([
                        {
                            user_id: userId,
                            product_id,
                            quantity,
                            created_at: new Date().toISOString()
                        }
                    ])
                    .select()
                    .single();
            }

            if (result.error) throw result.error;

            res.json({
                status: 'success',
                message: 'Item adicionado ao carrinho!',
                data: { cart_item: result.data }
            });

        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro interno do servidor'
            });
        }
    },

    // Atualizar quantidade no carrinho
    updateCartItem: async (req, res) => {
        try {
            const userId = req.userId;
            const { item_id } = req.params;
            const { quantity } = req.body;

            if (quantity < 1) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Quantidade deve ser maior que 0'
                });
            }

            // Verificar se item pertence ao usuário
            const { data: cartItem, error: checkError } = await supabase
                .from('cart_items')
                .select('product_id')
                .eq('id', item_id)
                .eq('user_id', userId)
                .single();

            if (checkError || !cartItem) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Item do carrinho não encontrado'
                });
            }

            // Verificar estoque
            const { data: product } = await supabase
                .from('products')
                .select('stock_quantity')
                .eq('id', cartItem.product_id)
                .single();

            if (product.stock_quantity < quantity) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Quantidade solicitada indisponível em estoque'
                });
            }

            // Atualizar quantidade
            const { data: updatedItem, error } = await supabase
                .from('cart_items')
                .update({
                    quantity,
                    updated_at: new Date().toISOString()
                })
                .eq('id', item_id)
                .select()
                .single();

            if (error) throw error;

            res.json({
                status: 'success',
                message: 'Carrinho atualizado!',
                data: { cart_item: updatedItem }
            });

        } catch (error) {
            console.error('Erro ao atualizar carrinho:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro interno do servidor'
            });
        }
    },

    // Remover item do carrinho
    removeFromCart: async (req, res) => {
        try {
            const userId = req.userId;
            const { item_id } = req.params;

            const { error } = await supabase
                .from('cart_items')
                .delete()
                .eq('id', item_id)
                .eq('user_id', userId);

            if (error) throw error;

            res.json({
                status: 'success',
                message: 'Item removido do carrinho!'
            });

        } catch (error) {
            console.error('Erro ao remover do carrinho:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro interno do servidor'
            });
        }
    },

    // Limpar carrinho
    clearCart: async (req, res) => {
        try {
            const userId = req.userId;

            const { error } = await supabase
                .from('cart_items')
                .delete()
                .eq('user_id', userId);

            if (error) throw error;

            res.json({
                status: 'success',
                message: 'Carrinho limpo!'
            });

        } catch (error) {
            console.error('Erro ao limpar carrinho:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro interno do servidor'
            });
        }
    }
};

module.exports = cartController;