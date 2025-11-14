import axios from 'axios'

// ✅ URL base correta para desenvolvimento
const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // ✅ Configuração para lidar com credenciais
  withCredentials: false
})

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('evolv_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // ✅ Log para debug
    console.log(`🔄 Fazendo request para: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Erro no request:', error)
    return Promise.reject(error)
  }
)

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response recebido: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ Erro na response:', error.response?.status, error.config?.url)
    
    if (error.response?.status === 401) {
      localStorage.removeItem('evolv_token')
      // Não redirecionar automaticamente para evitar loops
      console.log('🔐 Token inválido, removido do localStorage')
    }
    
    return Promise.reject(error)
  }
)

// Serviços de produtos
export const productService = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  getCategories: () => api.get('/products/categories')
}

// Serviços do carrinho
export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity) => api.post('/cart', { product_id: productId, quantity }),
  updateCartItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart')
}

// Serviços de pedidos
export const orderService = {
  create: (orderData) => api.post('/orders', orderData),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`)
}

// Serviços de usuário
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  changePassword: (passwordData) => api.put('/users/password', passwordData)
}

// Serviços de autenticação
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData)
}

export default api