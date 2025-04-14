#!/bin/bash

echo "🚨 WARNING: This will rewrite your entire Git history and force-push to origin."
read -p "Type 'YES' to continue: " confirm

if [[ "$confirm" != "YES" ]]; then
  echo "❌ Aborted."
  exit 1
fi

# Step 1: Install git-filter-repo if missing
if ! command -v git-filter-repo &> /dev/null; then
  echo "📦 Installing git-filter-repo..."
  brew install git-filter-repo || pipx install git-filter-repo
fi

# Step 2: Backup the current repo just in case
echo "📦 Creating backup folder..."
cp -r . ../cityinsight-ai-backup

# Step 3: Remove all .env and credential files from history
echo "🧼 Removing sensitive files from Git history..."
git filter-repo --path .env --path .env.local --path backend/.env --path frontend/.env.local --invert-paths

# Step 4: Add proper .gitignore if it doesn't exist
echo "🛡️ Updating .gitignore..."
cat <<EOL >> .gitignore

# Environment
.env
.env.local
*.key

# Python
__pycache__/
*.pyc

# Node
node_modules/
.next/
EOL

# Step 5: Remove cached files that were tracked
git rm -rf --cached .env .env.local backend/.env frontend/.env.local 2> /dev/null

# Step 6: Commit and force-push
git add .
git commit -m "🔒 Cleanup: Removed committed API keys and added secure .gitignore"
git push --force

echo "✅ Done! History is cleaned, and keys removed from remote."
echo "🧯 A backup copy of your original repo is saved at ../cityinsight-ai-backup"
