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

        const data = await response.json();
        const reply = data.choices[0].message.content.trim();
        res.json({ reply });
    } catch (error) {
        console.error("Error with OpenAI API:", error);
        res.status(500).json({ error: "Something went wrong with the API" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));