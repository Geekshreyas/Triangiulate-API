const Claim = require('../models/Claim');
const { runValidationEngine } = require('../services/validationEngine');

const submitClaim = async (req, res) => {
    try {
        let documentUrl = null;
        if (req.file) {
            documentUrl = req.file.path; 
        }

        const parsedProcedures = typeof req.body.procedures === 'string' 
            ? JSON.parse(req.body.procedures) 
            : req.body.procedures;

        const parsedDiagnosisCodes = typeof req.body.diagnosisCodes === 'string'
            ? JSON.parse(req.body.diagnosisCodes)
            : req.body.diagnosisCodes;

        const cleanClaimData = {
            ...req.body,
            procedures: parsedProcedures,
            diagnosisCodes: parsedDiagnosisCodes || []
        };

        const validationResults = runValidationEngine(cleanClaimData);

        const newClaim = await Claim.create({
            ...cleanClaimData, 
            submittedBy: req.user._id,
            riskScore: validationResults.riskScore,
            flaggedReasons: validationResults.flaggedReasons,
            documentUrl: documentUrl
        });

        if (newClaim.riskScore >= 80) {
            
            const io = req.app.get('socketio');
            
            if (io) {
                io.to('adjudicators_room').emit('fraudAlert', {
                    claimId: newClaim.claimId,
                    riskScore: newClaim.riskScore,
                    amount: newClaim.totalBilledAmount,
                    message: 'CRITICAL: High-risk phantom claim intercepted!'
                });
            }
        }
        res.status(201).json({
            message: 'Claim processed and document secured successfully.',
            claimId: newClaim.claimId,
            status: newClaim.status,
            riskScore: newClaim.riskScore,
            flaggedReasons: newClaim.flaggedReasons,
            documentUrl: newClaim.documentUrl
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error during claim ingestion', error: error.message });
    }
};

const getClaims = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        let matchStage = {};
        if (req.query.flagged === 'true') {
            matchStage.riskScore = { $gt: 0 }; 
        }
        
        if (req.user.role === 'hospital') {
            matchStage.submittedBy = req.user._id;
        }

        let sortStage = { riskScore: -1 };
        if (req.query.sortBy === 'latest') {
            sortStage = { createdAt: -1 };
        }

        const aggregateQuery = Claim.aggregate([
            { $match: matchStage },
            {
                $sort: sortStage
            }
        ]);

        const options = {
            page: page,
            limit: limit,
        };

        const result = await Claim.aggregatePaginate(aggregateQuery, options);

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching claims', error: error.message });
    }
};

const getClaimById = async (req, res) => {
    try {
        const claim = await Claim.findById(req.params.id);
        
        if (!claim) {
            return res.status(404).json({ message: 'Claim not found' });
        }
        
        if (req.user.role === 'hospital' && claim.submittedBy && claim.submittedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized to view this claim' });
        }
        
        res.status(200).json(claim);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching claim details', error: error.message });
    }
};

const updateClaimStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status action.' });
        }

        const claim = await Claim.findById(req.params.id);
        
        if (!claim) {
            return res.status(404).json({ message: 'Claim not found.' });
        }

        const previousStatus = claim.status;

        claim.status = status;
        
        const updatedClaim = await claim.save();

        const AuditLog = require('../models/AuditLog');
        await AuditLog.create({
            claimId: claim._id,
            adjudicatorId: req.user._id,
            previousStatus: previousStatus,
            newStatus: status
        });

        res.status(200).json(updatedClaim);
    } catch (error) {
        res.status(500).json({ message: 'Server Error updating claim status', error: error.message });
    }
};

const getMyClaims = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        const aggregateQuery = Claim.aggregate([
            { $match: { submittedBy: req.user._id } },
            { $sort: { createdAt: -1 } } 
        ]);

        const options = { page, limit };
        const result = await Claim.aggregatePaginate(aggregateQuery, options);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching your claims', error: error.message });
    }
};

const deleteClaim = async (req, res) => {
    try {
        const claim = await Claim.findById(req.params.id);
        if (!claim) return res.status(404).json({ message: 'Claim not found.' });

        if (claim.submittedBy.toString() !== req.user._id.toString() && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: 'Unauthorized to delete this claim.' });
        }

        if (claim.status !== 'Pending') {
            return res.status(400).json({ message: 'Cannot delete an adjudicated claim.' });
        }

        await claim.deleteOne();
        res.status(200).json({ message: 'Claim deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error deleting claim', error: error.message });
    }
};

const updateClaim = async (req, res) => {
    try {
        const claim = await Claim.findById(req.params.id);
        if (!claim) return res.status(404).json({ message: 'Claim not found.' });

        if (claim.submittedBy.toString() !== req.user._id.toString() && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: 'Unauthorized to edit this claim.' });
        }

        if (claim.status !== 'Pending') {
            return res.status(400).json({ message: 'Cannot edit an adjudicated claim.' });
        }

        let documentUrl = claim.documentUrl;
        if (req.file) {
            documentUrl = req.file.path; 
        }

        const parsedProcedures = typeof req.body.procedures === 'string' 
            ? JSON.parse(req.body.procedures) 
            : req.body.procedures;

        const parsedDiagnosisCodes = typeof req.body.diagnosisCodes === 'string'
            ? JSON.parse(req.body.diagnosisCodes)
            : req.body.diagnosisCodes;

        const cleanClaimData = {
            ...req.body,
            procedures: parsedProcedures,
            diagnosisCodes: parsedDiagnosisCodes || []
        };

        const validationResults = runValidationEngine(cleanClaimData);

        claim.patientId = cleanClaimData.patientId || claim.patientId;
        claim.providerId = cleanClaimData.providerId || claim.providerId;
        claim.totalBilledAmount = cleanClaimData.totalBilledAmount || claim.totalBilledAmount;
        claim.patientGender = cleanClaimData.patientGender || claim.patientGender;
        if (cleanClaimData.patientAge) claim.patientAge = cleanClaimData.patientAge;
        if (cleanClaimData.dateOfService) claim.dateOfService = cleanClaimData.dateOfService;
        
        claim.procedures = cleanClaimData.procedures;
        claim.diagnosisCodes = cleanClaimData.diagnosisCodes;
        
        claim.riskScore = validationResults.riskScore;
        claim.flaggedReasons = validationResults.flaggedReasons;
        claim.documentUrl = documentUrl;

        const updatedClaim = await claim.save();

        const io = req.app.get('socketio');
        if (io) {
            io.to('adjudicators_room').emit('fraudAlert', {
                claimId: updatedClaim.claimId,
                riskScore: updatedClaim.riskScore,
                amount: updatedClaim.totalBilledAmount,
                message: 'UPDATE: A claim was just edited and re-scored!'
            });
        }

        res.status(200).json({
            message: 'Claim updated and re-validated successfully.',
            claimId: updatedClaim.claimId,
            riskScore: updatedClaim.riskScore
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error updating claim', error: error.message });
    }
};

module.exports = { getClaims, submitClaim, getClaimById, updateClaimStatus, getMyClaims, deleteClaim, updateClaim };