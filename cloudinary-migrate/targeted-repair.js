// targeted-repair.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const { parse } = require('csv-parse/sync');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || null;
const CSV_IN = path.resolve(__dirname, process.env.CSV_IN || 'cloudinary-migration-mapping-news.csv');
const CSV_OUT = path.resolve(__dirname, process.env.CSV_OUT || 'targeted-repair-results.csv');
const PREVIEW_ONLY = String(process.env.PREVIEW_ONLY || 'true').toLowerCase() === 'true';

// Candidate fields to check for exact matches
const CANDIDATE_FIELDS = ['image', 'images', 'imgId', 'photo', 'photos', 'gallery'];

if (!MONGODB_URI) {
  console.error('MONGODB_URI missing in .env');
  process.exit(1);
}
if (!fs.existsSync(CSV_IN)) {
  console.error('CSV mapping not found at', CSV_IN);
  process.exit(1);
}

function loadCsv(file) {
  const raw = fs.readFileSync(file, 'utf8');
  return parse(raw, { columns: true, skip_empty_lines: true });
}

(async () => {
  const records = loadCsv(CSV_IN);
  // Only rows where status ok (uploaded). You can adjust to process all rows if needed.
  const rows = records.filter(r => String(r.status).toLowerCase() === 'ok');

  if (rows.length === 0) {
    console.log('No rows to process in CSV.');
    process.exit(0);
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const targetDb = DB_NAME || (new URL(MONGODB_URI).pathname.replace('/', '') || null);
  if (!targetDb) {
    console.error('DB name not found; set DB_NAME in .env or include DB in URI');
    await client.close();
    process.exit(1);
  }
  const db = client.db(targetDb);
  console.log('Connected to DB:', targetDb);

  // Prepare output CSV header
  fs.writeFileSync(CSV_OUT, 'public_id,old_url,new_url,collection,doc_id,field_before,field_after,updated\n', 'utf8');

  const collections = await db.listCollections().toArray();

  for (const r of rows) {
    const public_id = r.public_id;
    const old_url = (r.old_url || '').trim();
    const new_url = (r.new_url || '').trim();
    if (!new_url) continue;

    console.log(`\nProcessing ${public_id} (old_url length=${old_url.length})`);

    // For each collection, find exact matches:
    for (const c of collections) {
      const coll = db.collection(c.name);

      // Build exact-match queries:
      const queries = [];

      // 1) if old_url exists and is non-empty, match equality on string fields and array elements
      if (old_url) {
        for (const f of CANDIDATE_FIELDS) {
          // match fields that are exactly the old_url or array elements equal to old_url
          queries.push({ [f]: old_url });
          queries.push({ [f]: { $elemMatch: { $eq: old_url } } });
        }
      }

      // 2) exact imgId match
      queries.push({ imgId: public_id });

      // Combine with $or
      const q = { $or: queries };

      let found;
      try {
        found = await coll.find(q).toArray();
      } catch (err) {
        // skip collections that do not allow a specific query shape
        continue;
      }
      if (!found || found.length === 0) continue;

      // For each found doc, update only the specific field values that matched (targeted)
      for (const doc of found) {
        const updates = {};
        const beforeSnapshot = {};

        // exact string fields
        for (const f of CANDIDATE_FIELDS) {
          if (f in doc && typeof doc[f] === 'string' && doc[f] === old_url) {
            beforeSnapshot[f] = doc[f];
            updates[f] = new_url;
          } else if (f in doc && Array.isArray(doc[f])) {
            // replace array elements that exactly equal old_url
            const arr = doc[f];
            const newArr = arr.map(el => (typeof el === 'string' && el === old_url ? new_url : el));
            if (JSON.stringify(arr) !== JSON.stringify(newArr)) {
              beforeSnapshot[f] = JSON.stringify(arr).replace(/"/g, '""');
              updates[f] = newArr;
            }
          }
        }

        // imgId: if matches or missing, set to public_id
        if (!doc.imgId || doc.imgId !== public_id) {
          beforeSnapshot['imgId'] = doc.imgId || '';
          updates['imgId'] = public_id;
        }

        // if nothing to update (rare), skip
        if (Object.keys(updates).length === 0) {
          // record no-op
          fs.appendFileSync(CSV_OUT, `${public_id},"${old_url}","${new_url}",${c.name},${doc._id},"","",no_update\n`);
          continue;
        }

        if (PREVIEW_ONLY) {
          console.log(`[PREVIEW] would update ${c.name} _id=${doc._id} fields=${Object.keys(updates).join(',')}`);
          fs.appendFileSync(CSV_OUT, `${public_id},"${old_url}","${new_url}",${c.name},${doc._id},"${JSON.stringify(beforeSnapshot).replace(/"/g,'""')}","${JSON.stringify(updates).replace(/"/g,'""')}",preview\n`);
        } else {
          try {
            const result = await coll.updateOne({ _id: doc._id }, { $set: updates });
            const updated = result.modifiedCount > 0 ? 'yes' : 'no';
            fs.appendFileSync(CSV_OUT, `${public_id},"${old_url}","${new_url}",${c.name},${doc._id},"${JSON.stringify(beforeSnapshot).replace(/"/g,'""')}","${JSON.stringify(updates).replace(/"/g,'""')}",${updated}\n`);
            console.log(`Updated ${c.name} _id=${doc._id} => ${updated}`);
          } catch (err) {
            console.error('Update failed for', doc._id, err.message || err);
            fs.appendFileSync(CSV_OUT, `${public_id},"${old_url}","${new_url}",${c.name},${doc._id},,,"error:${(err.message||'')}"\n`);
          }
        }
      } // per doc
    } // per collection
  } // per mapping

  await client.close();
  console.log('\nDone. Audit CSV:', CSV_OUT);
  if (PREVIEW_ONLY) console.log('PREVIEW_ONLY=true — no writes made. Set PREVIEW_ONLY=false to apply changes.');
  process.exit(0);
})();
