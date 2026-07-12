const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    claimId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Claim', 
        required: true 
    },
    adjudicatorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    previousStatus: { type: String, required: true },
    newStatus: { type: String, required: true },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);