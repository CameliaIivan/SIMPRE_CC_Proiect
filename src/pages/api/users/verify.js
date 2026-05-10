import { sendOk, sendUnauthorized } from '../../../../utils/apiMethods';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return sendUnauthorized(res, 'No token provided');
  }

  try {
    console.log('JWT_SECRET in verify:', process.env.JWT_SECRET);
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token in verify:', decoded);
    return sendOk(res, true);
  } catch (err) {
    console.error('Token verification error in verify:', err.message);
    return sendOk(res, false);
  }
}