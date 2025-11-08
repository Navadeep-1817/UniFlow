/**
 * Migration Script: Fix AuditLog Index
 * 
 * This script removes the problematic logId_1 index from the AuditLog collection.
 * The index is causing duplicate key errors because logId field doesn't exist in the model.
 * 
 * Run this once on your production database.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const fixAuditLogIndex = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('auditlogs');

    // List all indexes
    console.log('\n📋 Current indexes on auditlogs collection:');
    const indexes = await collection.indexes();
    console.log(JSON.stringify(indexes, null, 2));

    // Check if logId_1 index exists
    const hasLogIdIndex = indexes.some(index => index.name === 'logId_1');

    if (hasLogIdIndex) {
      console.log('\n🗑️  Dropping logId_1 index...');
      await collection.dropIndex('logId_1');
      console.log('✅ Successfully dropped logId_1 index');
    } else {
      console.log('\n✅ No logId_1 index found - no action needed');
    }

    // List indexes after removal
    console.log('\n📋 Indexes after cleanup:');
    const indexesAfter = await collection.indexes();
    console.log(JSON.stringify(indexesAfter, null, 2));

    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
};

// Run migration
fixAuditLogIndex();
