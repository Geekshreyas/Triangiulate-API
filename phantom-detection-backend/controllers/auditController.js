const AuditLog = require('../models/AuditLog');

const getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .populate('adjudicatorId', 'name email role')
            .populate('claimId', 'claimId totalBilledAmount riskScore')
            .sort({ timestamp: -1 });

        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch audit logs' });
    }
};

module.exports = { getAuditLogs };