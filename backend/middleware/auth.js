const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied, no token provided' });

  try {
    const bearer = token.split(' ')[1];
    const decoded = jwt.verify(bearer, process.env.JWT_SECRET || 'dreamy_secret');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};
