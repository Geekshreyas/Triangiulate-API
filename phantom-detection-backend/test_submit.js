const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testSubmit() {
    try {
        const form = new FormData();
        form.append('claimId', `CLM-${Math.floor(Math.random() * 10000)}`);
        form.append('patientId', 'PAT-123');
        form.append('providerId', 'DOC-999');
        form.append('totalBilledAmount', '5000');
        form.append('patientGender', 'Male');
        form.append('patientAge', '45');

        form.append('diagnosisCodes[]', 'O80');
        form.append('diagnosisCodes[]', 'P09');

        const procedures = [{
            code: 'O80',
            description: 'Test',
            cost: 5000,
            quantity: 1
        }];
        form.append('procedures', JSON.stringify(procedures));

        const response = await axios.post('http://localhost:5000/api/claims/submit', form, {
            headers: form.getHeaders()
        });
    } catch (error) {}
}

testSubmit();
