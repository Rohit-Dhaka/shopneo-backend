const jwt = require("jsonwebtoken");

const genreateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

module.exports = genreateToken;
