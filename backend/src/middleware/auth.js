import { verifyToken } from '../utils/jwt.js';

export const protect = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        const decoded = verifyToken(token);
        
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Token is not valid'
            });
        }

        req.user = { id: decoded.userId };
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};