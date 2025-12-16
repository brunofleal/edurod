#!/bin/bash

# MongoDB Database Copy Script
# Copies production database to development environment

echo "================================"
echo "MongoDB Database Copy Tool"
echo "================================"
echo ""

# Configuration
PROD_URI=""  #"<insert mongo uri>"
DEV_URI="" #"<insert mongo uri>"
BACKUP_DIR="./mongodb-backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "⚠️  WARNING: This will replace your development database!"
echo ""
echo "Production: $PROD_URI"
echo "Development: $DEV_URI"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo "📦 Step 1: Dumping production database..."
mongodump --uri="$PROD_URI" --out="$BACKUP_DIR/$TIMESTAMP"

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to dump production database"
    exit 1
fi

echo "✅ Production database dumped successfully"
echo ""

echo "📥 Step 2: Dropping existing development database (if exists)..."
mongosh "$DEV_URI" --eval "db.dropDatabase()" --quiet

echo ""
echo "📤 Step 3: Restoring to development database..."
# Restore directly to the edurod database
mongorestore --uri="$DEV_URI" --drop --dir="$BACKUP_DIR/$TIMESTAMP/edurod"

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to restore to development database"
    exit 1
fi

echo ""
echo "✅ Database copied successfully!"
echo ""
echo "📊 Summary:"
echo "  - Backup location: $BACKUP_DIR/$TIMESTAMP"
echo "  - Production URI: $PROD_URI"
echo "  - Development URI: $DEV_URI"
echo ""
echo "🧹 Cleanup: To remove backup, run:"
echo "  rm -rf $BACKUP_DIR/$TIMESTAMP"
echo ""
