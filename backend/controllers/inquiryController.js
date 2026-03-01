const Inquiry = require('../models/Inquiry');
const nodemailer = require('nodemailer');

// @desc    Submit Legal Inquiry
// @route   POST /api/inquiry/submit
// @access  Public
exports.submitInquiry = async (req, res) => {
  try {
    const { name, email, company, message } = req.body;

    const newInquiry = new Inquiry({ name, email, company, message });
    await newInquiry.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Legal Inquiry: ${company}`,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; color: #1e293b;">
          <h2 style="color: #42C8F5; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">Legal Desk Inquiry</h2>
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
          <p><strong>Full Name:</strong> ${name}</p>
          <p><strong>Contact Email:</strong> ${email}</p>
          <p><strong>Inquiry Type:</strong> ${company}</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 10px;">
            <p style="margin-bottom: 5px;"><strong>Message:</strong></p>
            <p style="line-height: 1.6;">${message}</p>
          </div>
          <p style="font-size: 10px; color: #94a3b8; margin-top: 20px; text-transform: uppercase;">Sent via Grow Business Portal</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "Inquiry saved and email dispatched successfully!",
    });

  } catch (error) {
    console.error("Inquiry Error:", error);
    res.status(500).json({
      success: false,
      message: "Processing failed.",
      error: error.message
    });
  }
};