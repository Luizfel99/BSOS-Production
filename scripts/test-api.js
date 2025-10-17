const fetch = require('node-fetch');

async function testPropertiesAPI() {
  try {
    console.log('🔍 Testando API de Properties...');
    console.log('================================\n');
    
    // Test API endpoint
    const response = await fetch('http://localhost:3001/api/properties', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'bsos-user=pedro@owner.com; bsos-selected-role=OWNER; auth-token=valid-token'
      }
    });
    
    console.log(`📊 Status da resposta: ${response.status}`);
    console.log(`📊 Status text: ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API funcionando!');
      console.log(`📋 Propriedades encontradas: ${data.data ? data.data.length : 0}`);
      
      if (data.data && data.data.length > 0) {
        console.log('\n🏠 Primeira propriedade:');
        const first = data.data[0];
        console.log(`   Nome: ${first.name}`);
        console.log(`   Endereço: ${first.address}`);
        console.log(`   Tipo: ${first.type}`);
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Erro na API:');
      console.log(errorText);
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar API:', error.message);
  }
}

testPropertiesAPI();