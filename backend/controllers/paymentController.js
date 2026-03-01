const Subscription = require('../models/Subscription');

// @desc    Subscribe to a Plan
// @route   POST /api/payments/subscribe
// @access  Private
exports.subscribeToPlan = async (req, res) => {
    try {
        const { planName, billingCycle, price } = req.body;

        const endDate = new Date();
        if (billingCycle === 'annual') {
            endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
            endDate.setMonth(endDate.getMonth() + 1);
        }

        // Purani active subscription expire kar dein
        const existingSub = await Subscription.findOne({ user: req.user.id, status: 'active' });
        if (existingSub) {
            existingSub.status = 'expired';
            await existingSub.save();
        }

        const newSubscription = new Subscription({
            user: req.user.id,
            planName,
            billingCycle,
            price,
            endDate
        });

        await newSubscription.save();

        res.status(201).json({
            success: true,
            msg: `🚀 Plan ${planName} has been successfully activated!`,
            subscription: newSubscription
        });

    } catch (err) {
        console.error("Payment Error:", err.message);
        res.status(500).json({ success: false, msg: "Server Error during subscription." });
    }
};

// @desc    Get Subscription Status
// @route   GET /api/payments/my-subscription
// @access  Private
exports.getSubscriptionStatus = async (req, res) => {
    try {
        const sub = await Subscription.findOne({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(sub);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};