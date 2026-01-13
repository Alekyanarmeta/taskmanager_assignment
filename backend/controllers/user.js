const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');


router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        console.log("hii", newUser);


        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



router.post('/login', async (req, res) => {
    try {
        console.log("user", req.body);
        const { email, password } = req.body;


        const user = await User.findOne({ email });
        if (!user) {
            console.log("no user");
            return res.json({ message: 'Invalid credentials' });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ message: 'Invalid credentials' });
        }


        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        console.log("token", token);

        return res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/profile', auth, async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
});
module.exports = router;    