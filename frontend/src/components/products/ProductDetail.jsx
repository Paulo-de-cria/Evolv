import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productService } from '../../services/api'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { formatPrice } from '../../utils/helpers'
import LoadingSpinner from '../common/LoadingSpinner'

const ProductDetail = ({ productId }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    loadProduct()
  }, [id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const response = await productService.getById(id || productId)
      setProduct(response.data.product)
    } catch (error) {
      console.error('Erro ao carregar produto:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setAddingToCart(true)
    const result = await addToCart(product.id, selectedQuantity)
    
    if (result.success) {
      // Feedback visual de sucesso poderia ser adicionado aqui
      console.log('Produto adicionado ao carrinho!')
    } else {
      alert(result.message)
    }
    setAddingToCart(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h2>
        <button 
          onClick={() => navigate('/products')}
          className="btn-primary"
        >
          Voltar para Produtos
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Imagem do Produto */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500'}
            alt={product.name}
            className="w-full h-80 object-cover rounded-lg"
          />
        </div>

        {/* Informações do Produto */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {'★'.repeat(5)}
            </div>
            <span className="text-gray-600">
              {product.rating || '4.8'} ({product.review_count || 1345} reviews)
            </span>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-evolv-primary">
              {formatPrice(product.price)}
            </span>
            {product.stock_quantity > 0 ? (
              <span className="ml-4 text-green-600 font-medium">
                ✓ Em estoque
              </span>
            ) : (
              <span className="ml-4 text-red-600 font-medium">
                ✗ Fora de estoque
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description}
          </p>

          {/* Seletor de Quantidade */}
          <div className="mb-6">
            <label className="form-label">Quantidade</label>
            <div className="flex items-center">
              <button
                onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                className="btn-secondary w-10 h-10 flex items-center justify-center"
              >
                -
              </button>
              <span className="mx-4 text-lg font-semibold">
                {selectedQuantity}
              </span>
              <button
                onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                className="btn-secondary w-10 h-10 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock_quantity === 0}
              className="btn-primary flex-1 flex items-center justify-center"
            >
              {addingToCart ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Adicionando...</span>
                </>
              ) : (
                <>
                  🛒 Adicionar ao Carrinho
                </>
              )}
            </button>
            
            <button className="btn-outline flex-1">
              💖 Favoritar
            </button>
          </div>

          {/* Informações de Entrega */}
          <div className="border-t pt-4">
            <div className="flex items-center text-green-600 mb-2">
              <span className="mr-2">🚚</span>
              <span className="font-medium">Entrega Grátis</span>
            </div>
            <p className="text-sm text-gray-600">
              Para compras acima de R$ 100,00
            </p>
          </div>
        </div>
      </div>

      {/* Detalhes do Produto */}
      <div className="bg-white rounded-lg shadow-card">
        {/* Tabs */}
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'description'
                  ? 'text-evolv-primary border-b-2 border-evolv-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Descrição
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'ingredients'
                  ? 'text-evolv-primary border-b-2 border-evolv-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ingredientes
            </button>
            <button
              onClick={() => setActiveTab('benefits')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'benefits'
                  ? 'text-evolv-primary border-b-2 border-evolv-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Benefícios
            </button>
          </nav>
        </div>

        {/* Conteúdo das Tabs */}
        <div className="p-6">
          {activeTab === 'description' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Descrição do Produto</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || 'Descrição detalhada do produto...'}
              </p>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Ingredientes</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.ingredients || 'Lista de ingredientes do produto...'}
              </p>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Benefícios</h3>
              {product.benefits && Array.isArray(product.benefits) ? (
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  {product.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Benefícios do produto...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail