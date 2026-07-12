const mongoose = require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');

const procedureSchema = new mongoose.Schema({
    code: { type: String, required: true }, 
    description: { type: String },
    cost: { type: Number, required: true },
    quantity: { type: Number, default: 1 }
}, { _id: false });

const claimSchema = new mongoose.Schema({
    claimId: { type: String, required: true, unique: true },
    patientId: { type: String, required: true },
    patientAge: { type: Number, required: true },
    patientGender: { type: String, enum: ['Male', 'Female', 'Other', 'Unknown'], required: true },
    
    providerId: { 
        type: String, 
        required: true 
    },
    
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    
    dateOfService: { type: Date, default: Date.now },
    diagnosisCodes: [{ type: String }], 
    procedures: [procedureSchema],
    totalBilledAmount: { type: Number, required: true },
    
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected'], 
        default: 'Pending' 
    },
documentUrl: { 
    type: String, 
    required: false
},
    riskScore: { type: Number, default: 0 }, 
    flaggedReasons: [{ type: String }] 
}, { timestamps: true });

claimSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model('Claim', claimSchema);