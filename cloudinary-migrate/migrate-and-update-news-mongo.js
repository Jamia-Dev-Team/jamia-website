// migrate-and-update-news-mongo.js
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// CONFIG FROM .env
const OLD = {
  cloud_name: process.env.OLD_CLOUD_NAME,
  api_key: process.env.OLD_API_KEY,
  api_secret: process.env.OLD_API_SECRET,
};
const NEW = {
  cloud_name: process.env.NEW_CLOUD_NAME,
  api_key: process.env.NEW_API_KEY,
  api_secret: process.env.NEW_API_SECRET,
};

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME && process.env.DB_NAME.trim() !== '' ? process.env.DB_NAME.trim() : null;
const COLLECTION_NAME = process.env.COLLECTION_NAME || 'news';
const FIELD_PATH = process.env.FIELD_PATH || 'image';
const IMGID_FIELD = process.env.IMGID_FIELD || 'imgId';
const TEST_COUNT = Number(process.env.TEST_COUNT || 0);
const CONCURRENCY = Number(process.env.CONCURRENCY || 6);
const PREVIEW_ONLY = String(process.env.PREVIEW_ONLY || 'true').toLowerCase() === 'true';
const CSV_FILE = path.resolve(process.env.CSV_FILE || path.join(__dirname, 'cloudinary-migration-mapping-news.csv'));

if (!OLD.cloud_name || !NEW.cloud_name) {
  console.error('Missing OLD_* or NEW_* Cloudinary credentials in .env. Aborting.');
  process.exit(1);
}
if (!MONGODB_URI) {
  console.error('MONGODB_URI missing in .env. Aborting.');
  process.exit(1);
}

function configureCloudinary(cfg) {
  cloudinary.config({
    cloud_name: cfg.cloud_name,
    api_key: cfg.api_key,
    api_secret: cfg.api_secret,
    secure: true,
  });
}

const csvWriter = createCsvWriter({
  path: CSV_FILE,
  header: [
    { id: 'public_id', title: 'public_id' },
    { id: 'old_url', title: 'old_url' },
    { id: 'new_url', title: 'new_url' },
    { id: 'status', title: 'status' },
    { id: 'error', title: 'error' },
    { id: 'db_docs_updated', title: 'db_docs_updated' },
  ],
  append: false,
});

async function listOldResources(next_cursor = null, collected = []) {
  configureCloudinary(OLD);
  const opts = { max_results: 500, type: 'upload' };
  if (next_cursor) opts.next_cursor = next_cursor;
  const res = await cloudinary.api.resources(opts);
  if (!res.resources || !Array.isArray(res.resources)) return collected;
  collected.push(...res.resources);
  if (res.next_cursor) return listOldResources(res.next_cursor, collected);
  return collected;
}

// Migrate a single asset from old -> new, preserving public_id
async function migrateOne(resource) {
  const publicId = resource.public_id;
  const oldUrl = resource.secure_url;
  const folder = resource.folder || '';
  const resourceType = resource.resource_type || 'image';

  configureCloudinary(NEW);
  const uploadOptions = {
    public_id: publicId,
    folder,
    resource_type: resourceType === 'video' ? 'video' : 'image',
    use_filename: false,
    unique_filename: false,
    overwrite: false,
  };

  const RETRY_LIMIT = 2;
  let attempt = 0;
  while (attempt <= RETRY_LIMIT) {
    try {
      const uploadResult = await cloudinary.uploader.upload(oldUrl, uploadOptions);
      return {
        public_id: publicId,
        old_url: oldUrl,
        new_url: uploadResult.secure_url,
        status: 'ok',
        error: '',
      };
    } catch (err) {
      attempt++;
      console.error(`Upload failed for ${publicId} (attempt ${attempt}):`, err && err.message ? err.message : err);
      if (attempt > RETRY_LIMIT) {
        return {
          public_id: publicId,
          old_url: oldUrl,
          new_url: '',
          status: 'failed',
          error: (err && err.message) || String(err),
        };
      }
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
}

// concurrency helper
async function asyncPool(poolLimit, array, iteratorFn) {
  const ret = [];
  const executing = [];
  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p);
    const e = p.then(() => executing.splice(executing.indexOf(e), 1));
    executing.push(e);
    if (executing.length >= poolLimit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(ret);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Update documents in the news collection:
 * - If doc[IMGID_FIELD] exists and equals resource.public_id -> set image field to new_url and imgId to public_id (keeps consistent)
 * - Else if doc[FIELD_PATH] is a string and contains old cloud name or public_id -> replace with new_url
 * - Else if doc[FIELD_PATH] is an array -> map elements replacing matching ones
 */
async function updateNewsDocs(coll, resource, newUrl) {
  const publicId = resource.public_id;
  const regexPublicId = new RegExp(escapeRegex(publicId));
  const regexOldCloud = new RegExp(escapeRegex(`res.cloudinary.com/${OLD.cloud_name}`));

  // Query: either imgId matches OR field contains old cloud OR field contains publicId
  const filter = {
    $or: [
      { [IMGID_FIELD]: publicId },
      { [FIELD_PATH]: { $regex: regexPublicId } },
      { [FIELD_PATH]: { $regex: regexOldCloud } },
    ],
  };

  const cursor = coll.find(filter, { projection: { [FIELD_PATH]: 1, [IMGID_FIELD]: 1 } });
  let updatedCount = 0;

  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    let currentVal = doc[FIELD_PATH];
    let newVal = currentVal;
    let changed = false;

    // If imgId matches, prefer that mapping
    if (doc[IMGID_FIELD] && doc[IMGID_FIELD] === publicId) {
      newVal = newUrl;
      changed = true;
    } else if (typeof currentVal === 'string') {
      if (regexPublicId.test(currentVal) || regexOldCloud.test(currentVal)) {
        newVal = newUrl;
        changed = true;
      }
    } else if (Array.isArray(currentVal)) {
      const mapped = currentVal.map(el => {
        if (typeof el === 'string' && (regexPublicId.test(el) || regexOldCloud.test(el))) {
          changed = true;
          return newUrl;
        }
        return el;
      });
      newVal = mapped;
    } else {
      // Not a string/array — skip
      continue;
    }

    if (changed) {
      if (PREVIEW_ONLY) {
        console.log(`[PREVIEW] Would update _id=${doc._id.toString()} ${FIELD_PATH} =>`, newVal);
        // also preview imgId update if different
        if (!doc[IMGID_FIELD] || doc[IMGID_FIELD] !== publicId) {
          console.log(`[PREVIEW] Would set ${IMGID_FIELD}=${publicId} for _id=${doc._id.toString()}`);
        }
        updatedCount++;
      } else {
        // Build update doc: set image field and set imgId
        const updateDoc = { $set: { [FIELD_PATH]: newVal, [IMGID_FIELD]: publicId } };
        const res = await coll.updateOne({ _id: doc._id }, updateDoc);
        if (res.modifiedCount > 0) updatedCount++;
        else console.warn(`No modifications made for _id=${doc._id.toString()}`);
      }
    }
  }

  return updatedCount;
}

(async () => {
  try {
    console.log('Listing resources from old Cloudinary account...');
    const resources = await listOldResources();
    console.log(`Found ${resources.length} resources in old account.`);
    const toMigrate = TEST_COUNT > 0 ? resources.slice(0, TEST_COUNT) : resources;
    console.log(`Will migrate ${toMigrate.length} items. PREVIEW_ONLY=${PREVIEW_ONLY}`);

    // prepare CSV
    await csvWriter.writeRecords([]);

    // connect to Mongo
    const client = new MongoClient(MONGODB_URI, { useUnifiedTopology: true });
    await client.connect();
    const targetDbName = DB_NAME || (new URL(MONGODB_URI).pathname.replace('/', '') || undefined);
    if (!targetDbName) {
      console.error('Could not determine DB name - please set DB_NAME in .env');
      await client.close();
      process.exit(1);
    }
    const db = client.db(targetDbName);
    const coll = db.collection(COLLECTION_NAME);
    console.log(`Connected to DB='${targetDbName}' collection='${COLLECTION_NAME}'`);

    const results = [];

    await asyncPool(CONCURRENCY, toMigrate, async (resItem) => {
      const res = await migrateOne(resItem);
      let docsUpdated = 0;
      if (res.status === 'ok') {
        try {
          docsUpdated = await updateNewsDocs(coll, resItem, res.new_url);
        } catch (err) {
          console.error('Error updating news docs for', resItem.public_id, err && err.message ? err.message : err);
          docsUpdated = -1;
        }
      }
      const row = {
        public_id: res.public_id,
        old_url: res.old_url,
        new_url: res.new_url || '',
        status: res.status,
        error: res.error || '',
        db_docs_updated: docsUpdated,
      };
      // append csv line
      const csvLine = `${row.public_id},"${(row.old_url||'').replace(/"/g,'""')}","${(row.new_url||'').replace(/"/g,'""')}",${row.status},"${(row.error||'').replace(/"/g,'""')}",${row.db_docs_updated}\n`;
      fs.appendFileSync(CSV_FILE, csvLine);

      console.log(`${res.status.toUpperCase()} - ${res.public_id}  DB_DOCS_UPDATED: ${docsUpdated}`);
      results.push(row);
      return row;
    });

    await client.close();
    console.log('Closed MongoDB connection.');

    const ok = results.filter(r => r.status === 'ok').length;
    const failed = results.filter(r => r.status === 'failed').length;
    console.log(`Migration finished. Success: ${ok}, Failed: ${failed}`);
    console.log('CSV mapping:', CSV_FILE);
    if (PREVIEW_ONLY) console.log('PREVIEW_ONLY=true — no DB writes performed. Set PREVIEW_ONLY=false to apply updates.');

  } catch (err) {
    console.error('Fatal error:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
