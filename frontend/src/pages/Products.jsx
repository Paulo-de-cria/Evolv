import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productService } from '../services/api'
import ProductGrid from '../components/products/ProductGrid'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Products = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  })

  useEffect(() => {
    loadCategories()
    loadProducts()
  }, [filters])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const params = {
        category: filters.category,
        search: filters.search,
        min_price: filters.minPrice,
        max_price: filters.maxPrice,
        sort_by: filters.sortBy,
        sort_order: filters.sortOrder
      }

      // Remove empty params
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key]
      })

      const response = await productService.getAll(params)
      setProducts(response.data.products)
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await productService.getCategories()
      setCategories(response.data.categories)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // Update URL params
    const newSearchParams = new URLSearchParams()
    Object.keys(newFilters).forEach(filterKey => {
      if (newFilters[filterKey]) {
        newSearchParams.set(filterKey, newFilters[filterKey])
      }
    })
    setSearchParams(newSearchParams)
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    })
    setSearchParams({})
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nossos Produtos
          </h1>
          <p className="text-gray-600">
            Descubra nossa linha completa de suplementos de alta qualidade
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Busca */}
            <div>
              <label className="form-label">Buscar</label>
              <input
                type="text"
                placeholder="Nome do produto..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="form-input"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="form-label">Categoria</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="form-input"
              >
                <option value="">Todas</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Preço Mínimo */}
            <div>
              <label className="form-label">Preço Mín.</label>
              <input
                type="number"
                placeholder="R$ 0,00"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="form-input"
              />
            </div>

            {/* Preço Máximo */}
            <div>
              <label className="form-label">Preço Máx.</label>
              <input
                type="number"
                placeholder="R$ 100,00"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="form-input"
              />
            </div>

            {/* Ordenação */}
            <div>
              <label className="form-label">Ordenar por</label>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-')
                  handleFilterChange('sortBy', sortBy)
                  handleFilterChange('sortOrder', sortOrder)
                }}
                className="form-input"
              >
                <option value="created_at-desc">Mais Recentes</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
                <option value="name-asc">Nome A-Z</option>
                <option value="rating-desc">Melhor Avaliados</option>
              </select>
            </div>
          </div>

          {/* Botão Limpar Filtros */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="btn-secondary"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* Resultados */}
        <div>
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="mb-4 text-gray-600">
                {products.length} produto(s) encontrado(s)
              </div>
              <ProductGrid products={products} />
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Tente ajustar os filtros ou termos de busca
              </p>
              <button
                onClick={clearFilters}
                className="btn-primary"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products