require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const Claim = require('./models/Claim');
const AuditLog = require('./models/AuditLog');
const User = require('./models/User');
const { runValidationEngine } = require('./services/validationEngine');

mongoose.connect(process.env.MONGO_URI)
    .then(() => )
    .catch(err => {
    process.exit(1);
});

const seedDatabase = async () => {
    try {
        await Claim.deleteMany();
        await AuditLog.deleteMany();
        let hospital = await User.findOne({ role: 'hospital' });
        if (!hospital) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            hospital = await User.create({ name: 'General Hospital', email: 'hospital@test.com', password: hashedPassword, role: 'hospital' });
        }

        let adjudicator = await User.findOne({ role: 'adjudicator' });
        if (!adjudicator) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            adjudicator = await User.create({ name: 'Jane Adjudicator', email: 'adjudicator@test.com', password: hashedPassword, role: 'adjudicator' });
        }

        const claimsToInsert = [];
        const auditLogsToInsert = [];

        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3);
        const endDate = new Date();
        for (let i = 0; i < 120; i++) {
            const procedureCost = faker.number.int({ min: 50, max: 800 });
            const quantity = faker.number.int({ min: 1, max: 4 });
            const dateOfService = faker.date.between({ from: startDate, to: endDate });
            
            const rand = Math.random();
            const status = rand < 0.5 ? 'Pending' : (rand < 0.75 ? 'Approved' : 'Rejected');

            const rawClaim = {
                claimId: `CLM-${faker.string.alphanumeric(8).toUpperCase()}`,
                patientId: `PT-${faker.string.numeric(5)}`,
                patientAge: faker.number.int({ min: 18, max: 80 }),
                patientGender: faker.helpers.arrayElement(['Male', 'Female']),
                providerId: `NPI-${faker.string.numeric(10)}`,
                dateOfService: dateOfService,
                diagnosisCodes: ['J01', 'E11'], 
                procedures: [{
                    code: faker.string.numeric(5),
                    description: 'General Consultation',
                    cost: procedureCost,
                    quantity: quantity
                }],
                totalBilledAmount: procedureCost * quantity,
                submittedBy: hospital._id,
                status: status,
                createdAt: dateOfService
            };

            const validationResults = runValidationEngine(rawClaim);
            const claimDoc = new Claim({ ...rawClaim, ...validationResults });
            claimsToInsert.push(claimDoc);

            if (status !== 'Pending') {
                auditLogsToInsert.push({
                    claimId: claimDoc._id,
                    adjudicatorId: adjudicator._id,
                    previousStatus: 'Pending',
                    newStatus: status,
                    timestamp: dateOfService
                });
            }
        }

        for (let i = 0; i < 30; i++) {
            const dateOfService = faker.date.between({ from: startDate, to: endDate });
            const rand = Math.random();
            const status = rand < 0.3 ? 'Pending' : 'Rejected';

            let rawClaim = {
                claimId: `FRD-${faker.string.alphanumeric(8).toUpperCase()}`,
                patientId: `PT-${faker.string.numeric(5)}`,
                patientAge: 45, 
                patientGender: 'Male',
                providerId: `NPI-${faker.string.numeric(10)}`,
                dateOfService: dateOfService,
                diagnosisCodes: [],
                procedures: [{
                    code: '99214',
                    description: 'Complex Visit',
                    cost: 200,
                    quantity: 1
                }],
                totalBilledAmount: 200,
                submittedBy: hospital._id,
                status: status,
                createdAt: dateOfService
            };

            if (i < 10) {
                rawClaim.totalBilledAmount = faker.number.int({ min: 5000, max: 15000 });
                rawClaim.diagnosisCodes = ['E11'];
            } else if (i >= 10 && i < 15) {
                rawClaim.patientGender = 'Male';
                rawClaim.diagnosisCodes = ['O80'];
            }
            else if (i >= 15 && i < 20) {
                rawClaim.patientAge = 65;
                rawClaim.diagnosisCodes = ['P09'];
            }
            else {
                rawClaim.diagnosisCodes = ['S52'];
                rawClaim.procedures = [{ code: '76801', description: 'Obstetrics Ultrasound', cost: 500, quantity: 1 }];
                rawClaim.totalBilledAmount = 500;
            }

            const validationResults = runValidationEngine(rawClaim);
            const claimDoc = new Claim({ ...rawClaim, ...validationResults });
            claimsToInsert.push(claimDoc);

            if (status !== 'Pending') {
                auditLogsToInsert.push({
                    claimId: claimDoc._id,
                    adjudicatorId: adjudicator._id,
                    previousStatus: 'Pending',
                    newStatus: status,
                    timestamp: dateOfService
                });
            }
        }

        await Claim.insertMany(claimsToInsert);

        await AuditLog.insertMany(auditLogsToInsert);

        process.exit();
    } catch (error) {
        process.exit(1);
    }
};

seedDatabase();