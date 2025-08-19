import nodemailer from "nodemailer"

//create transporter
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    auth:{
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,

    },
    port: 587,
});

const sendEmail = async({to, subject, body}) => {
    try {
        const response = await transporter.sendMail({
        from: "FriendNest",
        to: `${to}`,
        subject: `${subject}`,
        html: `${body}`,
    });
    return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export default sendEmail;