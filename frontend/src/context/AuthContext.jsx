import React, { createContext, useState, useContext, useEffect } from 'react'
import { authService } from '../services/auth'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('evolv_token'))

  useEffect(() => {
    if (token) {
      authService.getProfile()
        .then(response => {
          // Corrigir estrutura de resposta: backend retorna { status, data: { user } }
          const userData = response.data?.data?.user || response.data?.user
          if (userData) {
            setUser(userData)
          } else {
            throw new Error('Dados do usuário não encontrados')
          }
        })
        .catch(() => {
          localStorage.removeItem('evolv_token')
          setToken(null)
          setUser(null)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      // Corrigir estrutura de resposta: backend retorna { status, data: { user, token } }
      const userData = response.data?.data?.user || response.data?.user
      const newToken = response.data?.data?.token || response.data?.token
      
      if (!newToken || !userData) {
        throw new Error('Resposta inválida do servidor')
      }
      
      localStorage.setItem('evolv_token', newToken)
      setToken(newToken)
      setUser(userData)
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('Erro no login:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Erro ao fazer login' 
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      // Corrigir estrutura de resposta: backend retorna { status, data: { user, token } }
      const newUser = response.data?.data?.user || response.data?.user
      const newToken = response.data?.data?.token || response.data?.token
      
      if (!newToken || !newUser) {
        throw new Error('Resposta inválida do servidor')
      }
      
      localStorage.setItem('evolv_token', newToken)
      setToken(newToken)
      setUser(newUser)
      
      return { success: true, user: newUser }
    } catch (error) {
      console.error('Erro no registro:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Erro ao criar conta' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('evolv_token')
    setToken(null)
    setUser(null)
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData)
      // Corrigir estrutura de resposta: backend retorna { status, data: { user } }
      const updatedUser = response.data?.data?.user || response.data?.user
      if (updatedUser) {
        setUser(updatedUser)
        return { success: true, user: updatedUser }
      } else {
        throw new Error('Dados do usuário não encontrados na resposta')
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Erro ao atualizar perfil' 
      }
    }
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}