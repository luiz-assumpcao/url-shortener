import jwt from 'jsonwebtoken';

function extractToken(authHeader) {
    if (!authHeader) return null;

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) return null;

    return token;
}

function authenticate(req, res, next) {
    const token = extractToken(req.headers.authorization);

    if (!token) {
        return res.status(401).json({ error: 'missing or malformed authorization header' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.id;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'invalid or expired token' });
    }
}

export { extractToken };
export default authenticate;
