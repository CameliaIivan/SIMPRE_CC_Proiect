import jwt from 'jsonwebtoken';
import { sendBadRequest, sendUnauthorized } from './apiMethods';

export const auth = async (req, res, callback) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return sendUnauthorized(res, 'No token provided');
  }

  try {
    console.log('JWT_SECRET in auth:', process.env.JWT_SECRET);
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded;
    return await callback();
  } catch (err) {
    console.error('Token verification error:', err.message);
    return sendUnauthorized(res, 'Invalid token');
  }
};