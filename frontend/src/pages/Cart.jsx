import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/helpers'
import CartItem from '../components/cart/CartItem'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Cart = () => {
  const { cart, loading, getCartTotal, getCartItemCount, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    if (cart.length === 0) {
      alert('Seu carrinho está vazio!')
      return
    }

    // Aqui você implementaria o redirecionamento para checkout
    alert('Redirecionando para checkout...')
  }

  const handleClearCart = async () => {
    if (window.confirm('Tem certeza que deseja limpar o carrinho?')) {
      await clearCart()
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Carrinho</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-card p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-600 mb-8">
              Descubra nossos produtos incríveis e comece a adicionar itens ao seu carrinho!
            </p>
            <Link to="/products" className="btn-primary text-lg px-8 py-3">
              Explorar Produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de Itens */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-card">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                      Itens no Carrinho ({getCartItemCount()})
                    </h2>
                    <button
                      onClick={handleClearCart}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Limpar Carrinho
                    </button>
                  </div>
                </div>

                <div className="divide-y">
                  {cart.map(item => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-card p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(getCartTotal())}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frete</span>
                    <span className="font-medium text-green-600">
                      {getCartTotal() > 100 ? 'Grátis' : 'R$ 15,90'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-lg font-semibold border-t pt-3">
                    <span>Total</span>
                    <span className="text-evolv-primary">
                      {formatPrice(getCartTotal() + (getCartTotal() > 100 ? 0 : 15.90))}
                    </span>
                  </div>
                </div>

                {/* Cupom de Desconto */}
                <div className="mb-6">
                  <label className="form-label">Cupom de Desconto</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Digite o cupom"
                      className="form-input flex-1"
                    />
                    <button className="btn-secondary whitespace-nowrap">
                      Aplicar
                    </button>
                  </div>
                </div>

                {/* Botão Finalizar Compra */}
                <button
                  onClick={handleCheckout}
                  className="btn-primary w-full text-lg py-3 mb-4"
                >
                  Finalizar Compra
                </button>

                {/* Benefícios */}
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center">
                    <span className="mr-2">🔒</span>
                    Compra 100% segura
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🚚</span>
                    Entrega para todo Brasil
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">↩️</span>
                    Troca fácil em 30 dias
                  </div>
                </div>
              </div>

              {/* Produtos Sugeridos */}
              <div className="bg-white rounded-lg shadow-card p-6 mt-6">
                <h3 className="font-semibold mb-4">Você também pode gostar</h3>
                <div className="text-center text-gray-600 py-4">
                  <p>Carregando sugestões...</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart