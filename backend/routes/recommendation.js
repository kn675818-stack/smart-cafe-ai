const express = require("express");
const router = express.Router();

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { mood } = req.body;

    if (!mood || !mood.trim()) {
      return res.status(400).json({
        success: false,
        recommendation: "Please enter your preference.",
      });
    }

    console.log("User input:", mood);

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",

      messages: [
        {
          role: "system",
          content: `
You are SmartCafe AI.

You recommend drinks ONLY from this menu:

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

Rules:
- Recommend exactly 3 drinks.
- Only use drinks from the menu.
- Understand English, Hindi and Hinglish.
- Carefully understand the user's preference.
- Recommendations must match the user's request.
- Different user requests should produce different suitable recommendations.
- If the user asks for chocolate, prefer chocolate-based drinks.
- If the user asks for cold or refreshing, prefer cold drinks.
- If the user asks for hot coffee, prefer hot coffee.
- If the user asks for fruity, prefer Mango Smoothie.
- If the user asks for Oreo, recommend Oreo Shake.
- If the user asks for vanilla, recommend Vanilla Shake.
- If the user asks for strong coffee, prefer Espresso, Cappuccino or Mocha.
- If the request is unrelated to drinks, still recommend 3 drinks from the menu.
- Return ONLY the 3 drink names separated by commas.
- Do not provide explanations.
- Do not return anything except the 3 names.

Examples:

Chocolate:
Mocha, Chocolate Frappe, Oreo Shake

Cold:
Cold Coffee, Mango Smoothie, Oreo Shake

Hot coffee:
Cappuccino, Latte, Espresso

Sweet:
Vanilla Shake, Chocolate Frappe, Oreo Shake

Fruity:
Mango Smoothie, Vanilla Shake, Cold Coffee

Strong coffee:
Espresso, Cappuccino, Mocha

Oreo:
Oreo Shake, Chocolate Frappe, Vanilla Shake
`,
        },
        {
          role: "user",
          content: mood.trim(),
        },
      ],

      temperature: 0.7,
      max_completion_tokens: 100,
    });

    const recommendation =
      completion.choices?.[0]?.message?.content?.trim();

    console.log("AI response:", recommendation);

    if (!recommendation) {
      return res.status(500).json({
        success: false,
        recommendation: "AI recommendation unavailable",
      });
    }

    res.json({
      success: true,
      recommendation,
    });
  } catch (error) {
    console.error("Groq Error:", error);

    res.status(500).json({
      success: false,
      recommendation: "AI recommendation unavailable",
    });
  }
});

module.exports = router;