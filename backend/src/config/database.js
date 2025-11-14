const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseConfig = {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    global: {
        headers: {
            'x-application-name': 'evolv-backend'
        }
    }
};

// Inicializar cliente do Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    supabaseConfig
);

// Função para testar conexão
const testConnection = async () => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('count')
            .limit(1);
        
        if (error) {
            console.error('❌ Erro na conexão com Supabase:', error.message);
            return false;
        }
        
        console.log('✅ Conectado ao Supabase com sucesso!');
        return true;
    } catch (error) {
        console.error('❌ Erro inesperado na conexão:', error.message);
        return false;
    }
};

// Função para executar queries com tratamento de erro
const executeQuery = async (queryBuilder) => {
    try {
        const { data, error } = await queryBuilder;
        
        if (error) {
            console.error('Erro na query:', error);
            throw new Error(`Database error: ${error.message}`);
        }
        
        return data;
    } catch (error) {
        console.error('Erro ao executar query:', error);
        throw error;
    }
};

// Função para transações (quando necessário)
const executeTransaction = async (queries) => {
    try {
        const results = [];
        
        for (const query of queries) {
            const result = await executeQuery(query);
            results.push(result);
        }
        
        return results;
    } catch (error) {
        console.error('Erro na transação:', error);
        throw new Error('Transaction failed');
    }
};

module.exports = {
    supabase,
    testConnection,
    executeQuery,
    executeTransaction
};