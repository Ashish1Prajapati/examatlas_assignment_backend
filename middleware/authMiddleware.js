const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeaderValue = req.headers["authorization"];
    req.user = null;

    if (!authHeaderValue || !authHeaderValue.startsWith("Bearer ")) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }
    const token = authHeaderValue.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = verifyToken;
