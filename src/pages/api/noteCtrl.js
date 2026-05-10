import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { sendOk, sendBadRequest, sendNotFound, sendServerError } from '../../../utils/apiMethods';
import { auth } from '../../../utils/auth';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('notes');

    if (req.method === 'GET') {
      await auth(req, res, async () => {
        const { id } = req.query;
        if (id) {
          if (!ObjectId.isValid(id)) {
            return sendBadRequest(res, 'Invalid note ID');
          }
          const note = await collection.findOne({ _id: new ObjectId(id), user_id: req.user.id });
          console.log('Fetched note for ID:', id, 'Result:', note);
          if (!note) {
            return sendNotFound(res, 'Note not found or not authorized');
          }
          return sendOk(res, note);
        } else {
          const notes = await collection.find({ user_id: req.user.id }).toArray();
          console.log('Notes fetched from DB:', notes);
          return sendOk(res, notes);
        }
      });
    } else if (req.method === 'POST') {
      await auth(req, res, async () => {
        const { title, content, date } = req.body;
        if (!title || !content) {
          return sendBadRequest(res, 'Title and content are required');
        }
        const newNote = {
          title,
          content,
          date: date ? new Date(date) : new Date(),
          user_id: req.user.id,
          name: req.user.name,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const result = await collection.insertOne(newNote);
        return sendOk(res, { msg: 'Created a note', ...result });
      });
    } else if (req.method === 'PUT') {
      await auth(req, res, async () => {
        const { id } = req.query;
        const { title, content, date } = req.body;
        if (!ObjectId.isValid(id)) {
          return sendBadRequest(res, 'Invalid note ID');
        }
        const result = await collection.updateOne(
          { _id: new ObjectId(id), user_id: req.user.id },
          { $set: { title, content, date: date ? new Date(date) : new Date(), updatedAt: new Date() } }
        );
        if (result.matchedCount === 0) {
          return sendNotFound(res, 'Note not found or not authorized');
        }
        return sendOk(res, { msg: 'Note updated' });
      });
    } else if (req.method === 'DELETE') {
      await auth(req, res, async () => {
        const { id } = req.query;
        if (!ObjectId.isValid(id)) {
          return sendBadRequest(res, 'Invalid note ID');
        }
        const result = await collection.deleteOne({ _id: new ObjectId(id), user_id: req.user.id });
        if (result.deletedCount === 0) {
          return sendNotFound(res, 'Note not found or not authorized');
        }
        return sendOk(res, { msg: 'Note deleted' });
      });
    } else {
      return sendBadRequest(res, 'Method not allowed');
    }
  } catch (err) {
    console.error('API error:', err);
    return sendServerError(res, err.message);
  }
}