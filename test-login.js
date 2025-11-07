// Test login API
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@bsos.com',
    password: 'admin123'
  })
})
.then(response => response.json())
.then(data => console.log('Login response:', data))
.catch(error => console.error('Login error:', error));