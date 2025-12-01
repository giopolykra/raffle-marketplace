const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST, // e.g., 'smtp.gmail.com'
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = {
  sendWinEmail: async (userEmail, raffleName, ticketNum) => {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `You Won! 🎉 ${raffleName}`,
      html: `<p>Congrats! Your ticket #${ticketNum} won. Check your dashboard for shipping.</p>`
    });
  },

  sendRefundEmail: async (userEmail, raffleName, amount) => {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Raffle Refund Processed',
      html: `<p>Sorry, ${raffleName} didn't meet the threshold. Refunding $${amount} to your card.</p>`
    });
  }
};