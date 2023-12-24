import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { getSession } from "next-auth/react";
import database from "../../../lib/mongodb";

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function upload(req, res) {
  const session = await getSession({ req });

  if (req.method === 'POST') await uploadPost(req, res, session);
  else if (req.method === 'GET') await uploadGet(req, res);
  else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function uploadPost(req, res, session) {
  if (!session) {
    return res.status(403).json({ message: "You must be signed in to upload." });
  }

  const form = new IncomingForm({
    uploadDir: os.tmpdir(),
    keepExtensions: true,
    maxFileSize: MAX_FILE_SIZE
  });

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        reject(res.status(500).json({ error: err.message }));
        return;
      }

      const file = files.file[0];
      const tempPath = file.filepath;
      const filename = file.originalFilename;

      if (!file) {
        reject(res.status(400).json({ error: 'No file uploaded.' }));
        return;
      }
  
      if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        await fs.unlink(file.filepath);
        reject(res.status(400).json({ error: 'File type is not allowed.' }));
        return;
      }

      const uploadDir = path.resolve('./public/uploads');
      const newPath = path.join(uploadDir, filename);

      try {
        await fs.rename(tempPath, newPath);
        const db = await database;

        const result = await db.collection('articles').insertOne({
          title: fields.title[0],
          description: fields.description[0],
          filepath: `/uploads/${filename}`,
          authorId: session.user.id,
          createdAt: new Date(),
        });

        resolve(res.status(201).json({
          message: 'File uploaded successfully',
          data: { id: result.insertedId }
        }));
      } catch (error) {
        reject(res.status(500).json({ error: error.message }));
      }
    });
  });
}

async function uploadGet(req, res) {
  const db = await database;

  const uploads = await db.collection('articles')
    .find()
    .project({ title: 1 })
    .sort({ createdAt: -1 })
    .toArray();

  res.status(200).json({ uploads });
}
