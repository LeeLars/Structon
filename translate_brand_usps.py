#!/usr/bin/env python3
"""
Translate Brand USP texts in be-fr and de-de brand pages
"""

import os
import re
from pathlib import Path

# Translation dictionaries for USP texts
translations_fr = {
    'Op maat gemaakt in België': 'Fabriqué sur mesure en Belgique',
    'Elke bak wordt specifiek voor jouw machine geproduceerd in onze werkplaats in Beernem. Perfecte pasvorm, geen compromissen.': 'Chaque godet est fabriqué spécifiquement pour votre machine dans notre atelier à Beernem. Ajustement parfait, aucun compromis.',
    
    'Afgestemd op jouw graafmachine': 'Adapté à votre pelle mécanique',
    'Ophanging, breedte en geometrie worden afgestemd op de exacte machineklasse voor betere prestaties.': 'L\'attache, la largeur et la géométrie sont adaptées à la classe de machine exacte pour de meilleures performances.',
    
    'Snelle, gecontroleerde productie': 'Production rapide et contrôlée',
    'Lokale productie betekent korte levertijden zonder in te boeten op kwaliteit.': 'La production locale signifie des délais de livraison courts sans compromettre la qualité.'
}

translations_de = {
    'Op maat gemaakt in België': 'Maßgefertigt in Belgien',
    'Elke bak wordt specifiek voor jouw machine geproduceerd in onze werkplaats in Beernem. Perfecte pasvorm, geen compromissen.': 'Jeder Löffel wird speziell für Ihre Maschine in unserer Werkstatt in Beernem gefertigt. Perfekte Passform, keine Kompromisse.',
    
    'Afgestemd op jouw graafmachine': 'Abgestimmt auf Ihren Bagger',
    'Ophanging, breedte en geometrie worden afgestemd op de exacte machineklasse voor betere prestaties.': 'Aufhängung, Breite und Geometrie werden auf die exakte Maschinenklasse abgestimmt für bessere Leistung.',
    
    'Snelle, gecontroleerde productie': 'Schnelle, kontrollierte Produktion',
    'Lokale productie betekent korte levertijden zonder in te boeten op kwaliteit.': 'Lokale Produktion bedeutet kurze Lieferzeiten ohne Qualitätseinbußen.'
}

def translate_brand_usps(filepath, translations):
    """Translate USP texts in brand HTML file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Sort by length (longest first) to avoid partial replacements
        sorted_translations = sorted(translations.items(), key=lambda x: len(x[0]), reverse=True)
        
        for dutch, translation in sorted_translations:
            # Replace in HTML content
            content = content.replace(dutch, translation)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    base_dir = Path('/Users/larsleenders/Downloads/Structon/web')
    
    # Process be-fr brand pages
    print("Processing be-fr brand pages...")
    be_fr_dir = base_dir / 'be-fr' / 'kraanbakken'
    fr_count = 0
    
    if be_fr_dir.exists():
        for brand_dir in be_fr_dir.iterdir():
            if brand_dir.is_dir():
                html_file = brand_dir / 'index.html'
                if html_file.exists():
                    if translate_brand_usps(html_file, translations_fr):
                        fr_count += 1
                        print(f"  ✓ {html_file.relative_to(base_dir)}")
    
    print(f"\nTranslated {fr_count} be-fr brand pages")
    
    # Process de-de brand pages
    print("\nProcessing de-de brand pages...")
    de_de_dir = base_dir / 'de-de' / 'kraanbakken'
    de_count = 0
    
    if de_de_dir.exists():
        for brand_dir in de_de_dir.iterdir():
            if brand_dir.is_dir():
                html_file = brand_dir / 'index.html'
                if html_file.exists():
                    if translate_brand_usps(html_file, translations_de):
                        de_count += 1
                        print(f"  ✓ {html_file.relative_to(base_dir)}")
    
    print(f"\nTranslated {de_count} de-de brand pages")
    print(f"\nTotal: {fr_count + de_count} brand pages updated")

if __name__ == '__main__':
    main()
