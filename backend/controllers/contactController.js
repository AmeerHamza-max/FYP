const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// @desc    Submit Contact Form
// @route   POST /api/contact/submit
// @access  Public
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newContact = await Contact.create({ name, email, message });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #42C8F5;">New Message Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
          <hr />
          <p style="font-size: 10px; color: #888;">Sent from Grow Business Contact Form</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: 'Message sent and saved successfully!'
    });

  } catch (error) {
    console.error('Contact Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Could not send message.'
    });
  }
};