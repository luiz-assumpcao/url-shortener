import jwt from 'jsonwebtoken';

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'missing authorization header' });
    }

    const token = authHeader.split(' ')[1]; // "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: 'malformed authorization header' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.username = payload.username;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'invalid or expired token' });
    }
}

export default authenticate;
