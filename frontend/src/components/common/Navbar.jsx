import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { getCartItemCount } = useCart()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-evolv-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Evolv</span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-evolv-primary font-medium">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-evolv-primary font-medium">
              Produtos
            </Link>
            <Link to="/consultoria" className="text-gray-700 hover:text-evolv-primary font-medium">
              Consultoria
            </Link>
          </div>

          {/* Ícones Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Carrinho */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-evolv-primary">
              🛒
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-evolv-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </Link>

            {/* Perfil ou Login */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-evolv-primary">
                  <span>👤</span>
                  <span className="font-medium">{user?.name}</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-card border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-t-lg"
                  >
                    Meu Perfil
                  </Link>
                  <Link 
                    to="/orders" 
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                  >
                    Meus Pedidos
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-red-600 hover:bg-gray-50 rounded-b-lg"
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-700 hover:text-evolv-primary font-medium">
                  Entrar
                </Link>
                <Link to="/register" className="btn-primary">
                  Cadastrar
                </Link>
              </div>
            )}
          </div>

          {/* Menu Mobile Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span className={`block h-0.5 w-6 bg-gray-700 transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-gray-700 opacity-100 transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-gray-700 transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-evolv-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-gray-700 hover:text-evolv-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Produtos
              </Link>
              <Link 
                to="/consultoria" 
                className="text-gray-700 hover:text-evolv-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Consultoria
              </Link>
              
              <div className="pt-4 border-t">
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/cart" 
                      className="flex items-center space-x-2 text-gray-700 hover:text-evolv-primary py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>🛒 Carrinho</span>
                      {getCartItemCount() > 0 && (
                        <span className="bg-evolv-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {getCartItemCount()}
                        </span>
                      )}
                    </Link>
                    <Link 
                      to="/profile" 
                      className="block text-gray-700 hover:text-evolv-primary py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Meu Perfil
                    </Link>
                    <Link 
                      to="/orders" 
                      className="block text-gray-700 hover:text-evolv-primary py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Meus Pedidos
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="block w-full text-left text-red-600 hover:text-red-700 py-2"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link 
                      to="/login" 
                      className="btn-secondary text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Entrar
                    </Link>
                    <Link 
                      to="/register" 
                      className="btn-primary text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Cadastrar
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar