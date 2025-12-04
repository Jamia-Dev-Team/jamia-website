// find-news-collections.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI missing in .env');
  process.exit(1);
}

(async () => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected. Fetching database list...');
    const admin = client.db().admin();
    const dblist = await admin.listDatabases();
    for (const dbInfo of dblist.databases) {
      const dbName = dbInfo.name;
      try {
        const db = client.db(dbName);
        const cols = await db.listCollections().toArray();
        const colNames = cols.map(c => c.name);
        // Check if 'news' exists explicitly
        if (colNames.includes('news')) {
          console.log(`\nFOUND: database='${dbName}' has collection 'news'`);
          const coll = db.collection('news');
          const sample = await coll.findOne({}, { projection: { image: 1, imgId: 1 } });
          console.log('Sample doc (image, imgId):', sample);
        }

        // Also check other collections for likelihood (collections with 'news' or 'post' in name)
        const likely = colNames.filter(n => /news|post|article|media|image/i.test(n));
        if (likely.length > 0) {
          console.log(`\nDatabase='${dbName}' - collections that look relevant:`, likely.join(', '));
          for (const cn of likely) {
            try {
              const sample = await db.collection(cn).findOne({}, { projection: { image: 1, imgId: 1 } });
              console.log(` sample from ${cn}:`, sample);
            } catch (err) {
              console.log(`  cannot read sample from ${cn}:`, err.message);
            }
          }
        }
      } catch (err) {
        console.log(`  Skipping DB='${dbName}' (error listing collections):`, err.message);
      }
    }
    console.log('\nDone scanning databases you can access.');
    await client.close();
  } catch (err) {
    console.error('Error:', err.message || err);
    try { await client.close(); } catch(e){}
    process.exit(1);
  }
})();
