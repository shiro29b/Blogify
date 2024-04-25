const JWT = require("jsonwebtoken");

const secretKey = "9137043104shreedhar";

function createToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    profileImage: user.profileImageURL,
    role: user.role,
  };
  const token = JWT.sign(payload, secretKey);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secretKey);
  
  return payload;
}
module.exports = {
  createToken,
  validateToken,
};
