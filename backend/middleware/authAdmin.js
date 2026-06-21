const jwt = require('jsonwebtoken');

const authAdmin = (roles = []) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
      req.admin = decoded;

      if (roles.length && !roles.includes(req.admin.role)) {
        return res.status(403).json({ error: `Forbidden: Requires one of roles: ${roles.join(', ')}` });
      }

      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid or expired token.' });
    }
  };
};

module.exports = authAdmin;
