const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];;

  if (!token) {
    return res.status(403).json({ message: 'Token is missing' });
  }
  token = token.replace("Bearer ", "")

  jwt.verify(token, 'mysecrety_key', (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};



module.exports = verifyToken