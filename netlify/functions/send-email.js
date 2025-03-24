require("dotenv").config();
const nodemailer = require("nodemailer");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }
    const { emailType, fullName, email, passcode, csvData } = JSON.parse(event.body);
    if (emailType === "otp") {
        const OTPMessage = `
                <h2>One-Time Password</h2>
                <p>Hello, <strong>${fullName}</strong>. To authenticate your vote, please use the following One Time Password (OTP):</p>
                <h1>${passcode}</h1>
                <p>Do not share this OTP with anyone. If you didn't make this request, you can safely ignore this email.<br>The Reptiles, Amphibians and Fish Club (RAF) will never contact you about this email or ask for any login codes or links. Beware of phishing scams.<br><br>Thank you for voting in the RAF Club Animal Naming Competition. Please remember that you must <strong>verify your identity to make your vote count</strong> by submitting the OTP into the correct field!<br><br>If you did not request this code, you can safely ignore this email.</p>`;

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: "RAF Club Animal Naming Competition: One-Time Password For " + fullName,
            text: OTPMessage
        };

        try {
            await transporter.sendMail(mailOptions);
            return { statusCode: 200, body: JSON.stringify({ success: true, messageId: response.data.messageId }) };
        } catch (error) {
            return { statusCode: 500, body: JSON.stringify({ success: false, error: error.message }) };
        }
    } else if (emailType === "VotingResult") {
        const VotingResultMessage = `<h2>Name: ${fullName}<br>Email: ${email}</h2><p>${csvData}</p>`;

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: process.env.SMTP_RESULTS,
            subject: "Voting Results - RAF Club Animal Naming Competition",
            text: VotingResultMessage
        };

        try {
            await transporter.sendMail(mailOptions);
            return { statusCode: 200, body: JSON.stringify({ success: true, messageId: response.data.messageId }) };
        } catch (error) {
            return { statusCode: 500, body: JSON.stringify({ success: false, error: error.message }) };
        }
    }
};
