#!/bin/bash
set -e

QUARTZ_DIR="/Users/ap/Desktop/quartz/quartz"
OBSIDIAN_VAULT="/Users/ap/Documents/Obsidian Vault"
BRANCH="v4"

cd "$QUARTZ_DIR"

# 1. Remove symlink/copy and replace with fresh copy of vault
rm -rf content
cp -R "$OBSIDIAN_VAULT/" content/

# 2. Stage all changes
git add content/ quartz.config.ts

# 3. Check if there are changes to commit
if git diff --cached --quiet; then
  echo "No changes to deploy."
  # Restore symlink
  rm -rf content
  ln -s "$OBSIDIAN_VAULT" content
  exit 0
fi

# 4. Commit and push
git commit -m "sync: update content from Obsidian vault $(date +%Y-%m-%d\ %H:%M)"
git -c http.version=HTTP/1.1 push origin "$BRANCH"

# 5. Restore symlink for local editing
rm -rf content
ln -s "$OBSIDIAN_VAULT" content

echo "Deployed successfully!"
