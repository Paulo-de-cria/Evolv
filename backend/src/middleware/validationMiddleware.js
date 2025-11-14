const Joi = require('joi');

const validationMiddleware = {
    // Validação de registro de usuário
    validateRegister: (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().min(2).max(100).required()
                .messages({
                    'string.empty': 'Nome é obrigatório',
                    'string.min': 'Nome deve ter pelo menos 2 caracteres',
                    'string.max': 'Nome deve ter no máximo 100 caracteres'
                }),
            email: Joi.string().email().required()
                .messages({
                    'string.email': 'Email deve ser válido',
                    'string.empty': 'Email é obrigatório'
                }),
            password: Joi.string().min(6).required()
                .messages({
                    'string.min': 'Senha deve ter pelo menos 6 caracteres',
                    'string.empty': 'Senha é obrigatória'
                }),
            fitness_goals: Joi.string().max(500).optional()
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 'error',
                message: error.details[0].message
            });
        }

        next();
    },

    // Validação de login
    validateLogin: (req, res, next) => {
        const schema = Joi.object({
            email: Joi.string().email().required()
                .messages({
                    'string.email': 'Email deve ser válido',
                    'string.empty': 'Email é obrigatório'
                }),
            password: Joi.string().required()
                .messages({
                    'string.empty': 'Senha é obrigatória'
                })
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 'error',
                message: error.details[0].message
            });
        }

        next();
    },

    // Validação de criação de produto
    validateProduct: (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().min(2).max(200).required()
                .messages({
                    'string.empty': 'Nome do produto é obrigatório',
                    'string.min': 'Nome deve ter pelo menos 2 caracteres'
                }),
            description: Joi.string().max(1000).optional(),
            price: Joi.number().min(0).required()
                .messages({
                    'number.min': 'Preço deve ser maior ou igual a 0',
                    'number.base': 'Preço deve ser um número válido'
                }),
            category: Joi.string().max(100).required()
                .messages({
                    'string.empty': 'Categoria é obrigatória'
                }),
            stock_quantity: Joi.number().integer().min(0).default(0),
            image_url: Joi.string().uri().optional(),
            ingredients: Joi.string().max(500).optional(),
            benefits: Joi.array().items(Joi.string()).optional()
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 'error',
                message: error.details[0].message
            });
        }

        next();
    },

    // Validação de pedido
    validateOrder: (req, res, next) => {
        const schema = Joi.object({
            items: Joi.array().items(
                Joi.object({
                    product_id: Joi.number().integer().positive().required(),
                    quantity: Joi.number().integer().positive().required(),
                    unit_price: Joi.number().positive().required()
                })
            ).min(1).required()
                .messages({
                    'array.min': 'Pedido deve conter pelo menos um item'
                }),
            shipping_address: Joi.string().min(10).max(500).required()
                .messages({
                    'string.empty': 'Endereço de entrega é obrigatório',
                    'string.min': 'Endereço deve ter pelo menos 10 caracteres'
                }),
            payment_method: Joi.string().valid('credit_card', 'debit_card', 'pix', 'boleto').required()
                .messages({
                    'any.only': 'Método de pagamento deve ser: credit_card, debit_card, pix ou boleto'
                })
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 'error',
                message: error.details[0].message
            });
        }

        next();
    },

    // Validação de carrinho
    validateCart: (req, res, next) => {
        const schema = Joi.object({
            product_id: Joi.number().integer().positive().required()
                .messages({
                    'number.positive': 'ID do produto deve ser válido'
                }),
            quantity: Joi.number().integer().positive().default(1)
                .messages({
                    'number.positive': 'Quantidade deve ser maior que 0'
                })
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 'error',
                message: error.details[0].message
            });
        }

        next();
    }
};

module.exports = validationMiddleware;