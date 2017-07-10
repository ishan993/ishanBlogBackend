import nodemailer from 'nodemailer';

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: 'ishanvadwalablog@gmail.com',
    pass: '!57LesPaul',
  },
});

export const sendRegistrationConfirmation = (user) => {
  // setup email data with unicode symbols
  const mailOptions = {
    from: '"Ishan\'s Blog" <ishanvadwalablog@gmail.com>',
    to: user._id,
    subject: 'Welcome!',
    text: 'Hello world ?',
    html: '<b>Hello world ?</b>',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
};
