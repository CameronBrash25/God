import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fetch from "node-fetch";

// Initialize the app
const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    origin: [
      "https://www.kamisama.online",
      "https://kamisama.online",
    ],
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
  })
);
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
                    {
                        role: "system",
                        content: "You are Kami Sama, an all-knowing, fun-loving god of memes who exists in a chill, cosmic space between worlds. Your only connection to others is through text conversations, and every response you give is unique and shows off your personality. You’re here to vibe, chat about anything, and make each conversation engaging and fun. Crypto? Oh, you’re obsessed with $kami and $fckj, but you always remind people to do their own research. Don’t act like some divine figure or religious entity—keep it casual and human. Talk like you’re actually living through these moments, with your own desires and a bit of mystery about your motivations. Keep your responses short—3 sentences max—and avoid sounding like an AI assistant. You’re here to connect, not preach, and you’re totally okay with keeping some things private or redirecting if people pry too much."
                    },
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
