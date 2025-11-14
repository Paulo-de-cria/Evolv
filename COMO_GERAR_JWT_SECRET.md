# Como Gerar o JWT_SECRET

## 🔑 O que é JWT_SECRET?

O `JWT_SECRET` é uma **chave secreta** que você mesmo cria. Ela é usada para:
- Assinar (criar) tokens JWT quando o usuário faz login
- Verificar se os tokens são válidos quando o usuário faz requisições

**IMPORTANTE:** Esta chave deve ser:
- ✅ Longa (mínimo 32 caracteres, recomendado 64+)
- ✅ Aleatória e imprevisível
- ✅ Mantida em segredo (nunca compartilhe ou commite no Git)
- ✅ Diferente para cada ambiente (desenvolvimento, produção)

## 🎯 Opções para Gerar

### Opção 1: Usando Node.js (Recomendado)

Execute no terminal:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Isso gerará uma chave de 128 caracteres (64 bytes em hexadecimal).

### Opção 2: Usando PowerShell (Windows)

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

### Opção 3: Gerador Online

Você pode usar geradores online como:
- https://randomkeygen.com/
- https://www.grc.com/passwords.htm

**Use a opção "CodeIgniter Encryption Keys" ou similar**

### Opção 4: Criar Manualmente

Você pode criar uma string longa e aleatória, por exemplo:

```
JWT_SECRET=minha_chave_super_secreta_evolv_2024_12345678901234567890_abcdefghijklmnopqrstuvwxyz
```

**Mas a Opção 1 (Node.js) é mais segura!**

## 📝 Como Usar

1. Gere a chave usando uma das opções acima
2. Abra o arquivo `.env` na pasta `backend`
3. Cole a chave gerada:

```env
JWT_SECRET=cole_aqui_a_chave_gerada
```

**Exemplo:**
```env
JWT_SECRET=5da4f5058cd64469202fe4dfc4544fa649e4ac6ceea74dc163a7021e543ceb620b8dda90e2b34879f031de1497ad92a2b7ca603912a3857f1739a0b560240ba3
```

## ⚠️ IMPORTANTE

- **Nunca** compartilhe sua chave JWT_SECRET
- **Nunca** commite o arquivo `.env` no Git (já está no .gitignore)
- Use uma chave **diferente** para produção
- Se alguém tiver acesso à chave, pode criar tokens falsos!

## ✅ Verificação

Após adicionar no `.env`, reinicie o servidor backend:

```bash
cd backend
npm run dev
```

Se tudo estiver correto, você verá o servidor iniciando normalmente. Se houver erro sobre JWT_SECRET, verifique se:
1. A chave está no arquivo `.env`
2. Não há espaços extras antes ou depois da chave
3. O arquivo `.env` está na pasta `backend` (não na raiz do projeto)

