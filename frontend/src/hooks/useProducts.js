import { useState, useEffect } from 'react'
import { productService } from '../services/api'

// ✅ Exportação nomeada correta
export function useProducts(filters = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProducts()
  }, [filters])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await productService.getAll(filters)
      setProducts(response.data.products || [])
    } catch (err) {
      setError('Erro ao carregar produtos')
      console.error('Erro ao carregar produtos:', err)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    loadProducts()
  }

  return {
    products,
    loading,
    error,
    refetch
  }
}

// ✅ Exportação padrão também
export default useProducts