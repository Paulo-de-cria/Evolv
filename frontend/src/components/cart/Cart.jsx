import React from 'react'
import { useCart } from '../../context/CartContext'
import CartItem from './CartItem'
import LoadingSpinner from '../common/LoadingSpinner'

const Cart = () => {
  const { cart, loading, getCartTotal, getCartItemCount } = useCart()

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Seu carrinho está vazio
        </h2>
        <p className="text-gray-600">
          Adicione alguns produtos incríveis ao seu carrinho!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-card">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">
          Meu Carrinho ({getCartItemCount()} {getCartItemCount() === 1 ? 'item' : 'itens'})
        </h2>
      </div>

      <div className="divide-y">
        {cart.map(item => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="p-6 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Subtotal:</span>
          <span className="text-xl font-bold text-evolv-primary">
            R$ {getCartTotal().toFixed(2)}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 text-center mb-4">
          Frete e descontos calculados no checkout
        </p>
        
        <button className="btn-primary w-full text-lg py-3">
          Finalizar Compra
        </button>
      </div>
    </div>
  )
}

export default Cart