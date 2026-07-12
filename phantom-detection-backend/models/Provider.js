const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    npi: { type: String, required: true, unique: true }, 
    location: {
        state: { type: String, required: true },
        city: { type: String, required: true }
    }
}, { timestamps: true });

module.exports = mongoose.model('Provider', providerSchema);