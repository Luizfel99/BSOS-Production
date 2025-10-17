const https = require('http');

// Test Stripe webhook simulation
const postData = JSON.stringify({
  id: "evt_test_webhook",
  object: "event",
  type: "payment_intent.succeeded",
  data: {
    object: {
      id: "pi_test_payment",
      object: "payment_intent",
      amount: 29999,
      currency: "usd",
      status: "succeeded",
      customer: "cus_test_customer"
    }
  }
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/webhooks/stripe',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'stripe-signature': 'test_signature_would_be_here'
  }
};

console.log('Testing Stripe Webhook...');

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n=== RESPONSE ===');
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Response is not JSON:');
      console.log(data.substring(0, 500) + '...');
    }
  });
});

req.on('error', (e) => {
  console.error(`Request error: ${e.message}`);
});

req.write(postData);
req.end();