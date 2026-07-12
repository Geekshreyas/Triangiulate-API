const { z } = require('zod');

const claimSchema = z.object({
    claimId: z.string({ required_error: "Claim ID is required" }).min(3),
    patientId: z.string({ required_error: "Patient ID is required" }),
    providerId: z.string({ required_error: "Provider ID (NPI) is required" }),
    
    totalBilledAmount: z.number({ required_error: "Total billed amount is required" }).positive(),
    
    patientGender: z.enum(["Male", "Female", "Other"]).optional(),
    patientAge: z.number().int().positive().optional(),
    
    dateOfService: z.string().optional(),

    procedures: z.array(
        z.object({
            code: z.string({ required_error: "Procedure code is required" }),
            description: z.string().optional(),
            cost: z.number({ required_error: "Procedure cost is required" }).positive(),
            quantity: z.number().int().positive().default(1)
        })
    ).min(1, { message: "At least one procedure must be included in the claim." })
});

const validateClaimInput = (req, res, next) => {
    try {
        if (typeof req.body.procedures === 'string') {
            try { req.body.procedures = JSON.parse(req.body.procedures); } catch(e){}
        }
        if (typeof req.body.diagnosisCodes === 'string') {
            try { req.body.diagnosisCodes = JSON.parse(req.body.diagnosisCodes); } catch(e){}
        }
        if (req.body.totalBilledAmount !== undefined) {
            req.body.totalBilledAmount = Number(req.body.totalBilledAmount);
        }
        if (req.body.patientAge !== undefined) {
            req.body.patientAge = Number(req.body.patientAge);
        }

        claimSchema.parse(req.body);
        
        next(); 
    } catch (error) {
        if (error instanceof z.ZodError) {
            const issues = error.issues || error.errors || [];
            const errorMessages = issues.map(err => {
                const path = err.path ? err.path.join('.') : 'field';
                return `${path}: ${err.message}`;
            });
            
            return res.status(400).json({
                success: false,
                message: 'Invalid Claim Data',
                errors: errorMessages
            });
        }
        
        return res.status(500).json({ message: 'Internal Server Error during validation' });
    }
};

module.exports = { validateClaimInput };