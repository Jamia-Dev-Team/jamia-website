// repair-mongo-updates.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

// FIXED CSV IMPORT (compatible with csv-parse v5+)
const { parse } = require('csv-parse/sync');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || null;
const CSV_IN = process.env.CSV_IN || path.join(__dirname, 'cloudinary-migration-mapping-news.csv');
const CSV_OUT = process.env.CSV_OUT || path.join(__dirname, 'cloudinary-repair-results.csv');
const PREVIEW_ONLY = String(process.env.PREVIEW_ONLY || 'true').toLowerCase() === 'true';

// fields to scan and update
const CANDIDATE_FIELDS = ['image','images','imgId','photo','photos','gallery'];

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI missing in .env');
  process.exit(1);
}
if (!fs.existsSync(CSV_IN)) {
  console.error('❌ Input CSV not found:', CSV_IN);
  process.exit(1);
}

function loadCsv(file) {
  const raw = fs.readFileSync(file, 'utf8');
  return parse(raw, { columns: true, skip_empty_lines: true });
}

function escRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

(async () => {
  const records = loadCsv(CSV_IN);

  // only rows where status=ok AND db_docs_updated=0
  const toFix = records.filter(r =>
    String(r.status).toLowerCase() === 'ok' &&
    Number(r.db_docs_updated || 0) === 0
  );

  if (toFix.length === 0) {
    console.log('Nothing to repair. All records already updated.');
    process.exit(0);
  }

  console.log(`🔍 Repairing ${toFix.length} assets...`);

  const client = new MongoClient(MONGODB_URI);
  await client.connect();

  const targetDb =
    DB_NAME ||
    (new URL(MONGODB_URI).pathname.replace('/', '') || null);

  if (!targetDb) {
    console.error('❌ Unable to determine DB name. Set DB_NAME in .env');
    await client.close();
    process.exit(1);
  }

  const db = client.db(targetDb);
  console.log(`Connected to database '${targetDb}'`);

  fs.writeFileSync(
    CSV_OUT,
    "public_id,collection,docs_found,docs_updated,notes\n",
    "utf8"
  );

  const collections = await db.listCollections().toArray();

  for (const row of toFix) {
    const public_id = row.public_id;
    const old_url = row.old_url;
    const new_url = row.new_url;

    console.log(`\n➡ Checking: ${public_id}`);

    const pubRegex = new RegExp(escRegex(public_id));

    let totalFound = 0;
    let totalUpdated = 0;

    for (const c of collections) {
      const collName = c.name;
      const coll = db.collection(collName);

      // find docs where any candidate fields contain public_id
      const ors = [];

      ors.push({ imgId: public_id });
      ors.push({ imgId: { $regex: pubRegex } });

      for (const f of CANDIDATE_FIELDS) {
        ors.push({ [f]: { $regex: pubRegex } });
      }

      let docs = [];
      try {
        docs = await coll.find({ $or: ors }).toArray();
      } catch (err) {
        // ignore invalid collections
        continue;
      }

      if (docs.length === 0) continue;

      totalFound += docs.length;
      let collUpdated = 0;

      for (const doc of docs) {
        const updateObj = {};
        let changed = false;

        const full = await coll.findOne({ _id: doc._id });

        for (const field of CANDIDATE_FIELDS) {
          if (!(field in full)) continue;

          let val = full[field];

          if (typeof val === "string") {
            if (pubRegex.test(val)) {
              updateObj[field] = new_url;
              changed = true;
            }
          }
          else if (Array.isArray(val)) {
            let modified = false;
            const updatedArr = val.map(v => {
              if (typeof v === "string" && pubRegex.test(v)) {
                modified = true;
                return new_url;
              }
              return v;
            });
            if (modified) {
              updateObj[field] = updatedArr;
              changed = true;
            }
          }
        }

        // ensure imgId is updated
        if (full.imgId !== public_id) {
          updateObj['imgId'] = public_id;
          changed = true;
        }

        if (changed) {
          if (PREVIEW_ONLY) {
            console.log(`  [PREVIEW] ${collName} _id=${doc._id} would update`);
            collUpdated++;
          } else {
            const res = await coll.updateOne({ _id: doc._id }, { $set: updateObj });
            if (res.modifiedCount > 0) collUpdated++;
          }
        }
      }

      totalUpdated += collUpdated;

      fs.appendFileSync(
        CSV_OUT,
        `${public_id},${collName},${docs.length},${collUpdated},\n`
      );
    }

    console.log(`✔ ${public_id} — found: ${totalFound}, updated: ${totalUpdated}`);
  }

  await client.close();
  console.log(`\n✅ Repair complete. CSV saved at:\n${CSV_OUT}`);

  if (PREVIEW_ONLY)
    console.log("PREVIEW_ONLY=true → No changes written. Set PREVIEW_ONLY=false to apply fixes.");
})();
