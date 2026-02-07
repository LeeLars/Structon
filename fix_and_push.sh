#!/bin/bash
cd /Users/larsleenders/Downloads/Structon

echo "=== Fixing Git State ==="

# Remove stuck rebase
if [ -d ".git/rebase-merge" ]; then
    echo "Removing stuck rebase..."
    rm -rf .git/rebase-merge
fi

# Remove merge artifacts
rm -f .git/AUTO_MERGE .git/MERGE_MSG .git/REBASE_HEAD

# Reset HEAD to main branch
echo "Resetting to main branch..."
git checkout main 2>/dev/null || git checkout -b main

# Fetch latest from remote
echo "Fetching from remote..."
git fetch origin main

# Reset to remote state (keeps local changes as unstaged)
echo "Syncing with remote..."
git reset origin/main

# Stage all changes
echo "Staging all changes..."
git add -A

# Commit
echo "Committing..."
git commit -m "Product page improvements: specs table redesign, lightbox, purchase widget optimization"

# Push
echo "Pushing to git..."
git push origin main

echo ""
echo "=== Done! ==="
