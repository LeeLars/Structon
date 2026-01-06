#!/usr/bin/env python3
"""
Script to update all HTML files with the new header-loader system.
Replaces old headers with a placeholder div and adds the header-loader.js script.
"""

import os
import re
from pathlib import Path

WEB_DIR = Path('/Users/larsleenders/Downloads/Structon/web')

# Files to skip (index.html already has correct header)
SKIP_FILES = ['index.html', 'offline.html']

def get_css_path(file_path):
    """Determine the correct relative path for CSS based on file location."""
    rel_path = file_path.relative_to(WEB_DIR)
    depth = len(rel_path.parts) - 1
    if depth == 0:
        return 'assets/css/components/mega-menu.css'
    elif depth == 1:
        return '../assets/css/components/mega-menu.css'
    else:
        return '../../assets/css/components/mega-menu.css'

def get_js_path(file_path):
    """Determine the correct relative path for JS based on file location."""
    rel_path = file_path.relative_to(WEB_DIR)
    depth = len(rel_path.parts) - 1
    if depth == 0:
        return 'assets/js/components/header-loader.js'
    elif depth == 1:
        return '../assets/js/components/header-loader.js'
    else:
        return '../../assets/js/components/header-loader.js'

def update_html_file(file_path):
    """Update a single HTML file with the new header system."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Skip if already has header-placeholder
        if 'id="header-placeholder"' in content:
            print(f"  ⏭️  Already updated: {file_path.relative_to(WEB_DIR)}")
            return False
        
        # Skip if no header-wrapper (no header to replace)
        if 'class="header-wrapper"' not in content:
            print(f"  ⏭️  No header found: {file_path.relative_to(WEB_DIR)}")
            return False
        
        css_path = get_css_path(file_path)
        js_path = get_js_path(file_path)
        
        # 1. Add mega-menu.css if not present
        if 'mega-menu.css' not in content:
            # Find where to insert (after global.css)
            content = re.sub(
                r'(<link rel="stylesheet" href="[^"]*global\.css[^"]*">)',
                r'\1\n  <link rel="stylesheet" href="' + css_path + '">',
                content
            )
        
        # 2. Replace old header with placeholder
        # Pattern to match the entire header section (from header-wrapper to end of mobile nav)
        header_pattern = r'<!-- Header Wrapper \(Sticky\) -->.*?</nav>\s*(?=\s*<main|\s*<section|\s*<div class="page|\s*<!--)'
        
        # Try different patterns
        patterns = [
            r'<div class="header-wrapper"[^>]*>.*?</div><!-- End Header Wrapper -->.*?</nav>\s*',
            r'<!-- Header Wrapper.*?-->.*?</div><!-- End Header Wrapper -->.*?<nav class="nav-mobile"[^>]*>.*?</nav>',
            r'<div class="header-wrapper".*?</div><!-- End Header Wrapper -->\s*<!-- Mobile Navigation -->\s*<nav class="nav-mobile".*?</nav>',
        ]
        
        replaced = False
        for pattern in patterns:
            if re.search(pattern, content, re.DOTALL):
                content = re.sub(
                    pattern,
                    '<!-- Header loaded dynamically -->\n  <div id="header-placeholder"></div>\n',
                    content,
                    flags=re.DOTALL
                )
                replaced = True
                break
        
        if not replaced:
            # Fallback: just find header-wrapper div and replace up to nav-mobile end
            start_marker = '<div class="header-wrapper"'
            end_markers = ['</nav>\n\n  <main', '</nav>\n  <main', '</nav>\n\n  <section', '</nav>\n  <div class="page']
            
            start_idx = content.find(start_marker)
            if start_idx != -1:
                end_idx = -1
                for marker in end_markers:
                    idx = content.find(marker, start_idx)
                    if idx != -1:
                        # Find the actual end of nav-mobile
                        nav_end = content.rfind('</nav>', start_idx, idx + len(marker))
                        if nav_end != -1:
                            end_idx = nav_end + len('</nav>')
                            break
                
                if end_idx != -1:
                    content = content[:start_idx] + '<!-- Header loaded dynamically -->\n  <div id="header-placeholder"></div>\n\n' + content[end_idx:].lstrip()
                    replaced = True
        
        if not replaced:
            print(f"  ⚠️  Could not replace header: {file_path.relative_to(WEB_DIR)}")
            return False
        
        # 3. Add header-loader.js script if not present
        if 'header-loader.js' not in content:
            # Add before other scripts or before </body>
            if '<script' in content:
                content = re.sub(
                    r'(<!-- Scripts -->.*?)\n(\s*<script)',
                    r'\1\n  <script src="' + js_path + '"></script>\n\\2',
                    content,
                    count=1,
                    flags=re.DOTALL
                )
            else:
                content = content.replace('</body>', f'  <script src="{js_path}"></script>\n</body>')
        
        # Write back if changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✅ Updated: {file_path.relative_to(WEB_DIR)}")
            return True
        else:
            print(f"  ⏭️  No changes: {file_path.relative_to(WEB_DIR)}")
            return False
            
    except Exception as e:
        print(f"  ❌ Error: {file_path.relative_to(WEB_DIR)} - {e}")
        return False

def main():
    print("🔄 Updating all HTML files with new header system...\n")
    
    updated_count = 0
    skipped_count = 0
    error_count = 0
    
    # Find all HTML files
    html_files = list(WEB_DIR.rglob('*.html'))
    
    for file_path in sorted(html_files):
        rel_path = file_path.relative_to(WEB_DIR)
        
        # Skip certain files
        if rel_path.name in SKIP_FILES and len(rel_path.parts) == 1:
            print(f"  ⏭️  Skipping root file: {rel_path}")
            skipped_count += 1
            continue
        
        result = update_html_file(file_path)
        if result:
            updated_count += 1
        elif result is False:
            skipped_count += 1
    
    print(f"\n📊 Summary:")
    print(f"   ✅ Updated: {updated_count}")
    print(f"   ⏭️  Skipped: {skipped_count}")
    print(f"   ❌ Errors: {error_count}")

if __name__ == '__main__':
    main()
