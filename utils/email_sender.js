const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: process.env.MAIL_USERNAME, 
            to: to,
            subject: subject,
            text: text
        })        
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {sendEmail}