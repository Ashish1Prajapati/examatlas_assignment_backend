const User = require('../models/User');
const { setUser } = require('../services/auth');

const createUser = async (req, res) => {
    try {
        const { fullName: name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already registered' });
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'User created successfully', success: true });
    } catch (err) {
        res.status(500).json({ message: 'Server error', success: false });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
        const token = setUser(user._id, user.email,user.name)
        res.status(200).json({ token, id: user._id, success: true });
    } catch (err) {
        res.status(500).json({ message: 'Server error', success: false });
    }
};

const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found', success: false });

        res.status(200).json({ user, success: true });
    } catch (err) {
        res.status(500).json({ message: 'Server error', success: false });
    }
};

module.exports = {
    createUser,
    loginUser,
    getUserInfo,
};
