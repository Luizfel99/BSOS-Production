#!/usr/bin/env node

const stripe = require('stripe')('sk_test_51Q4T2fGsVoefOfNqSEq20Jwoi14dcrIpzUQqNsRqoqEqkLQtoXeQYSgOyrEBh4nZl03KJdJcG4oV46NoNZq9ijwT00x0xRhCZu');

async function testStripeConnection() {
    console.log('🔍 Testando conexão com Stripe...\n');
    
    try {
        // Testar se as chaves estão válidas
        const account = await stripe.accounts.retrieve();
        console.log('✅ Conexão com Stripe bem-sucedida!');
        console.log('🏢 Account ID:', account.id);
        console.log('📧 Email:', account.email || 'Não configurado');
        console.log('🌍 País:', account.country);
        console.log('💰 Moeda padrão:', account.default_currency);
        
        // Testar criação de produto (teste)
        console.log('\n🧪 Testando criação de produto...');
        const product = await stripe.products.create({
            name: 'Teste BSOS - Limpeza',
            description: 'Produto de teste para validar integração',
            metadata: {
                test: 'true',
                created_by: 'bsos_setup'
            }
        });
        
        console.log('✅ Produto criado com sucesso!');
        console.log('🆔 ID:', product.id);
        
        // Limpar produto de teste
        await stripe.products.del(product.id);
        console.log('🧹 Produto de teste removido');
        
        console.log('\n🎉 STRIPE CONFIGURADO COM SUCESSO!');
        console.log('✅ Chaves de teste funcionando perfeitamente');
        console.log('🚀 Pronto para integração com o módulo financeiro');
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro na conexão com Stripe:', error.message);
        
        if (error.code === 'invalid_api_key') {
            console.error('🔑 Erro: Chave API inválida');
        } else if (error.code === 'api_key_expired') {
            console.error('⏰ Erro: Chave API expirada');
        }
        
        return false;
    }
}

testStripeConnection();