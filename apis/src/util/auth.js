const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

module.exports = (req,res,next)=> {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];
    if (token) {
      try {
        const verify = jwt.verify(token,process.env.SECRET_KEY);
        req.user = verify;
        return next();
      } catch (err) {
        res.status(400).json({ error: "Invalid/Expired Token" });
      }
    }
    res.status(400).json({ error: "Authentication token should contain 'Bearer [token]" });
  }
  res.status(400).json({ error: "Authorization header is required" });

};
