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
        .then(userData => {
          setUser(userData)
        })
        .catch(() => {
          localStorage.removeItem('evolv_token')
          setToken(null)
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
      const { user: userData, token: newToken } = response.data
      
      localStorage.setItem('evolv_token', newToken)
      setToken(newToken)
      setUser(userData)
      
      return { success: true, user: userData }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao fazer login' 
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      const { user: newUser, token: newToken } = response.data
      
      localStorage.setItem('evolv_token', newToken)
      setToken(newToken)
      setUser(newUser)
      
      return { success: true, user: newUser }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao criar conta' 
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
      setUser(response.data.user)
      return { success: true, user: response.data.user }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao atualizar perfil' 
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