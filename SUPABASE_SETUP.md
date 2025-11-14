# Configuração do Supabase para o Projeto Evolv

## 📋 Problemas Comuns e Soluções

### 1. Erro "Erro interno do servidor" ao criar conta

**Possíveis causas:**
- Tabela `users` não existe
- Políticas RLS (Row Level Security) bloqueando INSERT
- JWT_SECRET não configurado no .env
- Campos obrigatórios faltando na tabela

### 2. Erro "Credenciais inválidas" mesmo com dados corretos

**Possíveis causas:**
- Políticas RLS bloqueando SELECT
- Tabela `users` não existe
- Campo `password_hash` não existe na tabela

## 🔧 Configuração da Tabela `users`

Execute este SQL no SQL Editor do Supabase:

```sql
-- Criar tabela users
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    fitness_goals TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para email (melhora performance)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🔐 Configuração de RLS (Row Level Security)

### Opção 1: Desabilitar RLS (Desenvolvimento)

```sql
-- Desabilitar RLS na tabela users (APENAS PARA DESENVOLVIMENTO)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

### Opção 2: Habilitar RLS com Políticas Corretas (Recomendado)

```sql
-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política: Permitir INSERT para qualquer um (registro)
CREATE POLICY "Permitir registro de novos usuários"
ON users
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Política: Usuários podem ver apenas seus próprios dados
CREATE POLICY "Usuários podem ver seus próprios dados"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Política: Permitir SELECT para autenticação (login)
-- NOTA: Esta política permite que o backend leia qualquer usuário para autenticação
-- Em produção, considere usar uma service role key no backend
CREATE POLICY "Permitir leitura para autenticação"
ON users
FOR SELECT
TO anon
USING (true);

-- Política: Usuários podem atualizar apenas seus próprios dados
CREATE POLICY "Usuários podem atualizar seus próprios dados"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

## ⚠️ IMPORTANTE: Service Role Key vs Anon Key

Para desenvolvimento, você pode usar a **anon key** com RLS desabilitado ou com políticas permissivas.

Para produção, recomenda-se:
1. Usar **Service Role Key** no backend (não a anon key)
2. Manter RLS habilitado com políticas adequadas
3. Nunca expor a Service Role Key no frontend

### Como obter a Service Role Key:
1. Vá em **Settings** > **API** no Supabase
2. Copie a **service_role key** (mantenha segura!)
3. Use no backend `.env` como `SUPABASE_SERVICE_ROLE_KEY`

## 📝 Verificação Rápida

Execute no SQL Editor para verificar se a tabela existe:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users';
```

Deve retornar pelo menos:
- `id` (uuid)
- `name` (varchar)
- `email` (varchar)
- `password_hash` (varchar)
- `created_at` (timestamp)

## 🧪 Teste de Conexão

Após configurar, teste no SQL Editor:

```sql
-- Teste de INSERT (deve funcionar)
INSERT INTO users (name, email, password_hash)
VALUES ('Teste', 'teste@teste.com', 'hash_teste')
RETURNING id, name, email;

-- Teste de SELECT (deve funcionar)
SELECT id, name, email FROM users LIMIT 1;
```

## 🔍 Debug

Se ainda houver problemas, verifique:

1. **Console do backend**: Veja os logs detalhados de erro
2. **Supabase Logs**: Vá em **Logs** > **Postgres Logs** no dashboard
3. **Network Tab**: No navegador, veja a resposta completa da API

Os erros agora mostram mensagens mais específicas no console do backend!

