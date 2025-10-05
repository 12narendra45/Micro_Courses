const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
 
  let token = null;
  if (req.headers["x-auth-token"]) {
    token = req.headers["x-auth-token"];
  } else if (req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');

    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }

  }
  if (!token) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'No token provided' } })
};

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET );
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } });
  }
}


function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } });
    }
    next();
  };
}

module.exports = { authenticate, requireRole };
