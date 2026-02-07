#!/bin/bash
cd /Users/larsleenders/Downloads/Structon
rm -rf .git/rebase-merge
rm -f .git/AUTO_MERGE .git/MERGE_MSG .git/REBASE_HEAD
git checkout main
git fetch origin main
git reset origin/main
git add -A
git commit -m "Product page improvements: specs table redesign, lightbox, purchase widget optimization"
git push origin main
echo "Done! Press any key to close..."
read -n 1
