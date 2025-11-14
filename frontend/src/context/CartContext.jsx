import React, { createContext, useState, useContext, useEffect } from 'react'
import { cartService } from '../services/api'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)

  const loadCart = async () => {
    try {
      setLoading(true)
      const response = await cartService.getCart()
      setCart(response.data.items || [])
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    try {
      await cartService.addToCart(productId, quantity)
      await loadCart()
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao adicionar ao carrinho' 
      }
    }
  }

  const updateCartItem = async (itemId, quantity) => {
    try {
      await cartService.updateCartItem(itemId, quantity)
      await loadCart()
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao atualizar carrinho' 
      }
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      await cartService.removeFromCart(itemId)
      await loadCart()
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao remover do carrinho' 
      }
    }
  }

  const clearCart = async () => {
    try {
      await cartService.clearCart()
      setCart([])
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao limpar carrinho' 
      }
    }
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.products.price * item.quantity)
    }, 0)
  }

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  useEffect(() => {
    loadCart()
  }, [])

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart,
    getCartTotal,
    getCartItemCount
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}