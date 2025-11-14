const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase URL e ANON KEY são obrigatórios no .env');
    process.exit(1);
}

// Configuração do cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    global: {
        headers: {
            'x-application-name': 'evolv-ecommerce'
        }
    }
});

// Testar conexão na inicialização
const testConnection = async () => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('id')
            .limit(1);
        
        if (error) {
            console.error('❌ Erro na conexão com Supabase:', error.message);
            return false;
        }
        
        console.log('✅ Conectado ao Supabase com sucesso!');
        return true;
    } catch (error) {
        console.error('❌ Erro inesperado:', error.message);
        return false;
    }
};

// Executar teste de conexão ao carregar o módulo
testConnection();

module.exports = supabase;