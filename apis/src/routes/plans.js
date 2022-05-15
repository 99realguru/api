const router = require("express").Router();
const { body, validationResult } = require('express-validator');
const Plans = require("../models/Plans");
const fetch = require('node-fetch');
const _ = require('lodash');


// get all plans
router.get("/", async (req, res) => {
    try {
        const plans = await Plans.find();
        res.status(200).json({
            message: "All Plans",
            data: {
                plans
            }
        });
    } catch (err) {
        res.status(500).json({message: err})
    }
});



// Add a plan
// router.post("/add",
//     body('name').not().isEmpty().withMessage('Name is required'),
//     body('price').not().isEmpty().withMessage('Price is required'),
//     body('price').isNumeric().withMessage('Price should be a number'),
//     body('description').not().isEmpty().withMessage('Description is required'),
//     body('project_count').not().isEmpty().withMessage('Project count is required'),
//     async (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({
//                 success: false,
//                 errors: errors.array()
//             });
//         }
//         const { name, price, description, project_count } = req.body;
//         try {
//             //check if the plan already exists
//             const plan = await Plans.findOne({ name: name });
//             if (plan) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Plan already exists"
//                 });
//             }
//             const newPlan = await Plans.create({
//                 name,
//                 price,
//                 description,
//                 project_count
//             });
//             res.status(200).json({
//                 message: 'Plan created successfully',
//                 data: {
//                     newPlan
//                 }
//             });
//         } catch (err) {
//             res.status(500).json({
//                 message: err
//             });
//         }
//     });

// get a plan
router.get("/:id", async (req, res) => {
    try {
        const plan = await Plans.findById(req.params.id);
        if (!plan) {
            return res.status(400).json({
                success: false,
                message: "Plan does not exist"
            });
        }
        res.status(200).json({
            message: 'Plan',
            data: {
                plan
            }
        });
    } catch (err) {
        res.status(500).json({
            message: err
        });
    }
});

// update a plan
router.put("/update/:id",
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        const { name, price, description, project_count } = req.body;
        try {
            //check if the plan already exists
            const plan = await Plans.findById(req.params.id);
            if (!plan) {
                return res.status(400).json({
                    success: false,
                    message: "Plan does not exist"
                });
            }
            const updatedPlan = await Plans.findByIdAndUpdate(req.params.id, {
                name,
                price,
                description,
                project_count
            }, { new: true });
            res.status(200).json({
                message: 'Plan updated successfully',
                data: {
                    updatedPlan
                }
            });
        } catch (err) {
            res.status(500).json({
                message: err
            });
        }
    }
);

module.exports = router;