const router = require("express").Router();
const { body, validationResult } = require('express-validator');
const Workspaces = require("../models/Workspaces");
const Planpurchased = require("../models/Planpurchased");
const Plans = require("../models/Plans");
const checkAuth = require('../util/auth.js');
const fetch = require('node-fetch');
const _ = require('lodash');

// All Workspaces
router.get("/", checkAuth, async (req, res) => {
    try {
        const workspaces = await Workspaces.find();
        res.status(200).json({
            message: "All Projects",
            data: {
                workspaces
            }
        });
    } catch (err) {
        res.status(500).json({message: err})
    }
});

//Create a workspace
router.post("/publish", checkAuth,
    body('title').not().isEmpty().withMessage('Title is required'),
    body('project').not().isEmpty().withMessage('Project is required'),
    body('theme').not().isEmpty().withMessage('Theme is required'),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
    }
    const { title, project, theme, path, published, publish_status, domain_name } = req.body;
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
        // Project allowed count
        const plan = await Plans.findOne({ _id: planpurchased.planId });
        const projectCount = await Workspaces.find({ userId: req.user.id });
        if (projectCount.length >= plan.project_count) {
            return res.status(400).json({
                success: false,
                message: "You have reached the maximum number of projects"
            });
        }
        //check if the title is already published
        const workspace = await Workspaces.findOne({ title });
        if (workspace) {
            return res.status(400).json({
                success: false,
                message: "Title already exists"
            });
        }
        const workspace_add = new Workspaces({
            title,
            project,
            theme,
            path,
            userId: req.user.id,
            username: req.user.username,
            published,
            publish_status,
            domain_name
        });
        await workspace_add.save();
        res.status(201).json({
            message: "Project created",
            data: {
                workspace_add
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Update the workspace
router.put("/update/:id", checkAuth,
    body('title').not().isEmpty().withMessage('Title is required'),
    body('project').not().isEmpty().withMessage('Project is required'),
    body('theme').not().isEmpty().withMessage('Theme is required'),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
    }
    const { id } = req.params;
    const { title, project, theme, path, published, publish_status, domain_name } = req.body;
    try {
        //check if the title is already published
        const workspace = await Workspaces.findOne({ title });
        if (workspace) {
            return res.status(400).json({
                success: false,
                message: "Title already exists"
            });
        }
        const workspace_already = await Workspaces.findOne({ _id: id, userId: userId });
        if (!workspace_already) {
            return res.status(400).json({
                success: false,
                message: "Workspace does not exist"
            });
        }
        const updatedWorkspace = await Workspaces.findOneAndUpdate({ _id: id }, {
            title,
            project,
            theme,
            path,
            published,
            publish_status,
            domain_name
        }, { new: true });
        res.status(200).json({
            message: 'Workspace updated successfully',
            data: {
                updatedWorkspace
            }
        });
    } catch (err) {
        res.status(500).json({
            message: err
        });
    }
});

//Delete the workspace
router.delete("/delete/:id", checkAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const workspace = await Workspaces.findOne({ _id: id, userId: req.user.userId });
        if (!workspace) {
            return res.status(400).json({
                success: false,
                message: "Workspace does not exist"
            });
        }
        await Workspaces.findOneAndDelete({ _id: id });
        res.status(200).json({
            message: 'Workspace deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            message: err
        });
    }
});

module.exports = router;




