require('dotenv').config();
const mongoose = require('mongoose');
const Claim = require('./models/Claim');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        const res = await Claim.aggregatePaginate(Claim.aggregate([{ $sort: { riskScore: -1 } }]), { page: 1, limit: 10 });
    } catch (e) {} finally {
        process.exit(0);
    }
});
