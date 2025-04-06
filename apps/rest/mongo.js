import { MongoClient } from "mongodb";

const connectionString = "mongodb+srv://STRING_TO_YOUR_DB.mongodb.net/";
const client = new MongoClient(connectionString);
let conn;

try {
  conn = await client.connect();
} catch (e) {
  console.error(e);
}

let db = conn.db("DB_NAME");

export default db;
