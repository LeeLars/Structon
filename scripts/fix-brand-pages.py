#!/usr/bin/env python3
"""
Script to fix all brand pages with correct brand-specific content.
Replaces hardcoded Caterpillar content with correct brand data.
"""

import os
import re
from pathlib import Path

WEB_DIR = Path('/Users/larsleenders/Downloads/Structon/web')

# Brand data - extracted from brand-data.js
BRANDS = {
    'caterpillar': {
        'name': 'Caterpillar',
        'shortName': 'CAT',
        'title': 'Kraanbak voor Caterpillar',
        'metaTitle': 'Kraanbak voor Caterpillar | Graafbakken CAT Graafmachine | Structon',
        'metaDescription': 'Kraanbak voor Caterpillar graafmachine? Structon levert graafbakken passend voor alle CAT modellen. ✓ CW-aansluiting ✓ Hardox staal ✓ Belgische productie',
        'metaKeywords': 'kraanbak caterpillar, graafbak CAT, slotenbak caterpillar, kraanbak CAT 320, kraanbak CAT 330',
        'heroDescription': 'Structon levert hoogwaardige kraanbakken passend voor alle Caterpillar graafmachines. Van de compacte CAT 301 minigraver tot de zware CAT 395 rupskraan.',
        'modelSelectorTitle': 'Zoek op CAT Model',
    },
    'volvo': {
        'name': 'Volvo',
        'shortName': 'Volvo',
        'title': 'Kraanbak voor Volvo',
        'metaTitle': 'Kraanbak voor Volvo | Graafbakken Volvo Graafmachine | Structon',
        'metaDescription': 'Kraanbak voor Volvo graafmachine? Structon levert graafbakken passend voor alle Volvo EC modellen. ✓ CW-aansluiting ✓ Hardox staal',
        'metaKeywords': 'kraanbak volvo, graafbak volvo, slotenbak volvo, kraanbak EC220, kraanbak EC300',
        'heroDescription': 'Structon levert hoogwaardige kraanbakken passend voor alle Volvo graafmachines. Van de compacte EC15 minigraver tot de zware EC950 rupskraan.',
        'modelSelectorTitle': 'Zoek op Volvo Model',
    },
    'komatsu': {
        'name': 'Komatsu',
        'shortName': 'Komatsu',
        'title': 'Kraanbak voor Komatsu',
        'metaTitle': 'Kraanbak voor Komatsu | Graafbakken Komatsu Graafmachine | Structon',
        'metaDescription': 'Kraanbak voor Komatsu graafmachine? Structon levert graafbakken passend voor alle Komatsu PC modellen. ✓ CW-aansluiting ✓ Hardox staal',
        'metaKeywords': 'kraanbak komatsu, graafbak komatsu, slotenbak komatsu, kraanbak PC210, kraanbak PC300',
        'heroDescription': 'Structon levert hoogwaardige kraanbakken passend voor alle Komatsu graafmachines. Van de compacte PC18 minigraver tot de zware PC800 rupskraan.',
        'modelSelectorTitle': 'Zoek op Komatsu Model',
    },
    'hitachi': {
        'name': 'Hitachi',
        'shortName': 'Hitachi',
        'title': 'Kraanbak voor Hitachi',
        'metaTitle': 'Kraanbak voor Hitachi | Graafbakken Hitachi Graafmachine | Structon',
        'metaDescription': 'Kraanbak voor Hitachi graafmachine? Structon levert graafbakken passend voor alle Hitachi Zaxis modellen. ✓ CW-aansluiting ✓ Hardox staal',
        'metaKeywords': 'kraanbak hitachi, graafbak hitachi, slotenbak hitachi, kraanbak ZX210, kraanbak ZX350',
        'heroDescription': 'Structon levert hoogwaardige kraanbakken passend voor alle Hitachi graafmachines. Van de compacte ZX17 minigraver tot de zware ZX490 rupskraan.',
        'modelSelectorTitle': 'Zoek op Hitachi Model',
    },
    'liebherr': {
        'name': 'Liebherr',
        'shortName': 'Liebherr',
        'title': 'Kraanbak voor Liebherr',
        'metaTitle': 'Kraanbak voor Liebherr | Graafbakken Liebherr Graafmachine | Structon',
        'metaDescription': 'Kraanbak voor Liebherr graafmachine? Structon levert graafbakken passend voor alle Liebherr modellen. ✓ CW-aansluiting ✓ Hardox staal',
        'metaKeywords': 'kraanbak liebherr, graafbak liebherr, slotenbak liebherr, kraanbak R920, kraanbak R950',
        'heroDescription': 'Structon levert hoogwaardige kraanbakken passend voor alle Liebherr graafmachines. Van de compacte A904 tot de zware R980 rupskraan.',
        'modelSelectorTitle': 'Zoek op Liebherr Model',
    },
    'jcb': {
        'name': 'JCB',
        'shortName': 'JCB',
        'title': 'Kraanbak voor JCB',
        'metaTitle': 'Kraanbak voor JCB | Graafbakken JCB Graafmachine | Structon',
        'metaDescription': 'Kraanbak voor JCB graafmachine? Structon levert graafbakken passend voor alle JCB modellen. ✓ CW-aansluiting ✓ Hardox staal',
        'metaKeywords': 'kraanbak jcb, graafbak jcb, slotenbak jcb, kraanbak JS220, kraanbak 8080',
        'heroDescription': 'Structon levert hoogwaardige kraanbakken passend voor alle JCB graafmachines. Van de compacte 8008 minigraver tot de zware JS370 rupskraan.',
        'modelSelectorTitle': 'Zoek op JCB Model',
    },
    'kubota': {
        'name': 'Kubota',
        'shortName': 'Kubota',
        'title': 'Kraanbak voor Kubota',
        'metaTitle': 'Kraanbak voor Kubota | Graafbakken Kubota Graafmachine | Structon',
        'metaDescription': 'Kraanbak voor Kubota graafmachine? Structon levert graafbakken passend voor alle Kubota KX modellen. ✓ CW-aansluiting ✓ Hardox staal',
        'metaKeywords': 'kraanbak kubota, graafbak kubota, slotenbak kubota, kraanbak KX080, kraanbak U55',
        'heroDescription': 'Structon levert hoogwaardige kraanbakken passend voor alle Kubota graafmachines. Van de compacte K008 tot de KX080 middenklasse.',
        'modelSelectorTitle': 'Zoek op Kubota Model',
    },
    'takeuchi': {
        'name': 'Takeuchi',
        'shortName': 'Takeuchi',
        'title': 'Kraanbak voor Takeuchi',
        'metaTitle': 'Kraanbak voor Takeuchi | Graafbakken Takeuchi Graafmachine | Structon',
        'metaDescription': 'Kraanbak voor Takeuchi graafmachine? Structon levert graafbakken passend voor alle Takeuchi TB modellen. ✓ CW-aansluiting ✓ Hardox staal',
        'metaKeywords': 'kraanbak takeuchi, graafbak takeuchi, slotenbak takeuchi, kraanbak TB260, kraanbak TB290',
        'heroDescription': 'Structon levert hoogwaardige kraanbakken passend voor alle Takeuchi graafmachines. Van de compacte TB210 tot de TB2150 middenklasse.',
        'modelSelectorTitle': 'Zoek op Takeuchi Model',
    },
    'yanmar': {
        'name': 'Yanmar',
        'shortName': 'Yanmar',
        'title': 'Kraanbak voor Yanmar',
        'metaTitle': 'Kraanbak voor Yanmar | Graafbakken Yanmar Graafmachine | Structon',
        'metaDescription': 'Kraanbak voor Yanmar graafmachine? Structon levert graafbakken passend voor alle Yanmar ViO en SV modellen. ✓ CW-aansluiting ✓ Hardox staal',
        'metaKeywords': 'kraanbak yanmar, graafbak yanmar, slotenbak yanmar, kraanbak ViO50, kraanbak SV100',
        'heroDescription': 'Structon levert hoogwaardige kraanbakken passend voor alle Yanmar graafmachines. Van de compacte SV08 tot de ViO80 middenklasse.',
        'modelSelectorTitle': 'Zoek op Yanmar Model',
    },
    'doosan': {
        'name': 'Doosan',
        'shortName': 'Doosan',
        'title': 'Kraanbak voor Doosan',
        'metaTitle': 'Kraanbak voor Doosan | Graafbakken Doosan Graafmachine | Structon',
        'metaDescription': 'Kraanbak voor Doosan graafmachine? Structon levert graafbakken passend voor alle Doosan DX modellen. ✓ CW-aansluiting ✓ Hardox staal',
        'metaKeywords': 'kraanbak doosan, graafbak doosan, slotenbak doosan, kraanbak DX225, kraanbak DX300',
        'heroDescription': 'Structon levert hoogwaardige kraanbakken passend voor alle Doosan graafmachines. Van de compacte DX17 minigraver tot de zware DX530 rupskraan.',
        'modelSelectorTitle': 'Zoek op Doosan Model',
    },
    'case': {
        'name': 'Case',
        'shortName': 'Case',
        'title': 'Kraanbak voor Case',
        'metaTitle': 'Kraanbak voor Case | Graafbakken Case Graafmachine | Structon',
        'metaDescription': 'Kraanbak voor Case graafmachine? Structon levert graafbakken passend voor alle Case CX modellen. ✓ CW-aansluiting ✓ Hardox staal',
        'metaKeywords': 'kraanbak case, graafbak case, slotenbak case, kraanbak CX210, kraanbak CX300',
        'heroDescription': 'Structon levert hoogwaardige kraanbakken passend voor alle Case graafmachines. Van de compacte CX17 minigraver tot de zware CX750 rupskraan.',
        'modelSelectorTitle': 'Zoek op Case Model',
    },
    'hyundai': {
        'name': 'Hyundai',
        'shortName': 'Hyundai',
        'title': 'Kraanbak voor Hyundai',
        'metaTitle': 'Kraanbak voor Hyundai | Graafbakken Hyundai Graafmachine | Structon',
        'metaDescription': 'Kraanbak voor Hyundai graafmachine? Structon levert graafbakken passend voor alle Hyundai HX modellen. ✓ CW-aansluiting ✓ Hardox staal',
        'metaKeywords': 'kraanbak hyundai, graafbak hyundai, slotenbak hyundai, kraanbak HX220, kraanbak HX300',
        'heroDescription': 'Structon levert hoogwaardige kraanbakken passend voor alle Hyundai graafmachines. Van de compacte HX17 minigraver tot de zware HX900 rupskraan.',
        'modelSelectorTitle': 'Zoek op Hyundai Model',
    },
    'kobelco': {
        'name': 'Kobelco',
        'shortName': 'Kobelco',
        'title': 'Kraanbak voor Kobelco',
        'metaTitle': 'Kraanbak voor Kobelco | Graafbakken Kobelco Graafmachine | Structon',
        'metaDescription': 'Kraanbak voor Kobelco graafmachine? Structon levert graafbakken passend voor alle Kobelco SK modellen. ✓ CW-aansluiting ✓ Hardox staal',
        'metaKeywords': 'kraanbak kobelco, graafbak kobelco, slotenbak kobelco, kraanbak SK210, kraanbak SK350',
        'heroDescription': 'Structon levert hoogwaardige kraanbakken passend voor alle Kobelco graafmachines. Van de compacte SK17 minigraver tot de zware SK850 rupskraan.',
        'modelSelectorTitle': 'Zoek op Kobelco Model',
    },
    'sany': {
        'name': 'Sany',
        'shortName': 'Sany',
        'title': 'Kraanbak voor Sany',
        'metaTitle': 'Kraanbak voor Sany | Graafbakken Sany Graafmachine | Structon',
        'metaDescription': 'Kraanbak voor Sany graafmachine? Structon levert graafbakken passend voor alle Sany SY modellen. ✓ CW-aansluiting ✓ Hardox staal',
        'metaKeywords': 'kraanbak sany, graafbak sany, slotenbak sany, kraanbak SY215, kraanbak SY365',
        'heroDescription': 'Structon levert hoogwaardige kraanbakken passend voor alle Sany graafmachines. Van de compacte SY16 minigraver tot de zware SY500 rupskraan.',
        'modelSelectorTitle': 'Zoek op Sany Model',
    },
    'wacker-neuson': {
        'name': 'Wacker Neuson',
        'shortName': 'Wacker Neuson',
        'title': 'Kraanbak voor Wacker Neuson',
        'metaTitle': 'Kraanbak voor Wacker Neuson | Graafbakken Wacker Neuson Graafmachine | Structon',
        'metaDescription': 'Kraanbak voor Wacker Neuson graafmachine? Structon levert graafbakken passend voor alle Wacker Neuson ET en EZ modellen. ✓ CW-aansluiting ✓ Hardox staal',
        'metaKeywords': 'kraanbak wacker neuson, graafbak wacker neuson, slotenbak wacker neuson, kraanbak ET65, kraanbak EZ80',
        'heroDescription': 'Structon levert hoogwaardige kraanbakken passend voor alle Wacker Neuson graafmachines. Van de compacte ET16 tot de ET90 middenklasse.',
        'modelSelectorTitle': 'Zoek op Wacker Neuson Model',
    },
}

def fix_brand_page(brand_slug):
    """Fix a single brand page with correct brand-specific content."""
    file_path = WEB_DIR / 'kraanbakken' / brand_slug / 'index.html'
    
    if not file_path.exists():
        print(f"  ❌ File not found: {file_path}")
        return False
    
    brand = BRANDS.get(brand_slug)
    if not brand:
        print(f"  ❌ Brand data not found: {brand_slug}")
        return False
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Replace meta title
        content = re.sub(
            r'<title>.*?</title>',
            f'<title>{brand["metaTitle"]}</title>',
            content
        )
        
        # Replace meta description
        content = re.sub(
            r'<meta name="description" content="[^"]*">',
            f'<meta name="description" content="{brand["metaDescription"]}">',
            content
        )
        
        # Replace meta keywords
        content = re.sub(
            r'<meta name="keywords" content="[^"]*">',
            f'<meta name="keywords" content="{brand["metaKeywords"]}">',
            content
        )
        
        # Replace canonical URL
        content = re.sub(
            r'<link rel="canonical" href="[^"]*">',
            f'<link rel="canonical" href="https://structon.be/kraanbakken/{brand_slug}/">',
            content
        )
        
        # Replace OG title
        content = re.sub(
            r'<meta property="og:title" content="[^"]*">',
            f'<meta property="og:title" content="{brand["title"]} | Structon">',
            content
        )
        
        # Replace OG description
        content = re.sub(
            r'<meta property="og:description" content="[^"]*">',
            f'<meta property="og:description" content="Professionele kraanbakken passend voor {brand["name"]} graafmachines.">',
            content
        )
        
        # Replace OG URL
        content = re.sub(
            r'<meta property="og:url" content="[^"]*">',
            f'<meta property="og:url" content="https://structon.be/kraanbakken/{brand_slug}/">',
            content
        )
        
        # Replace structured data breadcrumb
        content = re.sub(
            r'"name": "Caterpillar", "item": "https://structon\.be/kraanbakken/caterpillar/"',
            f'"name": "{brand["name"]}", "item": "https://structon.be/kraanbakken/{brand_slug}/"',
            content
        )
        
        # Replace breadcrumb text in HTML
        content = re.sub(
            r'<span aria-current="page"[^>]*>Caterpillar</span>',
            f'<span aria-current="page" style="color: var(--color-gray-900); font-weight: 600;">{brand["name"]}</span>',
            content
        )
        
        # Replace H1 title
        content = re.sub(
            r'<h1 class="brand-title-large">Kraanbak voor Caterpillar</h1>',
            f'<h1 class="brand-title-large">{brand["title"]}</h1>',
            content
        )
        
        # Replace hero description
        content = re.sub(
            r'Structon levert hoogwaardige kraanbakken passend voor alle Caterpillar graafmachines\.[^<]*',
            brand["heroDescription"],
            content
        )
        
        # Replace image alt text
        content = re.sub(
            r'alt="Caterpillar graafmachine aan het werk"',
            f'alt="{brand["name"]} graafmachine aan het werk"',
            content
        )
        
        # Replace model selector title
        content = re.sub(
            r'<h2 class="section-title">Zoek op CAT Model</h2>',
            f'<h2 class="section-title">{brand["modelSelectorTitle"]}</h2>',
            content
        )
        
        # Add header-loader.js if not present
        if 'header-loader.js' not in content:
            content = re.sub(
                r'(<script type="module" src="../../assets/js/main\.js)',
                r'<script src="../../assets/js/components/header-loader.js"></script>\n  \1',
                content
            )
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✅ Fixed: {brand_slug}")
            return True
        else:
            print(f"  ⏭️  No changes needed: {brand_slug}")
            return False
            
    except Exception as e:
        print(f"  ❌ Error fixing {brand_slug}: {e}")
        return False

def main():
    print("🔄 Fixing all brand pages with correct brand-specific content...\n")
    
    fixed_count = 0
    
    for brand_slug in BRANDS.keys():
        if brand_slug == 'caterpillar':
            print(f"  ⏭️  Skipping caterpillar (already correct)")
            continue
        
        if fix_brand_page(brand_slug):
            fixed_count += 1
    
    print(f"\n📊 Summary: Fixed {fixed_count} brand pages")

if __name__ == '__main__':
    main()
