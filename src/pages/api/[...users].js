import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendOk, sendBadRequest, sendServerError } from '../../../utils/apiMethods';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const { users } = req.query;
    console.log('Request query:', req.query);
    console.log('Users array:', users);

    const action = users && users.length > 1 && users[0] === 'users' ? users[1] : (users && users.length > 0 ? users[0] : null);
    console.log('Action:', action);

    if (!action) {
      return sendBadRequest(res, 'No action specified in route');
    }

    if (req.method === 'POST' && action === 'register') {
      const { username, email, password } = req.body;
      const user = await db.collection('users').findOne({ email });
      if (user) {
        return sendBadRequest(res, 'The email already exists');
      }
      const usernameExists = await db.collection('users').findOne({ username });
      if (usernameExists) {
        return sendBadRequest(res, 'Username already exists');
      }
      const passwordHash = await bcrypt.hash(password, 10);
      await db.collection('users').insertOne({
        username,
        email,
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return sendOk(res, { msg: 'Sign up successful' });
    }

    if (req.method === 'POST' && action === 'login') {
      const { email, password } = req.body;
      const user = await db.collection('users').findOne({ email });
      if (!user) {
        return sendBadRequest(res, 'User does not exist');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return sendBadRequest(res, 'Incorrect password');
      }
      const payload = { id: user._id.toString(), name: user.username };
      console.log('JWT_SECRET:', process.env.JWT_SECRET); 
      if (!process.env.JWT_SECRET) {
        return sendServerError(res, 'JWT_SECRET is not defined');
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
      return sendOk(res, { token });
    }

    if (req.method === 'GET' && action === 'verify') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(200).json(false);
      }
      if (!process.env.JWT_SECRET) {
        return sendServerError(res, 'JWT_SECRET is not defined');
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });
      if (!user) {
        return res.status(200).json(false);
      }
      return res.status(200).json(true);
    }

    return sendBadRequest(res, `Route not found: /api/users/${action}`);
  } catch (err) {
    console.error('API error:', err);
    return sendServerError(res, err.message);
  }
}