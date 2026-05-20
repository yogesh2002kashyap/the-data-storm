const User = require('../models/User');

const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Name, Email and Password is required',
            });
        }

        const newUser = await User.create({ name, email, password });

        res.status(200).json({
            status: 'success',
            message: 'User created successfully',
            data: newUser,
        });
    }
    catch(err) {
        if(err.name === 'ValidationError') {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }

        // Duplicate Email
        if(err.code === 11000) {
            return res.status(409).json({
                status: 'error',
                message: 'Email already exists',
            });
        }

        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
}

module.exports = createUser;