import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { formatPrice } from '../../utils/helpers'
import LoadingSpinner from '../common/LoadingSpinner'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [addingToCart, setAddingToCart] = useState(false)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      alert('Por favor, faça login para adicionar itens ao carrinho')
      return
    }

    setAddingToCart(true)
    await addToCart(product.id, 1)
    setAddingToCart(false)
  }

  return (
    <div className="product-card group">
      <Link to={`/products/${product.id}`} className="block">
        {/* Imagem do Produto */}
        <div className="relative overflow-hidden bg-gray-200">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400'}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Badge de Estoque */}
          {product.stock_quantity === 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              Esgotado
            </div>
          )}
        </div>

        {/* Informações do Produto */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-evolv-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400">
              {'★'.repeat(5)}
            </div>
            <span className="text-gray-500 text-sm ml-1">
              ({product.review_count || 0})
            </span>
          </div>

          {/* Preço e Ação */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-evolv-primary">
                {formatPrice(product.price)}
              </span>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock_quantity === 0}
              className="bg-evolv-primary hover:bg-evolv-secondary text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={product.stock_quantity === 0 ? 'Produto esgotado' : 'Adicionar ao carrinho'}
            >
              {addingToCart ? (
                <LoadingSpinner size="small" text="" />
              ) : (
                <span className="text-sm">🛒</span>
              )}
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard