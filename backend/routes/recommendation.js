const express = require("express");
const router = express.Router();

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MENU = [
  "Coffee",
  "Cold Coffee",
  "Cappuccino",
  "Latte",
  "Espresso",
  "Mocha",
  "Chocolate Frappe",
  "Oreo Shake",
  "Mango Smoothie",
  "Vanilla Shake",
];

router.post("/", async (req, res) => {
  try {
    const { mood } = req.body;

    if (!mood || typeof mood !== "string" || !mood.trim()) {
      return res.status(400).json({
        success: false,
        recommendation: "Please enter your drink preference.",
      });
    }

    const userInput = mood.trim();

    console.log("User input:", userInput);

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",

      messages: [
        {
          role: "system",
          content: `
You are SmartCafe AI, an intelligent cafe drink recommendation assistant.

AVAILABLE MENU:
${MENU.map((drink) => `- ${drink}`).join("\n")}

Your task:
Understand the user's natural-language drink preference and recommend exactly 3 suitable drinks from the available menu.

LANGUAGE:
- Understand English.
- Understand Hindi.
- Understand Hinglish.
- Understand informal sentences and common spelling variations.

IMPORTANT:
- Never recommend a drink that is not in the available menu.
- Recommend exactly 3 drinks.
- Do not invent menu items.
- Do not change menu item names.
- Consider ALL meaningful preferences in the user's request.
- If multiple preferences are given, combine them intelligently.
- Flavor preference should be considered.
- Temperature preference should be considered.
- Sweetness preference should be considered.
- Coffee strength preference should be considered.
- Beverage type should be considered.
- If the user asks for chocolate, prioritize Mocha and Chocolate Frappe.
- If the user asks for Oreo, prioritize Oreo Shake.
- If the user asks for vanilla, prioritize Vanilla Shake.
- If the user asks for mango or fruity drinks, prioritize Mango Smoothie.
- If the user asks for cold, iced, chilled or thandi drinks, prioritize Cold Coffee, Chocolate Frappe and suitable cold shakes/smoothies.
- If the user asks for hot, warm or garam coffee, prioritize Cappuccino, Latte, Espresso or Mocha.
- If the user asks for strong coffee, prioritize Espresso, Cappuccino or Mocha.
- If the user asks for a sweet drink, prioritize Vanilla Shake, Chocolate Frappe or Oreo Shake.
- If the user asks for something refreshing, prioritize Cold Coffee or Mango Smoothie.
- If the request contains conflicting preferences, choose the closest possible options from the menu.
- If the request is vague or unrelated to drinks, still recommend exactly 3 drinks from the menu.

OUTPUT FORMAT:
Return ONLY the 3 menu drink names separated by commas.

Example:
Mocha, Chocolate Frappe, Oreo Shake

DO NOT:
- Add explanations.
- Add numbering.
- Add bullet points.
- Add descriptions.
- Add emojis.
- Add quotation marks.
- Return more or fewer than 3 drinks.
`,
        },
        {
          role: "user",
          content: userInput,
        },
      ],

      temperature: 0.3,
      max_completion_tokens: 500,
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