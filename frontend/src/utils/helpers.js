// Formatar preço em Real
export const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}

// Formatar data
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Calcular valor total do carrinho
export const calculateCartTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (item.products.price * item.quantity)
  }, 0)
}

// Gerar array de estrelas para rating
export const generateStars = (rating) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  for (let i = 0; i < fullStars; i++) {
    stars.push('full')
  }

  if (hasHalfStar) {
    stars.push('half')
  }

  const emptyStars = 5 - stars.length
  for (let i = 0; i < emptyStars; i++) {
    stars.push('empty')
  }

  return stars
}