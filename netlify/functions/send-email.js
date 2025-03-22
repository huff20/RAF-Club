require("dotenv").config();
const axios = require("axios");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { fullName, email, passcode } = JSON.parse(event.body);

        if (!fullName || !email || !passcode) {
            return { statusCode: 400, body: JSON.stringify({ message: "Missing fields" }) };
        }

        const OTPMessage = `
                <h2>One-Time Password</h2>
                <p>Hello, <strong>${fullName}</strong>. To authenticate your vote, please use the following One Time Password (OTP):</p>
                <h1>${passcode}</h1>
                <p>Do not share this OTP with anyone. If you didn't make this request, you can safely ignore this email.<br>The Reptiles, Amphibians and Fish Club (RAF) will never contact you about this email or ask for any login codes or links. Beware of phishing scams.<br><br>Thank you for voting in the RAF Club Animal Naming Competition. Please remember that you must <strong>verify your identity to make your vote count</strong> by submitting the OTP into the correct field!<br><br>If you did not request this code, you can safely ignore this email.</p>`;

        const response = await axios.post("https://api.brevo.com/v3/smtp/email", {
            method:"POST",
            sender: { email: process.env.BREVO_SENDER_EMAIL },
            to: [{ email }],
            subject: "RAF Club Animal Naming Competition: One-Time Password",
            htmlContent: OTPMessage;
        }, {
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.BREVO_API_KEY
            }
        });

        return { statusCode: 200, body: JSON.stringify({ success: true, messageId: response.data.messageId }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ success: false, error: error.message }) };
    }
};
