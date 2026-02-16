#!/usr/bin/env python3
"""
Script to translate Dutch content in brand pages to French and German
"""
import os
import re
from pathlib import Path

# Translation dictionaries
TRANSLATIONS = {
    'be-fr': {
        # Hero section
        'Baggerlöffel voor': 'Godets pour',
        'Structon levert hoogwaardige kraanbakken passend voor alle': 'Structon livre des godets de haute qualité adaptés à toutes les pelles mécaniques',
        'graafmachines': 'pelles mécaniques',
        
        # CTA Banner
        'Vraag een offerte aan voor uw': 'Demandez un devis pour votre',
        'binnen 24u antwoord': 'réponse sous 24h',
        'Persoonlijk advies van onze specialisten. Scherpe prijzen voor professionals.': 'Conseils personnalisés de nos spécialistes. Prix compétitifs pour les professionnels.',
        'Offerte Aanvragen': 'Demander un devis',
        
        # Products section
        'UITGELICHT VOOR': 'EN VEDETTE POUR',
        'Bekijk alle producten': 'Voir tous les produits',
        'Producten laden...': 'Chargement des produits...',
        
        # Benefits section
        'Waarom Structon voor': 'Pourquoi Structon pour',
        'Perfecte Pasvorm': 'Ajustement parfait',
        'Ontworpen voor optimale prestaties met': 'Conçu pour des performances optimales avec les machines',
        'machines. Elke bak past perfect op uw snelwissel.': '. Chaque godet s\'adapte parfaitement à votre attache rapide.',
        'Hardox Kwaliteit': 'Qualité Hardox',
        'Slijtplaten van Hardox 450 voor maximale levensduur, zelfs bij intensief gebruik.': 'Plaques d\'usure Hardox 450 pour une durée de vie maximale, même en utilisation intensive.',
        'Snelle Levering': 'Livraison rapide',
        'Grote voorraad, direct leverbaar uit België. Spoedleveringen mogelijk.': 'Grand stock, livraison directe depuis la Belgique. Livraisons express possibles.',
        '2 Jaar Garantie': 'Garantie 2 ans',
        'Volledige garantie op constructiefouten. Betrouwbare kwaliteit waar u op kunt vertrouwen.': 'Garantie complète sur les défauts de construction. Qualité fiable sur laquelle vous pouvez compter.',
        
        # SEO Content
        'Kraanbakken voor': 'Godets pour pelles mécaniques',
        'Graafmachines': '',
        'Structon levert hoogwaardige kraanbakken speciaal ontworpen voor': 'Structon livre des godets de haute qualité spécialement conçus pour les pelles mécaniques',
        'Wij hebben de juiste bak voor elke machine en toepassing, van minigravers tot zware rupskranen.': 'Nous avons le bon godet pour chaque machine et application, des mini-pelles aux pelles sur chenilles lourdes.',
        'CW-Snelwisselsysteem voor': 'Système d\'attache rapide CW pour',
        
        # Table headers
        'Model': 'Modèle',
        'Gewicht': 'Poids',
        'CW-Systeem': 'Système CW',
        
        # Other sections
        'Hardox Slijtplaten': 'Plaques d\'usure Hardox',
        'Alle Structon kraanbakken worden vervaardigd met Hardox 450 slijtplaten.': 'Tous les godets Structon sont fabriqués avec des plaques d\'usure Hardox 450.',
        'Dit Zweedse slijtvaststaal biedt een uitstekende balans tussen hardheid en taaiheid, waardoor uw kraanbak langer meegaat en minder onderhoud nodig heeft.': 'Cet acier résistant à l\'usure suédois offre un excellent équilibre entre dureté et ténacité, ce qui prolonge la durée de vie de votre godet et réduit les besoins d\'entretien.',
        
        'Andere Merken': 'Autres marques',
        'KRAANBAK VOOR JOUW': 'GODET POUR VOTRE',
        'KRAAN NODIG?': 'PELLE NÉCESSAIRE?',
        'Vraag vandaag nog een vrijblijvende offerte aan. Binnen 24 uur ontvangt u ons antwoord van onze specialisten.': 'Demandez dès aujourd\'hui un devis sans engagement. Vous recevrez notre réponse de nos spécialistes dans les 24 heures.',
        'Demander un devis': 'Demander un devis',
    },
    'de-de': {
        # Hero section
        'Baggerlöffel voor': 'Baggerlöffel für',
        'Structon levert hoogwaardige kraanbakken passend voor alle': 'Structon liefert hochwertige Baggerlöffel passend für alle',
        'graafmachines': 'Bagger',
        
        # CTA Banner
        'Vraag een offerte aan voor uw': 'Fordern Sie ein Angebot für Ihren',
        'binnen 24u antwoord': 'Antwort innerhalb von 24 Stunden',
        'Persoonlijk advies van onze specialisten. Scherpe prijzen voor professionals.': 'Persönliche Beratung von unseren Spezialisten. Scharfe Preise für Profis.',
        'Offerte Aanvragen': 'Angebot anfordern',
        
        # Products section
        'UITGELICHT VOOR': 'HERVORGEHOBEN FÜR',
        'Bekijk alle producten': 'Alle Produkte ansehen',
        'Producten laden...': 'Produkte werden geladen...',
        
        # Benefits section
        'Waarom Structon voor': 'Warum Structon für',
        'Perfecte Pasvorm': 'Perfekte Passform',
        'Ontworpen voor optimale prestaties met': 'Entwickelt für optimale Leistung mit',
        'machines. Elke bak past perfect op uw snelwissel.': 'Maschinen. Jeder Löffel passt perfekt auf Ihren Schnellwechsler.',
        'Hardox Kwaliteit': 'Hardox Qualität',
        'Slijtplaten van Hardox 450 voor maximale levensduur, zelfs bij intensief gebruik.': 'Verschleißplatten aus Hardox 450 für maximale Lebensdauer, auch bei intensivem Einsatz.',
        'Snelle Levering': 'Schnelle Lieferung',
        'Grote voorraad, direct leverbaar uit België. Spoedleveringen mogelijk.': 'Großer Lagerbestand, direkt lieferbar aus Belgien. Eillieferungen möglich.',
        '2 Jaar Garantie': '2 Jahre Garantie',
        'Volledige garantie op constructiefouten. Betrouwbare kwaliteit waar u op kunt vertrouwen.': 'Vollständige Garantie auf Konstruktionsfehler. Zuverlässige Qualität, auf die Sie sich verlassen können.',
        
        # SEO Content
        'Kraanbakken voor': 'Baggerlöffel für',
        'Graafmachines': 'Bagger',
        'Structon levert hoogwaardige kraanbakken speciaal ontworpen voor': 'Structon liefert hochwertige Baggerlöffel speziell entwickelt für',
        'Wij hebben de juiste bak voor elke machine en toepassing, van minigravers tot zware rupskranen.': 'Wir haben den richtigen Löffel für jede Maschine und Anwendung, von Minibaggern bis zu schweren Kettenbaggern.',
        'CW-Snelwisselsysteem voor': 'CW-Schnellwechselsystem für',
        
        # Table headers
        'Model': 'Modell',
        'Gewicht': 'Gewicht',
        'CW-Systeem': 'CW-System',
        
        # Other sections
        'Hardox Slijtplaten': 'Hardox Verschleißplatten',
        'Alle Structon kraanbakken worden vervaardigd met Hardox 450 slijtplaten.': 'Alle Structon Baggerlöffel werden mit Hardox 450 Verschleißplatten gefertigt.',
        'Dit Zweedse slijtvaststaal biedt een uitstekende balans tussen hardheid en taaiheid, waardoor uw kraanbak langer meegaat en minder onderhoud nodig heeft.': 'Dieser schwedische verschleißfeste Stahl bietet eine ausgezeichnete Balance zwischen Härte und Zähigkeit, wodurch Ihr Baggerlöffel länger hält und weniger Wartung benötigt.',
        
        'Andere Merken': 'Andere Marken',
        'KRAANBAK VOOR JOUW': 'BAGGERLÖFFEL FÜR IHREN',
        'KRAAN NODIG?': 'BAGGER BENÖTIGT?',
        'Vraag vandaag nog een vrijblijvende offerte aan. Binnen 24 uur ontvangt u ons antwoord van onze specialisten.': 'Fordern Sie noch heute ein unverbindliches Angebot an. Innerhalb von 24 Stunden erhalten Sie unsere Antwort von unseren Spezialisten.',
        'Demander un devis': 'Angebot anfordern',
    }
}

def translate_file(file_path, locale):
    """Translate a single file"""
    print(f"Translating {file_path} to {locale}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    translations = TRANSLATIONS.get(locale, {})
    
    # Apply translations
    for dutch, translation in translations.items():
        content = content.replace(dutch, translation)
    
    # Only write if content changed
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ Updated {file_path}")
        return True
    else:
        print(f"  - No changes needed for {file_path}")
        return False

def main():
    """Main function"""
    base_path = Path('/Users/larsleenders/Downloads/Structon/web')
    
    # Brand names to process
    brands = [
        'caterpillar', 'komatsu', 'volvo', 'hitachi', 'liebherr',
        'jcb', 'hyundai', 'kubota', 'kobelco', 'case', 'develon',
        'sany', 'takeuchi', 'wacker-neuson', 'yanmar'
    ]
    
    total_updated = 0
    
    for locale in ['be-fr', 'de-de']:
        print(f"\n{'='*60}")
        print(f"Processing {locale} locale")
        print(f"{'='*60}\n")
        
        for brand in brands:
            brand_file = base_path / locale / 'kraanbakken' / brand / 'index.html'
            if brand_file.exists():
                if translate_file(brand_file, locale):
                    total_updated += 1
            else:
                print(f"  ! File not found: {brand_file}")
    
    print(f"\n{'='*60}")
    print(f"Translation complete! Updated {total_updated} files.")
    print(f"{'='*60}\n")

if __name__ == '__main__':
    main()
