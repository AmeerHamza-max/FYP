require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// 1. Database Connection
connectDB();

// 2. Middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '10kb' }));

// 3. Rate Limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { msg: "Too many requests, please try again later." }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { msg: "Too many attempts. Please try again later." }
});

// Scraper Limit: TikTok, FB, aur YouTube teeno ke liye
const scraperLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 Hour
    max: 100, 
    message: { msg: "Scraper limit reached for this hour. Please wait." }
});

app.use(generalLimiter);
app.use('/api/auth/login',           authLimiter);
app.use('/api/auth/register',        authLimiter);

// 🔥 Ab ye limit TikTok, Facebook aur YouTube teeno par apply hogi
app.use('/api/scraper', scraperLimiter); 

// 4. Routes
app.use('/api/auth',        require('./routes/authRoutes'));
app.use('/api/campaigns',   require('./routes/campaignRoutes'));
app.use('/api/payments',    require('./routes/paymentRoutes'));
app.use('/api/contact',     require('./routes/contactRoutes'));
app.use('/api/inquiry',     require('./routes/inquiryRoutes'));
app.use('/api/influencers', require('./routes/influencerRoutes'));

// --- UNIFIED SCRAPER ROUTE ---
// Is route ke andar ab TikTok, Facebook aur YouTube teeno controllers kaam karenge
app.use('/api/scraper',     require('./routes/scraperRoutes')); 

// 5. Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 6. Global Error Handler
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        msg: err.message || "Internal Server Error"
    });
});

// 7. 404 Handler
app.use((req, res) => {
    res.status(404).json({ msg: "Route not found" });
});

// 8. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Multi-Platform Scraper Ready: TikTok, FB, YouTube`);
    console.log(`📈 Limit: 100 requests/hr applied to /api/scraper`);
});