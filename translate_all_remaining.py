#!/usr/bin/env python3
"""
Comprehensive translation script for all remaining Dutch content
"""
import os
import re
from pathlib import Path

# Comprehensive translation dictionaries
TRANSLATIONS = {
    'be-fr': {
        # Common UI elements
        'Zoek merk...': 'Rechercher une marque...',
        'Actieve filters': 'Filtres actifs',
        'Geen actieve filters': 'Aucun filtre actif',
        'Marque': 'Marque',
        'Breedte': 'Largeur',
        'Gewicht': 'Poids',
        'Machine klasse': 'Classe de machine',
        'Ophanging': 'Fixation',
        'excl. BTW': 'hors TVA',
        'Meer info': 'Plus d\'infos',
        'Op bestelling': 'Sur commande',
        'Prijs op aanvraag': 'Prix sur demande',
        
        # Product descriptions
        'voor kranen van': 'pour pelles de',
        'voor pelles de': 'pour pelles de',
        
        # Aria labels
        'Kruimelpad': 'Fil d\'Ariane',
        
        # Sections
        'ONTDEK ONZE CATEGORIEEN': 'DÉCOUVREZ NOS CATÉGORIES',
        'Vind het juiste aanbouwdeel voor jouw machine en toepassing.': 'Trouvez le bon équipement pour votre machine et votre application.',
        
        # Footer
        'Specialist in kraanbakken en': 'Spécialiste en godets et',
        'graafmachine aanbouwdelen.': 'équipements pour pelles mécaniques.',
        'Algemeen': 'Général',
        'Home': 'Accueil',
        'Over Ons': 'À propos',
        'Klant Login': 'Connexion client',
        'Producten': 'Produits',
        'Snelwissels': 'Attaches rapides',
        'Adapterplaten': 'Plaques adaptatrices',
        'Rotators': 'Rotateurs',
        'Tiltrotators': 'Tiltrotateurs',
        'Kantelstukken': 'Pièces basculantes',
        'Graafbakken': 'Godets',
        'Overige': 'Autres',
        'Sloop- en sorteergrijpers': 'Pinces de tri et démolition',
        'Alle rechten voorbehouden.': 'Tous droits réservés.',
        'Sitemap': 'Plan du site',
        'Privacy': 'Confidentialité',
        'Voorwaarden': 'Conditions',
        'Gemaakt door Grafix Studio': 'Créé par Grafix Studio',
        
        # Product categories
        'Dieplepelbakken': 'Godets profonds',
        'Slotenbakken': 'Godets de tranchée',
        'Banaanbakken': 'Godets banane',
        'Sleuvenbakken': 'Godets étroits',
        'Kantelbakken': 'Godets orientables',
        'Sorteergrijpers': 'Pinces de tri',
        'Sloophamers': 'Marteaux de démolition',
        'Vergruizers': 'Pulvérisateurs',
        
        # Specific brand descriptions
        'Amerikaanse marktleider': 'Leader américain du marché',
        'Bekend om robuustheid en betrouwbaarheid': 'Réputé pour sa robustesse et sa fiabilité',
        'Japanse kwaliteit': 'Qualité japonaise',
        'Zweedse precisie': 'Précision suédoise',
        'Duitse engineering': 'Ingénierie allemande',
        'Koreaanse innovatie': 'Innovation coréenne',
        
        # CTA sections
        'KRAANBAK VOOR JOUW': 'GODET POUR VOTRE',
        'KRAAN NODIG?': 'PELLE NÉCESSAIRE?',
        'Vraag vandaag nog een vrijblijvende offerte aan.': 'Demandez dès aujourd\'hui un devis sans engagement.',
        'Binnen 24 uur ontvangt u ons antwoord van onze specialisten.': 'Vous recevrez notre réponse de nos spécialistes dans les 24 heures.',
        
        # Contact info
        'Twijfel je over de juiste ophanging of maat?': 'Vous avez des doutes sur la bonne fixation ou taille?',
        'Neem contact op met onze specialist.': 'Contactez notre spécialiste.',
    },
    'de-de': {
        # Common UI elements
        'Zoek merk...': 'Marke suchen...',
        'Actieve filters': 'Aktive Filter',
        'Geen actieve filters': 'Keine aktiven Filter',
        'Marque': 'Marke',
        'Breedte': 'Breite',
        'Gewicht': 'Gewicht',
        'Machine klasse': 'Maschinenklasse',
        'Ophanging': 'Aufhängung',
        'excl. BTW': 'exkl. MwSt.',
        'Meer info': 'Mehr Infos',
        'Op bestelling': 'Auf Bestellung',
        'Prijs op aanvraag': 'Preis auf Anfrage',
        
        # Product descriptions
        'voor kranen van': 'für Bagger von',
        'voor pelles de': 'für Bagger von',
        
        # Aria labels
        'Kruimelpad': 'Breadcrumb',
        
        # Sections
        'ONTDEK ONZE CATEGORIEEN': 'ENTDECKEN SIE UNSERE KATEGORIEN',
        'Vind het juiste aanbouwdeel voor jouw machine en toepassing.': 'Finden Sie das richtige Anbaugerät für Ihre Maschine und Anwendung.',
        
        # Footer
        'Specialist in kraanbakken en': 'Spezialist für Baggerlöffel und',
        'graafmachine aanbouwdelen.': 'Baggeranbaugeräte.',
        'Algemeen': 'Allgemein',
        'Home': 'Startseite',
        'Over Ons': 'Über uns',
        'Klant Login': 'Kundenlogin',
        'Producten': 'Produkte',
        'Snelwissels': 'Schnellwechsler',
        'Adapterplaten': 'Adapterplatten',
        'Rotators': 'Rotatoren',
        'Tiltrotators': 'Tiltrotatoren',
        'Kantelstukken': 'Schwenkteile',
        'Graafbakken': 'Baggerlöffel',
        'Overige': 'Sonstige',
        'Sloop- en sorteergrijpers': 'Sortier- und Abbruchgreifer',
        'Alle rechten voorbehouden.': 'Alle Rechte vorbehalten.',
        'Sitemap': 'Sitemap',
        'Privacy': 'Datenschutz',
        'Voorwaarden': 'Bedingungen',
        'Gemaakt door Grafix Studio': 'Erstellt von Grafix Studio',
        
        # Product categories
        'Dieplepelbakken': 'Tieflöffel',
        'Slotenbakken': 'Grabenlöffel',
        'Banaanbakken': 'Bananenlöffel',
        'Sleuvenbakken': 'Schlitzlöffel',
        'Kantelbakken': 'Schwenklöffel',
        'Sorteergrijpers': 'Sortiergreifer',
        'Sloophamers': 'Abbruchhämmer',
        'Vergruizers': 'Pulverisierer',
        
        # Specific brand descriptions
        'Amerikaanse marktleider': 'Amerikanischer Marktführer',
        'Bekend om robuustheid en betrouwbaarheid': 'Bekannt für Robustheit und Zuverlässigkeit',
        'Japanse kwaliteit': 'Japanische Qualität',
        'Zweedse precisie': 'Schwedische Präzision',
        'Duitse engineering': 'Deutsche Ingenieurskunst',
        'Koreaanse innovatie': 'Koreanische Innovation',
        
        # CTA sections
        'KRAANBAK VOOR JOUW': 'BAGGERLÖFFEL FÜR IHREN',
        'KRAAN NODIG?': 'BAGGER BENÖTIGT?',
        'Vraag vandaag nog een vrijblijvende offerte aan.': 'Fordern Sie noch heute ein unverbindliches Angebot an.',
        'Binnen 24 uur ontvangt u ons antwoord van onze specialisten.': 'Innerhalb von 24 Stunden erhalten Sie unsere Antwort von unseren Spezialisten.',
        
        # Contact info
        'Twijfel je over de juiste ophanging of maat?': 'Sind Sie sich über die richtige Aufhängung oder Größe unsicher?',
        'Neem contact op met onze specialist.': 'Kontaktieren Sie unseren Spezialisten.',
    }
}

def translate_content(content, locale):
    """Apply translations to content"""
    translations = TRANSLATIONS.get(locale, {})
    
    for dutch, translation in translations.items():
        content = content.replace(dutch, translation)
    
    return content

def process_file(file_path, locale):
    """Process a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        content = translate_content(content, locale)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"  ERROR processing {file_path}: {e}")
        return False

def main():
    """Main function"""
    base_path = Path('/Users/larsleenders/Downloads/Structon/web')
    
    total_updated = 0
    
    for locale in ['be-fr', 'de-de']:
        print(f"\n{'='*60}")
        print(f"Processing {locale} locale")
        print(f"{'='*60}\n")
        
        locale_path = base_path / locale
        
        # Find all HTML files
        html_files = list(locale_path.rglob('*.html'))
        
        print(f"Found {len(html_files)} HTML files to process\n")
        
        for html_file in html_files:
            rel_path = html_file.relative_to(base_path)
            if process_file(html_file, locale):
                print(f"  ✓ Updated {rel_path}")
                total_updated += 1
    
    print(f"\n{'='*60}")
    print(f"Translation complete! Updated {total_updated} files.")
    print(f"{'='*60}\n")

if __name__ == '__main__':
    main()
