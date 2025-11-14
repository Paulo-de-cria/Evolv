const supabase = require('../config/supabase');

const productController = {
    // Listar todos os produtos com paginação e filtros
    getAllProducts: async (req, res) => {
        try {
            const {
                page = 1,
                limit = 12,
                category,
                search,
                min_price,
                max_price,
                sort_by = 'created_at',
                sort_order = 'desc'
            } = req.query;

            const offset = (page - 1) * limit;

            // Construir query base
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
            query = query
                .order(sort_by, { ascending: sort_order === 'asc' })
                .range(offset, offset + limit - 1);

            const { data: products, error, count } = await query;

            if (error) throw error;

            res.json({
                status: 'success',
                data: {
                    products,
                    pagination: {
                        current_page: parseInt(page),
                        total_pages: Math.ceil(count / limit),
                        total_products: count,
                        products_per_page: parseInt(limit)
                    }
                }
            });

        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro interno do servidor'
            });
        }
    },

    // Obter produto por ID
    getProductById: async (req, res) => {
        try {
            const { id } = req.params;

            const { data: product, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !product) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Produto não encontrado'
                });
            }

            res.json({
                status: 'success',
                data: { product }
            });

        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro interno do servidor'
            });
        }
    },

    // Criar novo produto (admin)
    createProduct: async (req, res) => {
        try {
            const {
                name,
                description,
                price,
                category,
                stock_quantity,
                image_url,
                ingredients,
                benefits
            } = req.body;

            // Validar campos obrigatórios
            if (!name || !price || !category) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Nome, preço e categoria são obrigatórios'
                });
            }

            const { data: product, error } = await supabase
                .from('products')
                .insert([
                    {
                        name,
                        description,
                        price: parseFloat(price),
                        category,
                        stock_quantity: parseInt(stock_quantity) || 0,
                        image_url,
                        ingredients,
                        benefits,
                        created_at: new Date().toISOString()
                    }
                ])
                .select()
                .single();

            if (error) throw error;

            res.status(201).json({
                status: 'success',
                message: 'Produto criado com sucesso!',
                data: { product }
            });

        } catch (error) {
            console.error('Erro ao criar produto:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro interno do servidor'
            });
        }
    },

    // Atualizar produto (admin)
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // Verificar se produto existe
            const { data: existingProduct, error: checkError } = await supabase
                .from('products')
                .select('id')
                .eq('id', id)
                .single();

            if (checkError || !existingProduct) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Produto não encontrado'
                });
            }

            // Atualizar produto
            const { data: product, error } = await supabase
                .from('products')
                .update({
                    ...updateData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            res.json({
                status: 'success',
                message: 'Produto atualizado com sucesso!',
                data: { product }
            });

        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro interno do servidor'
            });
        }
    },

    // Deletar produto (admin)
    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;

            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            res.json({
                status: 'success',
                message: 'Produto deletado com sucesso!'
            });

        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro interno do servidor'
            });
        }
    },

    // Buscar produtos por categoria
    getProductsByCategory: async (req, res) => {
        try {
            const { category } = req.params;

            const { data: products, error } = await supabase
                .from('products')
                .select('*')
                .eq('category', category)
                .order('created_at', { ascending: false });

            if (error) throw error;

            res.json({
                status: 'success',
                data: { products }
            });

        } catch (error) {
            console.error('Erro ao buscar produtos por categoria:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro interno do servidor'
            });
        }
    },

    // Obter categorias disponíveis
    getCategories: async (req, res) => {
        try {
            const { data: categories, error } = await supabase
                .from('products')
                .select('category')
                .not('category', 'is', null);

            if (error) throw error;

            // Extrair categorias únicas
            const uniqueCategories = [...new Set(categories.map(item => item.category))];

            res.json({
                status: 'success',
                data: { categories: uniqueCategories }
            });

        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro interno do servidor'
            });
        }
    }
};

module.exports = productController;