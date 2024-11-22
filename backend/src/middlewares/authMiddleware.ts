import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Extend Request interface to include user data
declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
    authorId?: number;
  }
}

interface CustomJwtPayload extends JwtPayload {
  userId: number;
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const SECRET_KEY = process.env.JWT_SECRET;
    if (!SECRET_KEY) {
      throw new Error('JWT Secret is not defined');
    }

    const decoded = jwt.verify(token, SECRET_KEY) as CustomJwtPayload;
    
    req.user = decoded;
    
    req.body.authorId = decoded.userId;
  

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
    } else if (err instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ message: 'Invalid token' });
    } else {
      res.status(500).json({ message: 'Authentication error' });
    }
  }
};