#!/usr/bin/env python3
import subprocess
import os
import sys

os.chdir('/Users/larsleenders/Downloads/Structon')

try:
    # Check if in rebase
    if os.path.exists('.git/rebase-merge'):
        print("Aborting rebase...")
        subprocess.run(['git', 'rebase', '--abort'], check=True)
    
    # Pull latest changes
    print("Pulling latest changes...")
    result = subprocess.run(['git', 'pull', 'origin', 'main'], capture_output=True, text=True)
    print(result.stdout)
    if result.returncode != 0:
        print(result.stderr)
    
    # Add all changes
    print("\nAdding changes...")
    subprocess.run(['git', 'add', '-A'], check=True)
    
    # Commit
    print("\nCommitting...")
    commit_msg = "Product page improvements: redesigned specs table, lightbox for single images, optimized purchase widget"
    subprocess.run(['git', 'commit', '-m', commit_msg], check=True)
    
    # Push
    print("\nPushing to git...")
    subprocess.run(['git', 'push'], check=True)
    
    print("\n✅ Successfully pushed to git!")
    
except subprocess.CalledProcessError as e:
    print(f"\n❌ Error: {e}")
    sys.exit(1)
