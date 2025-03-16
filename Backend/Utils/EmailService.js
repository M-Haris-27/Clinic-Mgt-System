import nodemailer from "nodemailer";

export const sendResetPasswordEmail = async (email, resetCode) => {
    try {
        console.log(`📩 Sending reset code to: ${email}`);

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Zoro Clinic" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset Code",
            html: `<p>Your password reset code is: <strong>${resetCode}</strong></p>
                   <p>This code will expire in 10 minutes.</p>`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully!`);

        return true;
    } catch (error) {
        console.error("❌ Email send failed:", error);
        throw new Error("Could not send reset password email. Please try again later.");
    }
};
