// list-databases.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI missing in .env");
  process.exit(1);
}

async function listDatabases() {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    console.log("✅ Connected. Fetching database list...");
    const adminDb = client.db().admin();
    const result = await adminDb.listDatabases();

    console.log("\n📌 Databases in this cluster:");
    result.databases.forEach(db => {
      console.log(" -", db.name);
    });

    console.log("\n👉 Choose the DB that contains your `news` collection.");
    console.log("👉 Then set DB_NAME=that_name in your .env");

    await client.close();
  } catch (err) {
    console.error("❌ Error listing databases:", err);
  }
}

listDatabases();
