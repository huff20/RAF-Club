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

        const response = await axios.post("https://api.brevo.com/v3/smtp/email", {
            sender: { email: process.env.BREVO_SENDER_EMAIL },
            to: [{ email }],
            subject: "Your OTP Code",
            htmlContent: `<h2>Your One-Time Password</h2><p>${passcode}</p>`
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
