import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

// ✅ Exportação nomeada correta para Fast Refresh
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  
  return context
}

// ✅ Exportação padrão também para compatibilidade
export default useAuth