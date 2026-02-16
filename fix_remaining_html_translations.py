#!/usr/bin/env python3
"""
Fix Remaining HTML Translations
Translates all remaining Dutch text in be-fr and de-de HTML files
"""

import os
import re
from pathlib import Path

# Translation dictionaries
translations_fr = {
    # Common phrases
    'Bekijk': 'Voir',
    'Bekijk alles': 'Voir tout',
    'Bekijk alle': 'Voir tous les',
    'Bekijk producten': 'Voir les produits',
    'Bekijk Produits': 'Voir les produits',
    'Bekijk Godets de terrassement': 'Voir les godets de terrassement',
    'Bekijk Godets tranchée': 'Voir les godets de tranchée',
    'Bekijk Marteaux de démolition': 'Voir les marteaux de démolition',
    'Meer info': 'Plus d\'infos',
    'Ontdek': 'Découvrir',
    'Neem Contact Op': 'Nous contacter',
    'Offerte Aanvragen': 'Demander un devis',
    
    # Specialist/advice
    'Specialist in kraanbakken': 'Spécialiste en godets',
    'kraanbakken': 'godets',
    'Kraanbakken': 'Godets',
    'KRAANBAKKEN': 'GODETS',
    'graafmachine': 'pelle',
    'graafmachine aanbouwdelen': 'accessoires pour pelles',
    'Onze specialisten helpen u graag': 'Nos spécialistes sont là pour vous aider',
    'specialisten': 'spécialistes',
    'Persoonlijk advies van onze specialisten': 'Conseils personnalisés de nos spécialistes',
    'Scherpe prijzen voor': 'Prix compétitifs pour',
    'professionals': 'professionnels',
    'loonwerkers': 'entrepreneurs',
    'hoveniers': 'jardiniers',
    
    # Questions/contact
    'Vragen?': 'Des questions ?',
    'Vragen over': 'Questions sur',
    'binnen 24u antwoord': 'réponse sous 24h',
    'Vraag een offerte aan voor': 'Demandez un devis pour',
    'ADVIES VOOR UW PROJECT?': 'BESOIN DE CONSEILS POUR VOTRE PROJET ?',
    
    # Descriptions
    'Elke sector heeft specifieke behoeften': 'Chaque secteur a des besoins spécifiques',
    'Ontdek welke kraanbakken het beste passen bij uw industrie': 'Découvrez quels godets conviennent le mieux à votre secteur',
    'Als grondwerker weet u dat': 'En tant que terrassier, vous savez que',
    'Infrastructuurprojecten vragen om betrouwbaar gereedschap': 'Les projets d\'infrastructure nécessitent des outils fiables',
    'Structon levert': 'Structon fournit',
    'Professionele kraanbakken voor': 'Godets professionnels pour',
    'grondwerkers': 'terrassiers',
    'grondverzet bedrijven': 'entreprises de terrassement',
    
    # Product types
    'Godets pour pelles voor': 'Godets pour pelles pour',
    'Professioneel Grondwerk': 'Terrassement professionnel',
    'voor Wegenbouw': 'pour Travaux routiers',
    'voor loonwerk': 'pour entrepreneurs',
    'voor grondwerk': 'pour terrassement',
    'voor tuinaanleg': 'pour aménagement paysager',
    'bakken voor tuinaanleg': 'godets pour aménagement paysager',
    
    # Technical
    'Hardox kwaliteit voor dagelijks intensief gebruik': 'Qualité Hardox pour usage intensif quotidien',
    'Alle onze bakken zijn leverbaar met': 'Tous nos godets sont disponibles avec',
    'Twijfelt u over de juiste aansluiting?': 'Vous hésitez sur le bon raccord ?',
    'Neem contact op met onze specialisten voor persoonlijk advies': 'Contactez nos spécialistes pour des conseils personnalisés',
}

translations_de = {
    # Common phrases
    'Bekijk': 'Ansehen',
    'Bekijk alles': 'Alles ansehen',
    'Bekijk alle': 'Alle ansehen',
    'Bekijk producten': 'Produkte ansehen',
    'Bekijk Produits': 'Produkte ansehen',
    'Bekijk Godets de terrassement': 'Tieflöffel ansehen',
    'Bekijk Godets tranchée': 'Grabenlöffel ansehen',
    'Bekijk Marteaux de démolition': 'Abbruchhämmer ansehen',
    'Meer info': 'Mehr Infos',
    'Ontdek': 'Entdecken',
    'Neem Contact Op': 'Kontakt aufnehmen',
    'Offerte Aanvragen': 'Angebot anfordern',
    
    # Specialist/advice
    'Specialist in kraanbakken': 'Spezialist für Baggerlöffel',
    'kraanbakken': 'Baggerlöffel',
    'Kraanbakken': 'Baggerlöffel',
    'KRAANBAKKEN': 'BAGGERLÖFFEL',
    'graafmachine': 'Bagger',
    'graafmachine aanbouwdelen': 'Bagger-Anbaugeräte',
    'Onze specialisten helpen u graag': 'Unsere Spezialisten helfen Ihnen gerne',
    'specialisten': 'Spezialisten',
    'Persoonlijk advies van onze specialisten': 'Persönliche Beratung von unseren Spezialisten',
    'Scherpe prijzen voor': 'Wettbewerbsfähige Preise für',
    'professionals': 'Profis',
    'loonwerkers': 'Unternehmer',
    'hoveniers': 'Gärtner',
    
    # Questions/contact
    'Vragen?': 'Fragen?',
    'Vragen over': 'Fragen zu',
    'binnen 24u antwoord': 'Antwort innerhalb von 24 Stunden',
    'Vraag een offerte aan voor': 'Fordern Sie ein Angebot an für',
    'ADVIES VOOR UW PROJECT?': 'BERATUNG FÜR IHR PROJEKT?',
    
    # Descriptions
    'Elke sector heeft specifieke behoeften': 'Jeder Sektor hat spezifische Anforderungen',
    'Ontdek welke kraanbakken het beste passen bij uw industrie': 'Entdecken Sie, welche Baggerlöffel am besten zu Ihrer Branche passen',
    'Als grondwerker weet u dat': 'Als Erdbauer wissen Sie, dass',
    'Infrastructuurprojecten vragen om betrouwbaar gereedschap': 'Infrastrukturprojekte erfordern zuverlässige Werkzeuge',
    'Structon levert': 'Structon liefert',
    'Professionele kraanbakken voor': 'Professionelle Baggerlöffel für',
    'grondwerkers': 'Erdbauer',
    'grondverzet bedrijven': 'Erdbauunternehmen',
    
    # Product types
    'Godets pour pelles voor': 'Baggerlöffel für',
    'Professioneel Grondwerk': 'Professioneller Erdbau',
    'voor Wegenbouw': 'für Straßenbau',
    'voor loonwerk': 'für Unternehmer',
    'voor grondwerk': 'für Erdbau',
    'voor tuinaanleg': 'für Landschaftsbau',
    'bakken voor tuinaanleg': 'Löffel für Landschaftsbau',
    
    # Technical
    'Hardox kwaliteit voor dagelijks intensief gebruik': 'Hardox-Qualität für den täglichen intensiven Einsatz',
    'Alle onze bakken zijn leverbaar met': 'Alle unsere Löffel sind erhältlich mit',
    'Twijfelt u over de juiste aansluiting?': 'Unsicher über die richtige Verbindung?',
    'Neem contact op met onze specialisten voor persoonlijk advies': 'Kontaktieren Sie unsere Spezialisten für persönliche Beratung',
}

def translate_html_file(filepath, translations):
    """Translate Dutch text in HTML file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Sort by length (longest first) to avoid partial replacements
        sorted_translations = sorted(translations.items(), key=lambda x: len(x[0]), reverse=True)
        
        for dutch, translation in sorted_translations:
            # Only replace if not already in target language
            # Use word boundaries to avoid partial matches
            pattern = r'\b' + re.escape(dutch) + r'\b'
            content = re.sub(pattern, translation, content, flags=re.IGNORECASE)
        
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
    
    # Process be-fr
    print("Processing be-fr files...")
    be_fr_dir = base_dir / 'be-fr'
    fr_count = 0
    for html_file in be_fr_dir.rglob('*.html'):
        if translate_html_file(html_file, translations_fr):
            fr_count += 1
            print(f"  ✓ {html_file.relative_to(base_dir)}")
    
    print(f"\nTranslated {fr_count} be-fr files")
    
    # Process de-de
    print("\nProcessing de-de files...")
    de_de_dir = base_dir / 'de-de'
    de_count = 0
    for html_file in de_de_dir.rglob('*.html'):
        if translate_html_file(html_file, translations_de):
            de_count += 1
            print(f"  ✓ {html_file.relative_to(base_dir)}")
    
    print(f"\nTranslated {de_count} de-de files")
    print(f"\nTotal: {fr_count + de_count} files updated")

if __name__ == '__main__':
    main()
