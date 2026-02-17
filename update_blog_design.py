#!/usr/bin/env python3
"""
Update blog overview pages with the new industrial blog card design
Uses BeautifulSoup for robust HTML parsing
"""

import os
from bs4 import BeautifulSoup

# Base path
base_path = '/Users/larsleenders/Downloads/Structon/web'

# Locales to process
locales = ['be-nl', 'nl-nl', 'be-fr', 'de-de']

def get_new_blog_card(soup, old_card, locale):
    """Transform old card BeautifulSoup element into new design"""
    href = old_card.get('href')
    category_el = old_card.find('span', class_='blog-card-category')
    title_el = old_card.find('h3', class_='blog-card-title')
    excerpt_el = old_card.find('p', class_='blog-card-excerpt')
    meta_el = old_card.find('span', class_='blog-card-meta')
    
    if not (category_el and title_el and excerpt_el and meta_el):
        return None
        
    category = category_el.get_text(strip=True)
    title = title_el.get_text(strip=True)
    excerpt = excerpt_el.get_text(strip=True)
    date = meta_el.get_text(strip=True)
    
    # Translation for 'Read more'
    read_more_labels = {
        'be-nl': 'Lees meer',
        'nl-nl': 'Lees meer',
        'be-fr': 'Lire la suite',
        'de-de': 'Weiterlesen'
    }
    read_more_text = read_more_labels.get(locale, 'Lees meer')
    
    # Category-based images
    image_map = {
        'Advies': 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1770733959/structon/products/s2slbyokvqaerqvumj1t.png',
        'Conseils': 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1770733959/structon/products/s2slbyokvqaerqvumj1t.png',
        'Beratung': 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1770733959/structon/products/s2slbyokvqaerqvumj1t.png',
        'Technisch': 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1770734001/structon/products/zbp8ecf8tavon8paegoq.png',
        'Technique': 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1770734001/structon/products/zbp8ecf8tavon8paegoq.png',
        'Technik': 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1770734001/structon/products/zbp8ecf8tavon8paegoq.png',
        'Onderhoud': 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1770733959/structon/products/s2slbyokvqaerqvumj1t.png',
        'Entretien': 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1770733959/structon/products/s2slbyokvqaerqvumj1t.png',
        'Wartung': 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1770733959/structon/products/s2slbyokvqaerqvumj1t.png',
    }
    img_url = image_map.get(category, 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1770733959/structon/products/s2slbyokvqaerqvumj1t.png')
    
    # Create new structure
    new_card = soup.new_tag('a', href=href, attrs={'class': 'blog-card'})
    
    # Image part
    img_div = soup.new_tag('div', attrs={'class': 'blog-card-image'})
    img_tag = soup.new_tag('img', src=img_url, alt=title)
    img_div.append(img_tag)
    new_card.append(img_div)
    
    # Content part
    content_div = soup.new_tag('div', attrs={'class': 'blog-card-content'})
    
    cat_span = soup.new_tag('span', attrs={'class': 'blog-card-category'})
    cat_span.string = category
    content_div.append(cat_span)
    
    title_h3 = soup.new_tag('h3', attrs={'class': 'blog-card-title'})
    title_h3.string = title
    content_div.append(title_h3)
    
    excerpt_p = soup.new_tag('p', attrs={'class': 'blog-card-excerpt'})
    excerpt_p.string = excerpt
    content_div.append(excerpt_p)
    
    footer_div = soup.new_tag('div', attrs={'class': 'blog-card-footer'})
    
    meta_div = soup.new_tag('div', attrs={'class': 'blog-card-meta'})
    date_span = soup.new_tag('span')
    date_span.string = date
    meta_div.append(date_span)
    footer_div.append(meta_div)
    
    rm_div = soup.new_tag('div', attrs={'class': 'blog-card-read-more'})
    rm_div.append(read_more_text)
    
    # SVG for Arrow
    svg_html = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>'
    svg_soup = BeautifulSoup(svg_html, 'html.parser')
    rm_div.append(svg_soup.svg)
    
    footer_div.append(rm_div)
    content_div.append(footer_div)
    
    new_card.append(content_div)
    return new_card

def update_blog_overview(filepath, locale):
    """Update a single blog overview page"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()
        
        soup = BeautifulSoup(html, 'html.parser')
        blog_grid = soup.find('div', class_='blog-grid')
        
        if not blog_grid:
            print(f"  ⚠ No blog-grid found in {filepath}")
            return False
            
        old_cards = blog_grid.find_all('a', class_='blog-card')
        if not old_cards:
            print(f"  ⚠ No blog-cards found in {filepath}")
            return False
            
        for old_card in old_cards:
            new_card = get_new_blog_card(soup, old_card, locale)
            if new_card:
                old_card.replace_with(new_card)
        
        # Write back - prettify might mess up some things, so we'll just use str(soup)
        # and try to preserve some of the manual formatting if possible, 
        # but for this scale transformation soup is better.
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
        filepath = os.path.join(base_path, locale, 'blog', 'index.html')
        if os.path.exists(filepath):
            if update_blog_overview(filepath, locale):
                updated_count += 1
                print(f"✓ Updated: {locale}/blog/index.html")
    
    print(f"\n✅ Updated {updated_count} blog overview pages with new design")

if __name__ == '__main__':
    main()
