const { MongoClient } = require('mongodb');

async function removeUniqueIndex() {
  const uri = "mongodb://localhost:27017"; // ya tu jo bhi use kar raha ho
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("ULTIMATE_PROJECT");

    // Check existing indexes (optional)
    const indexes = await db.collection("offer_rides").indexes();
    console.log("Current Indexes:", indexes);

    // Drop the unique index on email
    await db.collection("offer_rides").dropIndex("email_1");

    console.log("✅ Index 'email_1' dropped successfully.");
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await client.close();
  }
}

removeUniqueIndex();
