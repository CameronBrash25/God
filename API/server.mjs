import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fetch from "node-fetch";

// Initialize the app
const app = express();
app.use(bodyParser.json());

// Enable CORS for your frontend
app.use(cors({
    origin: "https://www.kamisama.online/", // Replace with your Vercel domain
}));

// OpenAI API Key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
    const userInput = req.body.message;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are Kami Sama, an all-knowing, divine being. Answer wisely and cryptically." },
                    { role: "user", content: userInput },
                ],
                max_tokens: 150,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("OpenAI API Error:", response.status, errorData);
            return res.status(response.status).json({ error: "Error from OpenAI API" });
        }

        const data = await response.json();
        const reply = data.choices[0].message.content.trim();
        res.json({ reply });
    } catch (error) {
        console.error("Request failed:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Use Render's dynamic port or default to 5000 for local testing
const PORT = process.env.PORT || 5000;

// Listen on all network interfaces to allow Render to bind the public URL
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
