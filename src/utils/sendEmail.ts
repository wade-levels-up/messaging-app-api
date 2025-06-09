import nodemailer from 'nodemailer';
import path from 'path';
import verificationEmail from '../emailTemplates/verificationEmail'

export async function sendVerificationEmail(to: string, verificationToken: string) {
    try {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

  const verificationLink = `${process.env.CLIENT}/verify-user?token=${verificationToken}`;

    await transporter.sendMail({
        from: '"Budding Messenger" <budding.messenger@gmail.com>',
        to,
        subject: 'Verify your email address',
        html: verificationEmail('Budding Messenger', verificationLink),
        attachments: [
            {
            filename: 'business-logo.gif',
            path: path.join(__dirname, '../../public/business-logo.gif'),
            cid: 'businesslogo'
            }
        ]
    });

    } catch(error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error(String(error));
        }
    }
}