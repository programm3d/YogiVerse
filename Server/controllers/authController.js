const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/User');
const redis = require('../config/redisClient');
const {sendOTP} = require('../services/otpService');
const bcrypt = require('bcrypt');
const validatePassword =require('../services/validatePasswordStrength')



const requestResetOTP = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist' });
        }

        const rateKey = `otp-limit:${email}`;
        const attempts = await redis.incr(rateKey);

        if (attempts === 1) {
            await redis.expire(rateKey, 900); // 15 minutes
        }

        if (attempts > 3) {
            const ttl = await redis.ttl(rateKey);
            return res.status(429).json({
                message: `Too many OTP requests. Try again in ${ttl} seconds.`,
            });
        }

        // Generate and send OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await redis.set(`reset-otp:${email}`, otp, 'EX', 300); // 5 min
        await sendOTP(email, otp);

        res.status(200).json({ message: 'OTP sent to your email for password reset' });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email});
        if (!user) {
            throw createError(401, 'Invalid credentials');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw createError(401, 'Invalid credentials');
        }

        if (user.status === 'blocked') {
            throw createError(403, 'Your account has been blocked');
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePic:user.profilePic
            }
        });
    } catch (err) {
        next(err);
    }
};

const logout = (req, res) => {
    res.clearCookie('access_token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};



const requestOTP = async (req, res, next) => {
    const { email, username } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "Email or Username already in use" });
        }

        // 🛡️ Rate Limiting: max 3 requests per 15 minutes
        const rateKey = `otp-limit:${email}`;
        const attempts = await redis.incr(rateKey);

        if (attempts === 1) {
            await redis.expire(rateKey, 300); // 15 minutes = 900 seconds
        }

        if (attempts > 3) {
            const ttl = await redis.ttl(rateKey);
            return res.status(429).json({
                message: `Too many OTP requests. Try again in ${ttl} seconds.`,
            });
        }

        // ✅ Generate and store OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await redis.set(`otp:${email}`, otp, 'EX', 300); // expires in 5 minutes
        await sendOTP(email, otp);

        res.status(200).json({ message: 'OTP sent to your email.' });
    } catch (err) {
        next(err);
    }
};



const registerWithOTP = async (req, res, next) => {
    const { email, username, password, otp } = req.body;

    try {
        const storedOTP = await redis.get(`otp:${email}`);

        if (!storedOTP || storedOTP !== otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        let validPassword =  validatePassword(password);
        if(!validPassword.valid) {
            return res.status(400).json(validPassword);
        }

        const user = new User({ username, email, password });
        await user.save();

        await redis.del(`otp:${email}`); // remove OTP after success

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        });
    } catch (err) {
        next(err);
    }
};


const resetPasswordWithOTP = async (req, res, next) => {
    const { email, otp, newPassword } = req.body;

    try {
        const storedOTP = await redis.get(`reset-otp:${email}`);
        if (!storedOTP || storedOTP !== otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        let validPassword =  validatePassword(newPassword);
        if(!validPassword.valid) {
            return res.status(400).json(validPassword);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await User.findOneAndUpdate({ email }, { password: hashedPassword });

        await redis.del(`reset-otp:${email}`); // Clean up OTP

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Password successfully reset' });
    } catch (err) {
        next(err);
    }
};


module.exports = {

    login,
    logout,
    requestOTP,
    registerWithOTP,
    resetPasswordWithOTP,
    requestResetOTP
};

