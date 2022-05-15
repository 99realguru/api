const router = require("express").Router();
const { body, validationResult } = require('express-validator');
const Planpurchased = require("../models/Planpurchased");
const checkAuth = require('../util/auth.js');

//get all plans purchased
router.get("/", async (req, res) => {
    try {
        const planspurchased = await Planpurchased.find();
        res.status(200).json({
            message: "All plans purchased",
            data: {
                planspurchased
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//check the user plan and check is it expired or not
router.get("/check",checkAuth, async (req, res) => {
    try {
        const planpurchased = await Planpurchased.findOne({ userId: req.user.id });
        if (!planpurchased) {
            return res.status(400).json({
                success: false,
                message: "You don't have a plan"
            });
        }
        //check if the plan is expired
        //purchase date + 1 year
        const planExpired = await Planpurchased.findOne({ userId: req.user.id });
        const planExpiredDate = new Date(planExpired.createdAt);
        planExpiredDate.setFullYear(planExpiredDate.getFullYear() + 1);
        const currentDate = new Date();
        if (currentDate > planExpiredDate) {
            return res.status(400).json({
                success: false,
                message: "Your plan has expired"
            });
        }
        res.status(200).json({
            message: "Your plan is valid plan",
            data: {
                planpurchased
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//purchase a subscription
router.post("/purchase", checkAuth,
    body('planId').not().isEmpty().withMessage('PlanId is required'),
async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        const { planId } = req.body;
        try {
            //check if the user have purchased any plan if yes update the plan
            const planspurchased = await Planpurchased.findOne({ userId: req.user.id });
            if (planspurchased) {
                await Planpurchased.updateOne({ userId: req.user.id }, { planId });
                res.status(201).json({
                    message: "Plan updated",
                    data: {
                        planspurchased
                    }
                });
            } else {
                const planpurchased = new Planpurchased({
                    userId: req.user.id,
                    planId
                });
                await planpurchased.save();
                res.status(201).json({
                    message: "Plan purchased",
                    data: {
                        planpurchased
                    }
                });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);


//remove user from the plan when the puchasedAt is expired after 1 yr
setInterval(async () => {
    try {
        const plans = await Planpurchased.find();
        plans.forEach(async plan => {
            const users = plan.plan;
            users.forEach(async user => {
                if (user.purchasedAt) {
                    const purchasedAt = new Date(user.purchasedAt);
                    const currentDate = new Date();
                    const diff = currentDate.getTime() - purchasedAt.getTime();
                    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
                    if (diffDays > 365) {
                        const index = plan.plan.findIndex(user => user.username === user.username);
                        plan.plan.splice(index, 1);
                        await plan.save();
                    }
                }
            });
        });
    } catch (err) {
        console.log(err);
    }
}, 1000 * 60 * 60 * 24);

module.exports = router;
