const { validateToken } = require("../services/auth");

function checkAuthCookie(cookieName) {
  return (req, res, next) => {
    const token = req.cookies[cookieName];
    if (token !== undefined) {
      try {
        const payload = validateToken(token);

        req.user = payload;
      } catch (error) {}
    }

    next();
  };
}
module.exports = {
  checkAuthCookie,
};
