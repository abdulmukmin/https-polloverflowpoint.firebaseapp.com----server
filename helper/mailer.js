const nodemailer = require('nodemailer');

function mailer ( email, subject, html, cb ) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: process.env.userMail,
               pass: process.env.passMail
        }
    });
    
    const mailOptions = {
        from: 'pollOverflowPoint@grouppoint.online', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        html: html// plain text body
    };
    
     transporter.sendMail(mailOptions, function (err) {
        if(err)
            cb (err)
        else
            cb (null);
     });
}

module.exports = mailer
