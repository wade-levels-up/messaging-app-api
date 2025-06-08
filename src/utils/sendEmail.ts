import nodemailer from 'nodemailer';

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

  const verificationLink = `${process.env.CLIENT}/verify-email?token=${verificationToken}`;

    await transporter.sendMail({
        from: '"Budding Messenger" <budding.messenger@gmail.com>',
        to,
        subject: 'Verify your email address',
        html: `<p>Click the link below to verify your email address:</p>
             <a href="${verificationLink}">${verificationLink}</a>`,
    });

    console.log(`Sent email to: ${to}`);

    } catch(error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error(String(error));
        }
    }
}