import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    // console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    // console.log(token);

    if (!token)
        return res
            .status(401)
            .json({ success: false, message: 'Access token not found' });
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log(error);
        return res
            .status(403)
            .json({ success: false, message: 'Invalid token' });
    }
};

export default verifyToken;
