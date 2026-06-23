const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === "admin@smartcafe.com" &&
    password === "123456"
  ) {
    const token = jwt.sign(
      { email },
      "smartcafe_secret",
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      token,
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid Credentials",
  });
});

module.exports = router;