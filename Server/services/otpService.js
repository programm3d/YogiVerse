const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

const sendOTP = async (email, otp) => {
    await transporter.sendMail({
        from: `"Yogiverse" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'OTP Verification',
        html: `<p>Your OTP is: <b>${otp}</b>. It will expire in 5 minutes.</p>`,
    });
};

const reporterMail=async (email,message) => {
    await transporter.sendMail({
        from: `"Yogiverse" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Your account is blocked',
        html: `<p>We noticed the unusual activities in your account .your account is currently blocked </p>`,
    });
}



module.exports = {sendOTP, reporterMail};
