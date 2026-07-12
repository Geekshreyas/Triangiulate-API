const fs = require('fs');

async function testBackend() {
  const formData = new FormData();
  formData.append('claimId', `CLM-${Date.now()}`);
  formData.append('patientId', 'PAT-123');
  formData.append('patientAge', '45');
  formData.append('patientGender', 'Male');
  formData.append('providerId', 'PROV-123');
  formData.append('totalBilledAmount', '500');
  
  formData.append('procedures', JSON.stringify([{
    code: '99213',
    description: 'Office Visit',
    cost: 500,
    quantity: 1
  }]));
  
  formData.append('diagnosisCodes', JSON.stringify(['99213']));

  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@phantom.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    let token = loginData.token;

    if (!token) {
        const regRes = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'test', email: 'test1@test.com', password: 'password', role: 'hospital' })
        });
        const regData = await regRes.json();
        token = regData.token;
    }

    const response = await fetch('http://localhost:5000/api/claims/submit', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    const text = await response.text();
  } catch (error) {}
}

testBackend();
