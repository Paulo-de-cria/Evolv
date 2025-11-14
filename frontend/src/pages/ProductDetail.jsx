import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { productService } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/helpers'
import LoadingSpinner from '../components/common/LoadingSpinner'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [selectedQuantity, setSelectedQuantity] = useState(1)

  useEffect(() => {
    loadProduct()
  }, [id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const response = await productService.getById(id)
      setProduct(response.data.product)
    } catch (error) {
      console.error('Erro ao carregar produto:', error)
      navigate('/products')
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
      // Feedback visual de sucesso
      setAddingToCart(false)
    } else {
      alert(result.message)
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h2>
          <Link to="/products" className="btn-primary">
            Voltar para Produtos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="fade-in">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link to="/" className="text-evolv-primary hover:underline">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/products" className="text-evolv-primary hover:underline">Produtos</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
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
        <div className="bg-white rounded-lg shadow-card p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Detalhes do Produto</h2>
          
          {product.ingredients && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Ingredientes</h3>
              <p className="text-gray-600">{product.ingredients}</p>
            </div>
          )}

          {product.benefits && Array.isArray(product.benefits) && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Benefícios</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {product.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Produtos Relacionados (placeholder) */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-2xl font-bold mb-4">Produtos Relacionados</h2>
          <p className="text-gray-600 text-center py-8">
            Carregando produtos relacionados...
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail