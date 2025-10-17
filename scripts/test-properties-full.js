const http = require('http');

function testPropertiesAPIWithAuth() {
  console.log('🧪 Testando API Properties com autenticação simulada...');
  
  const cookies = [
    'bsos-user={"id":"cmgu3qdl60000rzgcjn8ztx1n","email":"test@bsos.com","name":"Test User","role":"ADMIN"}',
    'bsos-selected-role=ADMIN',
    'auth-token=cmgu3qdl60000rzgcjn8ztx1n-1760660382454'
  ].join('; ');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/properties',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies
    }
  };

  const req = http.request(options, (res) => {
    console.log(`📊 Status Code: ${res.statusCode}`);
    console.log(`📋 Headers:`, JSON.stringify(res.headers, null, 2));
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('✅ API Response:', JSON.stringify(response, null, 2));
        
        if (response.success && response.data) {
          console.log(`🏠 Properties found: ${response.data.length}`);
          response.data.forEach((prop, index) => {
            console.log(`${index + 1}. ${prop.name} (${prop.type}) - ${prop.clientName || 'No client'}`);
          });
          
          console.log('🎯 API Properties está funcionando perfeitamente!');
        } else if (response.data && Array.isArray(response.data)) {
          console.log(`🏠 Properties (direct array): ${response.data.length}`);
          console.log('🎯 API Properties retornando dados!');
        } else {
          console.log('⚠️ Resposta inesperada da API');
        }
      } catch (error) {
        console.log('📜 Raw response:', data);
        console.error('💥 Parse error:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('🚫 Request error:', error.message);
  });

  req.end();
}

// Test creating a new property too
function testCreateProperty() {
  console.log('🆕 Testando criação de propriedade...');
  
  const cookies = [
    'bsos-user={"id":"cmgu3qdl60000rzgcjn8ztx1n","email":"test@bsos.com","name":"Test User","role":"ADMIN"}',
    'bsos-selected-role=ADMIN', 
    'auth-token=cmgu3qdl60000rzgcjn8ztx1n-1760660382454'
  ].join('; ');
  
  const newProperty = {
    name: "Teste API Property",
    address: "Rua de Teste, 999 - API Test, SP",
    type: "APARTMENT",
    clientName: "Cliente Teste API",
    contactEmail: "teste@api.com",
    cleaningFrequency: "WEEKLY"
  };
  
  const postData = JSON.stringify(newProperty);
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/properties',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies,
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`📊 Create Status Code: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('✅ Create Response:', JSON.stringify(response, null, 2));
        
        if (response.success) {
          console.log('🎯 Propriedade criada com sucesso via API!');
        }
      } catch (error) {
        console.log('📜 Raw create response:', data);
        console.error('💥 Create parse error:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('🚫 Create request error:', error.message);
  });

  req.write(postData);
  req.end();
}

// Execute tests
testPropertiesAPIWithAuth();

// Wait a bit then test creation
setTimeout(() => {
  testCreateProperty();
}, 1000);