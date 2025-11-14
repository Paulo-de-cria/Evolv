import { useContext } from 'react'
import { CartContext } from '../context/CartContext'

// ✅ Exportação nomeada correta
export function useCart() {
  const context = useContext(CartContext)
  
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider')
  }
  
  return context
}

// ✅ Exportação padrão também
export default useCart