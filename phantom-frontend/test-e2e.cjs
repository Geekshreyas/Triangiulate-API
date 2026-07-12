const { io } = require('socket.io-client');
const axios = require('axios');

async function run() {
    try {
        console.log('1. Logging in as adjudicator...');
        const adminRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'adjudicator@test.com',
            password: 'password123'
        });
        const adminToken = adminRes.data.token;
        console.log('   Admin logged in.');

        console.log('2. Connecting WebSocket as Admin...');
        const socket = io('http://localhost:5000', {
            auth: { token: adminToken }
        });

        socket.on('connect', () => {
            console.log('   Socket connected! ID:', socket.id);
        });
        socket.on('connect_error', (err) => {
            console.error('   Socket error:', err.message);
        });

        socket.on('fraudAlert', (data) => {
            console.log('🎉 SUCCESS: Received fraudAlert:', data);
            process.exit(0);
        });

        // Wait a sec for connection
        await new Promise(r => setTimeout(r, 1000));

        console.log('3. Logging in as hospital...');
        const hospRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'apollo@hospital.com',
            password: 'password123'
        });
        const hospToken = hospRes.data.token;
        console.log('   Hospital logged in.');

        console.log('4. Submitting fraudulent claim...');
        const claimRes = await axios.post('http://localhost:5000/api/claims/submit', {
            claimId: 'CLM-TEST-' + Math.floor(Math.random() * 1000000),
            patientId: 'PAT-999',
            providerId: 'PROV-999',
            dateOfService: new Date().toISOString(),
            totalBilledAmount: 100000, // Arithmetic mismatch (+40)
            patientGender: 'Male',
            patientAge: 45,
            diagnosisCodes: ['O80'], // Pregnancy code for Male (+50) = Total 90!
            procedures: [
                { code: 'CPT-1', description: 'Test', cost: 100, quantity: 1 }
            ]
        }, {
            headers: { Authorization: `Bearer ${hospToken}` }
        });
        console.log('   Claim submitted. Risk score:', claimRes.data.riskScore);

        // Wait for event
        setTimeout(() => {
            console.log('❌ FAILED: Did not receive WebSocket event in time.');
            process.exit(1);
        }, 3000);
    } catch (e) {
        console.error('Error:', e.response ? e.response.data : e.message);
        process.exit(1);
    }
}
run();
