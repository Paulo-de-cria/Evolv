import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { formatDate } from '../utils/helpers'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Profile = () => {
  const { user, updateProfile, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    fitness_goals: user?.fitness_goals || ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const result = await updateProfile(profileData)
    if (result.success) {
      alert('Perfil atualizado com sucesso!')
    } else {
      alert(result.message)
    }
    
    setLoading(false)
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('As senhas não coincidem!')
      return
    }

    setLoading(true)
    // Aqui você implementaria a mudança de senha
    alert('Funcionalidade de mudança de senha em desenvolvimento...')
    setLoading(false)
  }

  if (!user) {
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
      <div className="fade-in max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Perfil</h1>

        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          {/* Tabs */}
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'profile'
                    ? 'text-evolv-primary border-b-2 border-evolv-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Informações Pessoais
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'security'
                    ? 'text-evolv-primary border-b-2 border-evolv-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Segurança
              </button>
            </nav>
          </div>

          {/* Conteúdo das Tabs */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="max-w-2xl">
                <h2 className="text-xl font-semibold mb-6">Informações Pessoais</h2>
                
                <form onSubmit={handleProfileUpdate}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="form-group">
                      <label className="form-label">Nome Completo</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          name: e.target.value
                        })}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        value={user.email}
                        className="form-input bg-gray-50"
                        disabled
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        O email não pode ser alterado
                      </p>
                    </div>
                  </div>

                  <div className="form-group mb-6">
                    <label className="form-label">Objetivos Fitness</label>
                    <textarea
                      value={profileData.fitness_goals}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        fitness_goals: e.target.value
                      })}
                      rows="4"
                      className="form-input"
                      placeholder="Ex: Ganho de massa muscular, emagrecimento, definição..."
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <p>Membro desde: {formatDate(user.created_at)}</p>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? <LoadingSpinner /> : 'Salvar Alterações'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="max-w-2xl">
                <h2 className="text-xl font-semibold mb-6">Alterar Senha</h2>
                
                <form onSubmit={handlePasswordChange}>
                  <div className="space-y-4 mb-6">
                    <div className="form-group">
                      <label className="form-label">Senha Atual</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value
                        })}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nova Senha</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value
                        })}
                        className="form-input"
                        required
                        minLength="6"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Confirmar Nova Senha</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value
                        })}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? <LoadingSpinner /> : 'Alterar Senha'}
                    </button>
                  </div>
                </form>

                <div className="border-t mt-8 pt-6">
                  <h3 className="text-lg font-semibold mb-4 text-red-600">
                    Zona de Perigo
                  </h3>
                  <button
                    onClick={() => {
                      if (window.confirm('Tem certeza que deseja sair?')) {
                        logout()
                      }
                    }}
                    className="btn-danger"
                  >
                    Sair da Conta
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-card p-6 text-center">
            <div className="text-2xl font-bold text-evolv-primary mb-2">0</div>
            <div className="text-gray-600">Pedidos Realizados</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-card p-6 text-center">
            <div className="text-2xl font-bold text-evolv-primary mb-2">0</div>
            <div className="text-gray-600">Produtos Favoritados</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-card p-6 text-center">
            <div className="text-2xl font-bold text-evolv-primary mb-2">
              {formatDate(user.created_at)}
            </div>
            <div className="text-gray-600">Membro Desde</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile