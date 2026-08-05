/**
 * One-time migration: fix User documents whose `avatar` or `coverPhoto`
 * field got saved as a raw string (e.g. "" or a bare URL) instead of the
 * schema's { public_id, url } shape. This is what was causing
 * "User validation failed: avatar: Tried to set nested object field
 * `avatar` to primitive value ``" on later, unrelated .save() calls
 * (like login's lastLogin update).
 *
 * Run once, from your backend's project root (where .env / MONGO_URI live):
 *
 *   node fix-corrupted-avatars.js
 *
 * Safe to re-run — it only touches documents where avatar/coverPhoto is
 * currently a string, and does nothing on a second run once they're fixed.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error(
    "Missing MONGO_URI (or MONGODB_URI) in your environment. Add it to .env or export it before running this script."
  );
  process.exit(1);
}

const run = async () => {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB.");

  const db = mongoose.connection.db;
  const users = db.collection("users");

  for (const field of ["avatar", "coverPhoto"]) {
    // Find any documents where the field is currently a plain string
    // (the corrupted state) rather than an object/missing.
    const filter = { [field]: { $type: "string" } };
    const count = await users.countDocuments(filter);

    if (count === 0) {
      console.log(`No corrupted "${field}" documents found. Skipping.`);
      continue;
    }

    console.log(`Found ${count} document(s) with a string "${field}". Fixing...`);

    const result = await users.updateMany(filter, {
      $set: { [field]: { public_id: "", url: "" } },
    });

    console.log(
      `Fixed "${field}" on ${result.modifiedCount} document(s).`
    );
  }

  await mongoose.disconnect();
  console.log("Done. Disconnected from MongoDB.");
};

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
