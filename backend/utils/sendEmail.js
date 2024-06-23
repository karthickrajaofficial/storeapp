
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'jewelbyshree@gmail.com',
            pass: 'kino aqjh fbor bgkw',
        },
    });

    const mailOptions = {
        from: `Your App <your-email@gmail.com>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ', error);
        throw new Error('Error sending password reset email');
    }
};

export default sendEmail;
