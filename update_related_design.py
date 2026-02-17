#!/usr/bin/env python3
"""
Update related articles in blog detail pages to match the new industrial design
Adds images and category labels to related cards
"""

import os
from bs4 import BeautifulSoup

# Base path
base_path = '/Users/larsleenders/Downloads/Structon/web'

# Locales to process
locales = ['be-nl', 'nl-nl', 'be-fr', 'de-de']

def get_image_for_title(title):
    """Return an appropriate image URL based on title keywords"""
    title_lower = title.lower()
    if 'bak' in title_lower or 'godet' in title_lower or 'loeffel' in title_lower:
        return 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1770733959/structon/products/s2slbyokvqaerqvumj1t.png'
    if 'snelwissel' in title_lower or 'attache' in title_lower or 'schnellwechsler' in title_lower:
        return 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1770734001/structon/products/zbp8ecf8tavon8paegoq.png'
    return 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1770733959/structon/products/s2slbyokvqaerqvumj1t.png'

def get_category_for_title(title, locale):
    """Return an appropriate category label based on title keywords and locale"""
    title_lower = title.lower()
    
    cats = {
        'be-nl': {'advies': 'Advies', 'techniek': 'Technisch', 'onderhoud': 'Onderhoud'},
        'nl-nl': {'advies': 'Advies', 'techniek': 'Technisch', 'onderhoud': 'Onderhoud'},
        'be-fr': {'advies': 'Conseils', 'techniek': 'Technique', 'onderhoud': 'Entretien'},
        'de-de': {'advies': 'Beratung', 'techniek': 'Technik', 'onderhoud': 'Wartung'}
    }
    
    locale_cats = cats.get(locale, cats['be-nl'])
    
    if 'onderhoud' in title_lower or 'entretien' in title_lower or 'wartung' in title_lower:
        return locale_cats['onderhoud']
    if 'snelwissel' in title_lower or 'attache' in title_lower or 'schnellwechsler' in title_lower:
        return locale_cats['techniek']
    return locale_cats['advies']

def update_related_articles(filepath, locale):
    """Update related articles section in a blog detail page"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()
        
        soup = BeautifulSoup(html, 'html.parser')
        related_grid = soup.find('div', class_='related-grid')
        
        if not related_grid:
            return False
            
        related_cards = related_grid.find_all('a', class_='related-card')
        if not related_cards:
            return False
            
        for card in related_cards:
            title_el = card.find('h4')
            desc_el = card.find('p')
            
            if not title_el:
                continue
                
            title = title_el.get_text(strip=True)
            desc = desc_el.get_text(strip=True) if desc_el else ""
            
            # Clear current content
            card.clear()
            
            # Image
            img_div = soup.new_tag('div', attrs={'class': 'related-card-image'})
            img_tag = soup.new_tag('img', src=get_image_for_title(title), alt=title)
            img_div.append(img_tag)
            card.append(img_div)
            
            # Content
            content_div = soup.new_tag('div', attrs={'class': 'related-card-content'})
            
            # Category
            cat_span = soup.new_tag('span', attrs={'class': 'blog-card-category'})
            cat_span.string = get_category_for_title(title, locale)
            # Reusing blog-card-category class for consistency
            content_div.append(cat_span)
            
            # Re-add title and desc
            new_title = soup.new_tag('h4')
            new_title.string = title
            content_div.append(new_title)
            
            if desc:
                new_desc = soup.new_tag('p')
                new_desc.string = desc
                content_div.append(new_desc)
                
            card.append(content_div)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        
        return True
        
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    """Main function"""
    updated_count = 0
    for locale in locales:
        blog_dir = os.path.join(base_path, locale, 'blog')
        if not os.path.exists(blog_dir):
            continue
            
        for entry in os.listdir(blog_dir):
            entry_path = os.path.join(blog_dir, entry)
            if os.path.isdir(entry_path):
                index_file = os.path.join(entry_path, 'index.html')
                if os.path.exists(index_file):
                    if update_related_articles(index_file, locale):
                        updated_count += 1
                        print(f"✓ Updated related articles: {locale}/blog/{entry}/")
    
    print(f"\n✅ Updated related articles in {updated_count} blog posts")

if __name__ == '__main__':
    main()
