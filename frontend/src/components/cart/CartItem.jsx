import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/helpers'
import LoadingSpinner from '../common/LoadingSpinner'

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart()
  const [updating, setUpdating] = useState(false)
  const [removing, setRemoving] = useState(false)

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return
    
    setUpdating(true)
    await updateCartItem(item.id, newQuantity)
    setUpdating(false)
  }

  const handleRemove = async () => {
    setRemoving(true)
    await removeFromCart(item.id)
    setRemoving(false)
  }

  // Verificar se item e produto existem
  if (!item || !item.products) {
    return null
  }

  const product = item.products
  const productId = product.id || item.product_id
  const productName = product.name || 'Produto'
  const productPrice = product.price || 0
  const productImage = product.image_url || 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=100'
  const quantity = item.quantity || 0

  return (
    <div className="p-6 flex items-center space-x-4">
      {/* Imagem do Produto */}
      {productId && (
        <Link 
          to={`/products/${productId}`}
          className="flex-shrink-0"
        >
          <img
            src={productImage}
            alt={productName}
            className="w-16 h-16 object-cover rounded-lg"
          />
        </Link>
      )}

      {/* Informações do Produto */}
      <div className="flex-grow">
        {productId ? (
          <Link 
            to={`/products/${productId}`}
            className="font-medium text-gray-900 hover:text-evolv-primary"
          >
            {productName}
          </Link>
        ) : (
          <span className="font-medium text-gray-900">
            {productName}
          </span>
        )}
        <p className="text-sm text-gray-600 mt-1">
          {formatPrice(productPrice)} cada
        </p>
        
        {/* Seletor de Quantidade */}
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-sm text-gray-600">Quantidade:</span>
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={updating || quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              -
            </button>
            <span className="w-8 h-8 flex items-center justify-center text-sm font-medium">
              {updating ? <LoadingSpinner size="small" text="" /> : quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={updating}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Preço Total e Ações */}
      <div className="text-right">
        <div className="font-semibold text-lg mb-2">
          {formatPrice(productPrice * quantity)}
        </div>
        
        <button
          onClick={handleRemove}
          disabled={removing}
          className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
        >
          {removing ? 'Removendo...' : 'Remover'}
        </button>
      </div>
    </div>
  )
}

export default CartItem