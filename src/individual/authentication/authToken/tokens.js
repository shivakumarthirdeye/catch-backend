require("dotenv").config();
const jwt = require("jsonwebtoken");

// This function generate access token

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10d" });
}

module.exports = generateAccessToken;
