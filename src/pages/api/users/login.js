import { connectToDatabase } from '../../../../lib/mongodb';
import { sendOk, sendBadRequest, sendServerError } from '../../../../utils/apiMethods';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendBadRequest(res, 'Method not allowed');
  }

  try {
    const { db } = await connectToDatabase();
    const { email, password } = req.body;

    if (!email || !password) {
      return sendBadRequest(res, 'Email and password are required');
    }

    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return sendBadRequest(res, 'Invalid email or password');
    }

    console.log('User found:', user);
    console.log('Stored password:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return sendBadRequest(res, 'Invalid email or password');
    }

    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { updatedAt: new Date() } }
    );
    console.log('Updated user updatedAt:', new Date());

    console.log('JWT_SECRET in login:', process.env.JWT_SECRET);
    if (!process.env.JWT_SECRET) {
      return sendServerError(res, 'JWT_SECRET is not defined');
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('Generated token:', token);

    return sendOk(res, { token });
  } catch (err) {
    console.error('Error logging in:', err);
    return sendServerError(res, 'Failed to log in');
  }
}