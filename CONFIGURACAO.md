# Configuração do Projeto Evolv

## ⚠️ IMPORTANTE: Configuração do arquivo .env

Você precisa criar um arquivo `.env` na pasta `backend` com as seguintes variáveis:

### Passos para configurar:

1. Na pasta `backend`, crie um arquivo chamado `.env` (sem extensão)
2. Copie o conteúdo abaixo e preencha com suas informações do Supabase:

```env
# Porta do servidor
PORT=5000

# JWT Configuration
JWT_SECRET=seu_jwt_secret_super_seguro_aqui_mude_em_producao
JWT_EXPIRES_IN=7d

# Supabase Configuration
SUPABASE_URL=sua_url_do_supabase_aqui
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase_aqui

# Environment
NODE_ENV=development
```

### Como obter as informações do Supabase:

1. Acesse seu projeto no [Supabase](https://supabase.com)
2. Vá em **Settings** > **API**
3. Copie a **URL** do projeto e cole em `SUPABASE_URL`
4. Copie a **anon/public key** e cole em `SUPABASE_ANON_KEY`

### Sobre o JWT_SECRET:

- Use uma string longa e aleatória (mínimo 32 caracteres)
- Em produção, use uma chave segura diferente
- Exemplo: `JWT_SECRET=minha_chave_super_secreta_12345678901234567890`

## Problemas Corrigidos:

✅ Estrutura de resposta do backend corrigida no frontend
✅ Tratamento de erros adicionado para evitar crashes
✅ ErrorBoundary implementado para capturar erros
✅ Validação de dados opcionais nos componentes
✅ Carrinho só carrega quando usuário está autenticado

## Como executar:

### Backend:
```bash
cd backend
npm install
npm run dev
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

## ⚠️ IMPORTANTE: Configuração do Supabase

Antes de usar o sistema de autenticação, você **DEVE** configurar a tabela `users` no Supabase.

### Passos Rápidos:

1. Acesse o SQL Editor no Supabase Dashboard
2. Execute o SQL do arquivo `SUPABASE_SETUP.md` para criar a tabela `users`
3. Configure as políticas RLS (Row Level Security) conforme o guia

**Veja o arquivo `SUPABASE_SETUP.md` para instruções detalhadas!**

### Problemas Comuns:

- **"Erro interno do servidor" ao criar conta**: Tabela `users` não existe ou RLS bloqueando
- **"Credenciais inválidas"**: RLS bloqueando SELECT ou tabela não configurada
- **"JWT_SECRET não configurado"**: Adicione `JWT_SECRET` no arquivo `.env`

## Notas:

- O backend roda na porta 5000 por padrão
- O frontend roda na porta 3000 por padrão
- Certifique-se de que o Supabase está configurado corretamente com as tabelas necessárias
- **Verifique os logs do backend** para mensagens de erro mais detalhadas

