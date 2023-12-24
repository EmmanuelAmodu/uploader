import { getSession } from "next-auth/react";
import database from "../../../lib/mongodb";
import { ObjectId } from 'mongodb';

export default async function upload(req, res) {
  const session = await getSession({ req });
  const { id } = req.query;

  if (!session) {
    return res.status(403).json({ message: "You must be signed in to upload." });
  }

  if (req.method === 'GET') {
    const db = await database;

    if (!id) {
      res.status(400).json({ error: 'Missing id.' });
      return;
    }
  
    const upload = await db.collection('articles').findOne({ _id: new ObjectId(id) });
    if (!upload) {
      res.status(404).json({ error: 'Upload not found.' });
      return;
    }

    res.status(200).json(upload);
  }
  else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
