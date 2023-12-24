import { MongoClient } from 'mongodb';

export default (async () => {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client.db('uploads');
})();
