
const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token, authorization denied' });

  const token = header.split(' ')[1];         // expects “Bearer <token>”
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;                        // attach payload to req.user
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

module.exports = authenticate;
