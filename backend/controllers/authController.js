const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                success: true,
                msg: "If an account exists with this email, a reset link has been dispatched."
            });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

        const mailOptions = {
            from: `"Grow Business Support" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "🔐 Secure Password Reset",
            html: `
                <div style="background-color: #f8fafc; padding: 50px 20px; font-family: sans-serif; color: #1e293b;">
                    <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #e2e8f0;">
                        <div style="background: #000000; padding: 40px 20px; text-align: center;">
                            <h1 style="color: #42C8F5; margin: 0; font-size: 28px; font-style: italic; font-weight: 900; text-transform: uppercase;">GROW BUSINESS</h1>
                        </div>
                        <div style="padding: 40px; text-align: center;">
                            <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 15px;">Reset Your Password?</h2>
                            <p style="font-size: 15px; color: #64748b; line-height: 1.6; margin-bottom: 30px;">
                                Hello <strong>${user.name}</strong>, click the button below to secure your account.
                            </p>
                            <a href="${resetUrl}" style="display: inline-block; background: #000000; color: #42C8F5; padding: 18px 35px; border-radius: 16px; text-decoration: none; font-weight: 900; font-size: 13px; text-transform: uppercase;">
                                Reset Password
                            </a>
                            <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">This link expires in 1 hour.</p>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, msg: "If an account exists with this email, a reset link has been dispatched." });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
    try {
        const rawToken = req.params.token;
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ msg: "Token is invalid or has expired." });
        }

        if (!req.body.password) {
            return res.status(400).json({ msg: "Please provide a new password" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ success: true, msg: "Password updated successfully." });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};