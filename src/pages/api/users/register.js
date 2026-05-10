import { connectToDatabase } from '../../../../lib/mongodb';
import { sendOk, sendBadRequest, sendServerError } from '../../../../utils/apiMethods';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendBadRequest(res, 'Method not allowed');
  }

  try {
    const { db } = await connectToDatabase();
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return sendBadRequest(res, 'Username, email, and password are required');
    }

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return sendBadRequest(res, 'Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Inserting new user:', newUser);
    const result = await db.collection('users').insertOne(newUser);
    console.log('User insertion result:', result);

    return sendOk(res, { msg: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    return sendServerError(res, `Failed to register user: ${err.message}`);
  }
}