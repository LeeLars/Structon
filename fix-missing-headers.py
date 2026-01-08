#!/usr/bin/env python3
"""
Script to add header-loader.js to all HTML files that have header-placeholder but missing the script
"""

import os
import re
from pathlib import Path

def find_html_files(root_dir):
    """Find all HTML files in the web directory"""
    html_files = []
    for root, dirs, files in os.walk(root_dir):
        # Skip certain directories
        if 'node_modules' in root or '.git' in root or 'cms' in root:
            continue
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    return html_files

def has_header_placeholder(content):
    """Check if file has header-placeholder div"""
    return 'id="header-placeholder"' in content

def has_header_loader_script(content):
    """Check if file has header-loader.js script"""
    return 'header-loader.js' in content

def get_correct_script_path(file_path, web_root):
    """Determine the correct relative path to header-loader.js"""
    rel_path = os.path.relpath(file_path, web_root)
    depth = rel_path.count(os.sep)
    
    if depth == 0:  # Root level (index.html)
        return 'assets/js/components/header-loader.js'
    elif depth == 1:  # One level deep (/contact/, /blog/, etc.)
        return '../assets/js/components/header-loader.js'
    elif depth == 2:  # Two levels deep (/kraanbakken/caterpillar/, etc.)
        return '../../assets/js/components/header-loader.js'
    else:
        return '../' * depth + 'assets/js/components/header-loader.js'

def add_header_loader_script(file_path, web_root):
    """Add header-loader.js script before </body> tag"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if already has the script
        if has_header_loader_script(content):
            return False, "Already has script"
        
        # Check if has placeholder
        if not has_header_placeholder(content):
            return False, "No placeholder found"
        
        # Get correct script path
        script_path = get_correct_script_path(file_path, web_root)
        script_tag = f'  <script src="{script_path}"></script>\n'
        
        # Find the position to insert (before </body>)
        body_close_pattern = r'(</body>)'
        
        # Check if there are already scripts before </body>
        scripts_before_body = re.search(r'(<script[^>]*>.*?</script>\s*)+\s*</body>', content, re.DOTALL)
        
        if scripts_before_body:
            # Insert as first script before </body>
            first_script = re.search(r'(\s*<script[^>]*>)', content[:scripts_before_body.start()])
            if first_script:
                # Find the last script group before </body>
                last_scripts = re.findall(r'\s*<script[^>]*>.*?</script>', content, re.DOTALL)
                if last_scripts:
                    # Insert before the first script tag before </body>
                    insert_pos = content.rfind('<script', 0, content.rfind('</body>'))
                    if insert_pos > 0:
                        content = content[:insert_pos] + script_tag + content[insert_pos:]
                    else:
                        content = re.sub(body_close_pattern, script_tag + r'\1', content)
                else:
                    content = re.sub(body_close_pattern, script_tag + r'\1', content)
            else:
                content = re.sub(body_close_pattern, script_tag + r'\1', content)
        else:
            # No scripts, just add before </body>
            content = re.sub(body_close_pattern, script_tag + r'\1', content)
        
        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return True, "Script added"
    
    except Exception as e:
        return False, f"Error: {str(e)}"

def main():
    web_root = '/Users/larsleenders/Downloads/Structon/web'
    
    print("🔍 Scanning for HTML files...")
    html_files = find_html_files(web_root)
    print(f"Found {len(html_files)} HTML files\n")
    
    files_to_fix = []
    files_already_ok = []
    files_no_placeholder = []
    
    # First pass: identify files
    for file_path in html_files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        has_placeholder = has_header_placeholder(content)
        has_script = has_header_loader_script(content)
        
        rel_path = os.path.relpath(file_path, web_root)
        
        if has_placeholder and not has_script:
            files_to_fix.append((file_path, rel_path))
        elif has_placeholder and has_script:
            files_already_ok.append(rel_path)
        else:
            files_no_placeholder.append(rel_path)
    
    print(f"📊 Analysis:")
    print(f"  ✅ Files with placeholder AND script: {len(files_already_ok)}")
    print(f"  ❌ Files with placeholder but NO script: {len(files_to_fix)}")
    print(f"  ⚪ Files without placeholder: {len(files_no_placeholder)}\n")
    
    if files_to_fix:
        print(f"🔧 Fixing {len(files_to_fix)} files...\n")
        
        fixed_count = 0
        for file_path, rel_path in files_to_fix:
            success, message = add_header_loader_script(file_path, web_root)
            if success:
                print(f"  ✅ {rel_path}")
                fixed_count += 1
            else:
                print(f"  ❌ {rel_path} - {message}")
        
        print(f"\n✨ Fixed {fixed_count} files!")
    else:
        print("✨ All files are already correct!")
    
    print(f"\n📋 Files without placeholder (OK - standalone pages):")
    for rel_path in files_no_placeholder[:5]:  # Show first 5
        print(f"  - {rel_path}")
    if len(files_no_placeholder) > 5:
        print(f"  ... and {len(files_no_placeholder) - 5} more")

if __name__ == '__main__':
    main()
