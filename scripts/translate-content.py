#!/usr/bin/env python3
"""
Translate content in locale folders.
Replaces Dutch text with French/German translations in HTML files.
"""

import os
import re

# Translation dictionaries
TRANSLATIONS = {
    'be-fr': {
        # Navigation & Common
        'Home': 'Accueil',
        'Producten': 'Produits',
        'Alle Producten': 'Tous les Produits',
        'Contact': 'Contact',
        'Over ons': 'À propos',
        'Over Ons': 'À Propos',
        'FAQ': 'FAQ',
        'Blog': 'Blog',
        'Inloggen': 'Connexion',
        'Dealer worden': 'Devenir revendeur',
        'Configurator': 'Configurateur',
        'Offerte aanvragen': 'Demander un devis',
        'Bekijk alles': 'Voir tout',
        'Bekijk aanbod': 'Voir les produits',
        'Lees meer': 'Lire la suite',
        'Meer info': 'Plus d\'infos',
        'Neem contact op': 'Contactez-nous',
        'Verstuur': 'Envoyer',
        'Zoeken': 'Rechercher',
        'Zoek producten...': 'Rechercher des produits...',
        
        # Categories
        'Graafbakken': 'Godets',
        'Slotenbakken': 'Godets tranchée',
        'Dieplepelbakken': 'Godets de terrassement',
        'Sorteergrijpers': 'Grappins de tri',
        'Sloopgrijpers': 'Grappins de démolition',
        'Sloop- en sorteergrijpers': 'Grappins de tri et démolition',
        'Sloop- en Sorteergrijpers': 'Grappins de Tri et Démolition',
        'Overige': 'Autres',
        'Kraanbakken': 'Godets pour pelles',
        'Kraanbak': 'Godet',
        
        # Form labels
        'Naam': 'Nom',
        'E-mailadres': 'Adresse e-mail',
        'E-mail': 'E-mail',
        'Telefoonnummer': 'Numéro de téléphone',
        'Telefoon': 'Téléphone',
        'Bedrijfsnaam': 'Nom de l\'entreprise',
        'Bericht': 'Message',
        'Uw bericht': 'Votre message',
        
        # Common phrases
        'Op voorraad': 'En stock',
        'Niet op voorraad': 'Rupture de stock',
        'Prijs op aanvraag': 'Prix sur demande',
        'Vanaf': 'À partir de',
        'incl. BTW': 'TVA incl.',
        'excl. BTW': 'hors TVA',
        'Belgische Productie': 'Production Belge',
        'Snelle levering': 'Livraison rapide',
        'Alle rechten voorbehouden': 'Tous droits réservés',
        
        # Page titles
        'NEEM CONTACT OP': 'CONTACTEZ-NOUS',
        'OVER ONS': 'À PROPOS DE NOUS',
        'VEELGESTELDE VRAGEN': 'QUESTIONS FRÉQUENTES',
        'KENNISBANK': 'BASE DE CONNAISSANCES',
        'PRIVACY': 'CONFIDENTIALITÉ',
        'VOORWAARDEN': 'CONDITIONS',
        
        # Hero section
        'KRAANBAKKEN & AANBOUWDELEN': 'GODETS & ACCESSOIRES',
        'Professionele graafbakken': 'Godets professionnels',
        'slotenbakken en sorteergrijpers': 'godets tranchée et grappins de tri',
        'Vervaardigd in België': 'Fabriqués en Belgique',
        'geleverd in de Benelux': 'livrés dans le Benelux',
        
        # CTA
        'HULP NODIG?': 'BESOIN D\'AIDE?',
        'Weet u niet zeker': 'Vous ne savez pas',
        'Onze specialisten helpen u graag': 'Nos spécialistes sont là pour vous aider',
    },
    
    'de-de': {
        # Navigation & Common
        'Home': 'Startseite',
        'Producten': 'Produkte',
        'Alle Producten': 'Alle Produkte',
        'Contact': 'Kontakt',
        'Over ons': 'Über uns',
        'Over Ons': 'Über Uns',
        'FAQ': 'FAQ',
        'Blog': 'Blog',
        'Inloggen': 'Anmelden',
        'Dealer worden': 'Händler werden',
        'Configurator': 'Konfigurator',
        'Offerte aanvragen': 'Angebot anfordern',
        'Bekijk alles': 'Alle anzeigen',
        'Bekijk aanbod': 'Produkte ansehen',
        'Lees meer': 'Mehr lesen',
        'Meer info': 'Mehr Infos',
        'Neem contact op': 'Kontaktieren Sie uns',
        'Verstuur': 'Senden',
        'Zoeken': 'Suchen',
        'Zoek producten...': 'Produkte suchen...',
        
        # Categories
        'Graafbakken': 'Baggerlöffel',
        'Slotenbakken': 'Grabenräumlöffel',
        'Dieplepelbakken': 'Tieflöffel',
        'Sorteergrijpers': 'Sortiergreifer',
        'Sloopgrijpers': 'Abbruchgreifer',
        'Sloop- en sorteergrijpers': 'Sortier- und Abbruchgreifer',
        'Sloop- en Sorteergrijpers': 'Sortier- und Abbruchgreifer',
        'Overige': 'Sonstiges',
        'Kraanbakken': 'Baggerlöffel',
        'Kraanbak': 'Baggerlöffel',
        
        # Form labels
        'Naam': 'Name',
        'E-mailadres': 'E-Mail-Adresse',
        'E-mail': 'E-Mail',
        'Telefoonnummer': 'Telefonnummer',
        'Telefoon': 'Telefon',
        'Bedrijfsnaam': 'Firmenname',
        'Bericht': 'Nachricht',
        'Uw bericht': 'Ihre Nachricht',
        
        # Common phrases
        'Op voorraad': 'Auf Lager',
        'Niet op voorraad': 'Nicht auf Lager',
        'Prijs op aanvraag': 'Preis auf Anfrage',
        'Vanaf': 'Ab',
        'incl. BTW': 'inkl. MwSt.',
        'excl. BTW': 'zzgl. MwSt.',
        'Belgische Productie': 'Belgische Produktion',
        'Snelle levering': 'Schnelle Lieferung',
        'Alle rechten voorbehouden': 'Alle Rechte vorbehalten',
        
        # Page titles
        'NEEM CONTACT OP': 'KONTAKTIEREN SIE UNS',
        'OVER ONS': 'ÜBER UNS',
        'VEELGESTELDE VRAGEN': 'HÄUFIG GESTELLTE FRAGEN',
        'KENNISBANK': 'WISSENSDATENBANK',
        'PRIVACY': 'DATENSCHUTZ',
        'VOORWAARDEN': 'AGB',
        
        # Hero section
        'KRAANBAKKEN & AANBOUWDELEN': 'BAGGERLÖFFEL & ANBAUGERÄTE',
        'Professionele graafbakken': 'Professionelle Baggerlöffel',
        'slotenbakken en sorteergrijpers': 'Grabenräumlöffel und Sortiergreifer',
        'Vervaardigd in België': 'Hergestellt in Belgien',
        'geleverd in de Benelux': 'geliefert in die Benelux',
        
        # CTA
        'HULP NODIG?': 'HILFE BENÖTIGT?',
        'Weet u niet zeker': 'Sie sind sich nicht sicher',
        'Onze specialisten helpen u graag': 'Unsere Spezialisten helfen Ihnen gerne',
    }
}

def translate_file(filepath, translations):
    """Translate content in a single HTML file."""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Sort translations by length (longest first) to avoid partial replacements
    sorted_translations = sorted(translations.items(), key=lambda x: len(x[0]), reverse=True)
    
    for dutch, translated in sorted_translations:
        # Use word boundaries where possible
        content = content.replace(f'>{dutch}<', f'>{translated}<')
        content = content.replace(f'>{dutch} ', f'>{translated} ')
        content = content.replace(f' {dutch}<', f' {translated}<')
        content = content.replace(f'"{dutch}"', f'"{translated}"')
        content = content.replace(f"'{dutch}'", f"'{translated}'")
        content = content.replace(f'placeholder="{dutch}"', f'placeholder="{translated}"')
        content = content.replace(f'aria-label="{dutch}"', f'aria-label="{translated}"')
        content = content.replace(f'title="{dutch}"', f'title="{translated}"')
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def translate_locale(web_root, locale):
    """Translate all HTML files in a locale folder."""
    
    if locale not in TRANSLATIONS:
        print(f"  No translations available for {locale}")
        return 0
    
    translations = TRANSLATIONS[locale]
    locale_folder = os.path.join(web_root, locale)
    
    if not os.path.exists(locale_folder):
        print(f"  Locale folder not found: {locale}")
        return 0
    
    translated_count = 0
    
    for root, dirs, files in os.walk(locale_folder):
        for filename in files:
            if filename.endswith('.html'):
                filepath = os.path.join(root, filename)
                if translate_file(filepath, translations):
                    rel_path = os.path.relpath(filepath, web_root)
                    translated_count += 1
    
    return translated_count

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    web_root = os.path.join(os.path.dirname(script_dir), 'web')
    
    print("Translating locale content...")
    print()
    
    for locale in ['be-fr', 'de-de']:
        print(f"Translating /{locale}/...")
        count = translate_locale(web_root, locale)
        print(f"  ✓ {count} files updated")
        print()
    
    print("Done!")

if __name__ == '__main__':
    main()
