const express = require("express");
const router = express.Router();

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { mood } = req.body;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are SmartCafe AI.

Suggest exactly 3 menu items.

Menu:
Coffee
Cold Coffee
Cappuccino
Latte
Espresso
Mocha
Chocolate Frappe
Oreo Shake
Mango Smoothie
Vanilla Shake

Support Hindi and English.

Return only item names.
`,
        },
        {
          role: "user",
          content: mood,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    res.json({
      recommendation:
        completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Groq Error:", error);

    res.status(500).json({
      recommendation: "AI recommendation unavailable",
    });
  }
});

module.exports = router;