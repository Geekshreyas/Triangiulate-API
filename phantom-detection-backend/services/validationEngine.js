const runValidationEngine = (claimData) => {
    let riskScore = 0;
    let flaggedReasons = [];

    let calculatedTotal = 0;
    
    if (claimData.procedures && claimData.procedures.length > 0) {
        claimData.procedures.forEach(proc => {
            calculatedTotal += (proc.cost * (proc.quantity || 1));
        });
    }

    if (calculatedTotal !== claimData.totalBilledAmount) {
        riskScore += 40; 
        flaggedReasons.push(`Arithmetic Mismatch: Itemized sum is ${calculatedTotal}, but total billed is ${claimData.totalBilledAmount}.`);
    }

    const { patientGender, patientAge, diagnosisCodes, procedures } = claimData;

    const allClinicalCodes = [
        ...(diagnosisCodes || []),
        ...(procedures ? procedures.map(p => p.code) : [])
    ];

    if (allClinicalCodes.length > 0) {
        const pregnancyCodes = ['O80', 'O09', 'Z34', '81025', '76801', '76805', '59400']; 
        const hasPregnancyCode = allClinicalCodes.some(code => pregnancyCodes.includes(String(code).toUpperCase()));
        
        if (patientGender === 'Male' && hasPregnancyCode) {
            riskScore += 50;
            flaggedReasons.push("Clinical Mismatch: Gender incompatible (Male patient billed for pregnancy-related code).");
        }

        const newbornCodes = ['P09', 'P29', '99460', '99461', '99462', '99463'];
        const hasNewbornCode = allClinicalCodes.some(code => newbornCodes.includes(String(code).toUpperCase()));

        if (Number(patientAge) > 1 && hasNewbornCode) {
            riskScore += 30;
            flaggedReasons.push("Clinical Mismatch: Age incompatible (Adult billed for newborn condition).");
        }

        const orthoDiagnoses = ['S52', 'M54', 'M25'];
        const obstetricsProcedures = ['76801', '76805', '59400'];
        
        const hasOrthoDx = (diagnosisCodes || []).some(code => orthoDiagnoses.includes(String(code).toUpperCase()));
        const hasObProcedure = (procedures || []).some(p => obstetricsProcedures.includes(String(p.code).toUpperCase()));

        if (hasOrthoDx && hasObProcedure) {
            riskScore += 60;
            flaggedReasons.push("Medical Necessity Mismatch: Obstetrics procedure (CPT) billed under an Orthopedic diagnosis (ICD-10).");
        }
    }

    if (riskScore > 100)
        riskScore = 100;

    return {
        riskScore,
        flaggedReasons
    };
};

module.exports = { runValidationEngine };