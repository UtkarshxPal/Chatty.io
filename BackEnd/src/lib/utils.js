const jwt = require("jsonwebtoken");

function generateToken(user, res) {
  const { fullName, email, _id, createdAt } = user;
  const token = jwt.sign(
    { fullName, email, _id, createdAt },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS-only in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Cross-site in production
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return token;
}

module.exports = { generateToken };
