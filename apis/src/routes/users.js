const router = require("express").Router();
const { body, validationResult } = require('express-validator');
const Users = require("../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const checkAuth = require('../util/auth.js');

function generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username
      },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );
}

// Sign up
router.post("/signup",
body('name').not().isEmpty().withMessage('Name is required'),
body('email').isEmail().withMessage('Email is required'),
body('email').isEmail().normalizeEmail(),
body('phone').isMobilePhone(),
body('username').not().isEmpty().withMessage('Username is required'),
body("password").isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1
})
.withMessage("Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number"),
body("confirmPassword").isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1
})
.withMessage("Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number"),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
    }
    const { name, phone, email, username, password, confirmPassword } = req.body;
    try {
        const user = await Users.findOne({ username });
        if (user) return res.status(400).send('Username already exists');
        if (password !== confirmPassword) return res.status(400).send('Passwords do not match');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new Users({
            name,
            phone,
            email,
            username,
            password: hashedPassword,
            createdAt: Date.now()
        });
        const savedUser = await newUser.save();
        const token = generateToken(savedUser);

        res.status(201).json({
            message: 'User created successfully',
            user: savedUser,
            token: token
        });
    } catch (err) {
        res.status(500).json({message: err})
    }
});

//Sign in
router.post("/signin",
body('username').not().isEmpty().withMessage('Username is required'),
body('password').not().isEmpty().withMessage('Password is required'),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
    }
    const { username, password } = req.body;
    try {
        const user = await Users.findOne({ username });
        if (!user) return res.status(400).send('User not found');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');
        const token = generateToken(user);
        res.status(200).json({
            message: 'User logged in successfully',
            user: user,
            token: token
        });
    } catch (err) {
        res.status(500).json({message: err})
    }
});

// get single user profile
router.get("/", checkAuth, async (req, res) => {
    try {
        const user = await Users.findById(req.user.id).select("-password");
        res.status(200).json({
            message: 'User Data',
            data: {
                user
            }
        });
    } catch (err) {
        res.status(500).json({message: err})
    }
});

//Update user profile
router.patch("/update", checkAuth,
body('username').not().isEmpty().withMessage('Username is required'),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
    }
    const { username, name, email, password, phone } = req.body;
    const user = req.user;
    if(user){
    if (user.username !== username) {
        return res.status(400).send('You are not authorized to update this user');
    }}

    try {
        const user = await Users.findOne({ username });
        if (!user) return res.status(400).send('User not found');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const updatedUser = await Users.findOneAndUpdate({ username }, {
            name,
            email,
            phone,
            password: hashedPassword
        }, { new: true });
        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (err) {
        res.status(500).json({message: err})
    }
});

//Delete user
router.delete("/delete", checkAuth,
body('username').not().isEmpty().withMessage('Username is required'),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
    }
    const { username } = req.body;
    const user = req.user;
    if (user.username !== username) {
        return res.status(400).send('You are not authorized to delete this user');
    }
    try {
        const user = await Users.findOne({ username });
        if (!user) return res.status(400).send('User not found');
        await user.remove();
        res.status(200).json({
            message: 'User deleted successfully',
            user: user
        });
    } catch (err) {
        res.status(500).json({message: err})
    }
});

module.exports = router;