// Formatar preço para Real brasileiro
const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);
};

// Gerar número de pedido único
const generateOrderNumber = () => {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `EVO-${timestamp}${random}`;
};

// Validar email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Calcular total do carrinho
const calculateCartTotal = (items) => {
    return items.reduce((total, item) => {
        return total + (item.products.price * item.quantity);
    }, 0);
};

// Formatar data para exibição
const formatDate = (dateString) => {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
};

// Gerar slug para URLs amigáveis
const generateSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};

// Validar CPF (caso precise no futuro)
const isValidCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    
    return remainder === parseInt(cpf.charAt(10));
};

// Gerar resposta padronizada da API
const apiResponse = (success, message, data = null) => {
    return {
        success,
        message,
        data,
        timestamp: new Date().toISOString()
    };
};

// Paginação helper
const paginate = (array, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
        data: array.slice(startIndex, endIndex),
        pagination: {
            current_page: page,
            total_pages: Math.ceil(array.length / limit),
            total_items: array.length,
            items_per_page: limit,
            has_next: endIndex < array.length,
            has_prev: page > 1
        }
    };
};

// Sanitizar dados (remover campos sensíveis)
const sanitizeUser = (user) => {
    const { password_hash, ...sanitizedUser } = user;
    return sanitizedUser;
};

// Calcular frete simulado (integracao futura com correios)
const calculateShipping = (zipCode, weight, dimensions) => {
    // Simulação de cálculo de frete
    const baseRate = 15.90;
    const weightRate = weight * 0.5;
    const total = baseRate + weightRate;
    
    return {
        sedex: total * 1.5,
        pac: total,
        express: total * 2
    };
};

// Gerar código de rastreamento
const generateTrackingCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'EV';
    for (let i = 0; i < 11; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code + 'BR';
};

module.exports = {
    formatPrice,
    generateOrderNumber,
    isValidEmail,
    calculateCartTotal,
    formatDate,
    generateSlug,
    isValidCPF,
    apiResponse,
    paginate,
    sanitizeUser,
    calculateShipping,
    generateTrackingCode
};