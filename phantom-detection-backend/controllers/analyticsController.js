const Claim = require('../models/Claim');

const getDashboardInsights = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [kpiMetrics, thirtyDayTrend, topHospitals] = await Promise.all([
            
            Claim.aggregate([
                {
                    $match: { riskScore: { $gt: 0 } }
                },
                { 
                    $group: { 
                        _id: null,
                        totalFlaggedClaims: { $sum: 1 }, 
                        totalIntercepted: { 
                            $sum: { 
                                $cond: [{ $eq: ["$status", "Rejected"] }, "$totalBilledAmount", 0] 
                            } 
                        }
                    } 
                }
            ]),

            Claim.aggregate([
                {
                    $match: { createdAt: { $gte: thirtyDaysAgo } }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        totalClaims: { $sum: 1 },
                        flaggedClaims: { 
                            $sum: { $cond: [{ $gt: ["$riskScore", 0] }, 1, 0] } 
                        }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]),

            Claim.aggregate([
                {
                    $match: { riskScore: { $gt: 0 } }
                },
                {
                    $group: {
                        _id: "$providerId",
                        flagCount: { $sum: 1 },
                        totalInflatedDollars: { $sum: "$totalBilledAmount" }
                    }
                },
                {
                    $sort: { flagCount: -1 }
                },
                {
                    $limit: 5
                }
            ])
        ]);

        res.status(200).json({
            kpi: kpiMetrics[0] || { totalIntercepted: 0, totalFlaggedClaims: 0 },
            trend: thirtyDayTrend,
            topHospitals: topHospitals
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to generate analytics" });
    }
};

module.exports = { getDashboardInsights };