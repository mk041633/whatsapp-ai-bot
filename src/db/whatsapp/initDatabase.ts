import mongoose from 'mongoose';
import { MongoClient, Collection, Db } from 'mongodb';

/*
const initDatabase = async (): Promise<void> => {
  
  const dbUri: string = 'mongodb+srv://Gekata:loke4ka12e@cluster0.itgxuv9.mongodb.net/Wp_bot';

  try {
    await mongoose.connect(dbUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};
*/
const MONGODB_URI = 'mongodb+srv://Gekata:loke4ka12e@cluster0.itgxuv9.mongodb.net/Wp_bot';
const COLLECTION_NAME = 'kaspi';
const COLLECTION_NAME2 = 'kaspi2';

let db: Db;
let kaspiCollection: Collection;
let kaspiCollection2: Collection;

const initDatabase = async (): Promise<void> => {
  try {
    const client = await MongoClient.connect(MONGODB_URI);

    db = client.db();
    kaspiCollection = db.collection(COLLECTION_NAME);
    kaspiCollection2 = db.collection(COLLECTION_NAME2);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export { initDatabase, kaspiCollection, kaspiCollection2 }; 