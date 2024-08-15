import { config } from 'dotenv.ts';
import {
  MongoClient,
} from "mongo.ts";


const { parsed: env } = config();

if (typeof env === 'undefined') throw new Error('No .env file found');

const client = new MongoClient();
export const db = await client.connect(env.MONGODB_URI);