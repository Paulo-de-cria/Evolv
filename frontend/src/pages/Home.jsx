import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../services/api'
import ProductGrid from '../components/products/ProductGrid'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const response = await productService.getAll({ limit: 8 })
        // Corrigir estrutura de resposta: backend retorna { status, data: { products } }
        const products = response.data?.data?.products || response.data?.products || []
        setFeaturedProducts(products)
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
        setFeaturedProducts([]) // Garantir que não seja undefined
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedProducts()
  }, [])

  const categories = [
    {
      name: 'Proteína e aminoácidos',
      description: 'Suplementos proteicos para crescimento muscular',
      image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=300',
      link: '/products?category=Proteína+e+aminoácidos'
    },
    {
      name: 'Vitaminas e minerais',
      description: 'Vitaminas essenciais para saúde',
      image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=300',
      link: '/products?category=Vitaminas+e+minerais'
    },
    {
      name: 'Controle de peso',
      description: 'Suplementos para emagrecimento',
      image: 'https://images.unsplash.com/photo-1510686959744-5ae3b1f924f1?w=300',
      link: '/products?category=Controle+de+peso'
    }
  ]

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Evolua seu <span className="text-yellow-300">Potencial</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Suplementos premium para sua evolução fitness
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/products" 
              className="btn bg-white text-evolv-primary hover:bg-gray-100 font-semibold text-lg px-8 py-3"
            >
              Explorar Produtos
            </Link>
            <Link 
              to="/consultoria" 
              className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-evolv-primary font-semibold text-lg px-8 py-3"
            >
              Consultoria Fitly
            </Link>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Explore por Categoria
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link 
                key={category.name}
                to={category.link}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-card overflow-hidden transition-all duration-300 group-hover:shadow-card-hover">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {category.description}
                    </p>
                    <span className="text-evolv-primary font-medium group-hover:underline">
                      Ver produtos →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Produtos em Destaque
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubra nossa seleção premium de suplementos para maximizar seus resultados
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <ProductGrid products={featuredProducts} />
          )}

          <div className="text-center mt-12">
            <Link 
              to="/products" 
              className="btn-primary text-lg px-8 py-3"
            >
              Ver Todos os Produtos
            </Link>
          </div>
        </div>
      </section>

      {/* Consultoria Fitly */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-primary rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Consultoria Especializada Fitly
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Planos personalizados com nutricionistas certificados para otimizar sua jornada fitness
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn bg-white text-evolv-primary hover:bg-gray-100 font-semibold text-lg px-8 py-3">
                Conhecer Planos
              </button>
              <button className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-evolv-primary font-semibold text-lg px-8 py-3">
                Falar com Especialista
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home