#!/usr/bin/env python3
"""
Translate Offerte-aanvragen (Quote Request) Pages for be-fr and de-de
"""

import os
import re
from pathlib import Path

# French translations
translations_fr = {
    # Team section
    'Ontmoet het team': 'Rencontrez l\'équipe',
    'Wij denken graag met u mee voor de beste oplossing.': 'Nous réfléchissons volontiers avec vous pour trouver la meilleure solution.',
    'Mede-eigenaar en oprichter': 'Co-propriétaire et fondateur',
    'External Sales': 'Ventes externes',
    
    # Technical fields
    'Specificaties': 'Spécifications',
    'Product / Baktype': 'Produit / Type de godet',
    'Selecteer een categorie...': 'Sélectionnez une catégorie...',
    'Rioolbakken': 'Godets d\'égout',
    'Sortiergreifer': 'Pinces de tri',
    'Abbruchhämmer': 'Marteaux de démolition',
    'Sonstige': 'Autres',
    
    # Product prefilled
    'Geselecteerd product': 'Produit sélectionné',
    'Product:': 'Produit :',
    'Type:': 'Type :',
    'Merk:': 'Marque :',
    'Tonnage:': 'Tonnage :',
    'Aufhängung:': 'Attache :',
    'Breite:': 'Largeur :',
    'Inhoud:': 'Volume :',
    
    # Machine info
    'Merk Bagger': 'Marque de pelle',
    'Selecteer merk...': 'Sélectionnez une marque...',
    'Anders': 'Autre',
    'Welk merk? *': 'Quelle marque ? *',
    'Typ het merk van uw Bagger': 'Entrez la marque de votre pelle',
    'Model / Tonnage': 'Modèle / Tonnage',
    'bv. CAT 320 of 20 ton': 'p.ex. CAT 320 ou 20 tonnes',
    
    # CW connection
    'CW-aansluiting': 'Raccord CW',
    'Selecteer aansluiting...': 'Sélectionnez un raccord...',
    'Weet ik niet': 'Je ne sais pas',
    
    # Message
    'Uw vraag of opmerkingen': 'Votre question ou commentaires',
    'Beschrijf uw vraag, gewenste afmetingen, of andere specificaties...': 'Décrivez votre question, dimensions souhaitées ou autres spécifications...',
    
    # Privacy
    'Ik ga akkoord met de': 'J\'accepte la',
    'privacyverklaring': 'politique de confidentialité',
    'U moet akkoord gaan met de privacyverklaring': 'Vous devez accepter la politique de confidentialité',
    
    # Submit button
    'Bestelling Plaatsen': 'Passer la commande',
    'Verzenden...': 'Envoi en cours...',
    
    # Opening hours
    'Openingstijden': 'Heures d\'ouverture',
    'Maandag - Vrijdag': 'Lundi - Vendredi',
    'Zaterdag': 'Samedi',
    'Op afspraak': 'Sur rendez-vous',
    'Zondag': 'Dimanche',
    'Gesloten': 'Fermé',
    
    # Quick links
    'Snelle Links': 'Liens rapides',
    'Alle producten bekijken': 'Voir tous les produits',
    'Baggerlöffel bekijken': 'Voir les godets',
    'Over Structon': 'À propos de Structon',
    'Contact opnemen': 'Nous contacter',
    
    # Contact info
    'Direct contact': 'Contact direct',
    'Adres': 'Adresse',
    'Routebeschrijving': 'Itinéraire',
    'Telefon': 'Téléphone',
    'E-Mail': 'E-mail'
}

# German translations
translations_de = {
    # Team section
    'Ontmoet het team': 'Lernen Sie das Team kennen',
    'Wij denken graag met u mee voor de beste oplossing.': 'Wir denken gerne mit Ihnen über die beste Lösung nach.',
    'Mede-eigenaar en oprichter': 'Miteigentümer und Gründer',
    'External Sales': 'Außendienst',
    
    # Technical fields
    'Specificaties': 'Spezifikationen',
    'Product / Baktype': 'Produkt / Löffeltyp',
    'Selecteer een categorie...': 'Wählen Sie eine Kategorie...',
    'Rioolbakken': 'Kanallöffel',
    'Sortiergreifer': 'Sortiergreifer',
    'Abbruchhämmer': 'Abbruchhämmer',
    'Sonstige': 'Sonstige',
    
    # Product prefilled
    'Geselecteerd product': 'Ausgewähltes Produkt',
    'Product:': 'Produkt:',
    'Type:': 'Typ:',
    'Merk:': 'Marke:',
    'Tonnage:': 'Tonnage:',
    'Aufhängung:': 'Aufhängung:',
    'Breite:': 'Breite:',
    'Inhoud:': 'Volumen:',
    
    # Machine info
    'Merk Bagger': 'Baggermarke',
    'Selecteer merk...': 'Wählen Sie eine Marke...',
    'Anders': 'Andere',
    'Welk merk? *': 'Welche Marke? *',
    'Typ het merk van uw Bagger': 'Geben Sie die Marke Ihres Baggers ein',
    'Model / Tonnage': 'Modell / Tonnage',
    'bv. CAT 320 of 20 ton': 'z.B. CAT 320 oder 20 Tonnen',
    
    # CW connection
    'CW-aansluiting': 'CW-Anschluss',
    'Selecteer aansluiting...': 'Wählen Sie einen Anschluss...',
    'Weet ik niet': 'Weiß ich nicht',
    
    # Message
    'Uw vraag of opmerkingen': 'Ihre Frage oder Anmerkungen',
    'Beschrijf uw vraag, gewenste afmetingen, of andere specificaties...': 'Beschreiben Sie Ihre Frage, gewünschte Abmessungen oder andere Spezifikationen...',
    
    # Privacy
    'Ik ga akkoord met de': 'Ich stimme der',
    'privacyverklaring': 'Datenschutzerklärung',
    'U moet akkoord gaan met de privacyverklaring': 'Sie müssen der Datenschutzerklärung zustimmen',
    
    # Submit button
    'Bestelling Plaatsen': 'Bestellung aufgeben',
    'Verzenden...': 'Wird gesendet...',
    
    # Opening hours
    'Openingstijden': 'Öffnungszeiten',
    'Maandag - Vrijdag': 'Montag - Freitag',
    'Zaterdag': 'Samstag',
    'Op afspraak': 'Nach Vereinbarung',
    'Zondag': 'Sonntag',
    'Gesloten': 'Geschlossen',
    
    # Quick links
    'Snelle Links': 'Schnellzugriff',
    'Alle producten bekijken': 'Alle Produkte ansehen',
    'Baggerlöffel bekijken': 'Baggerlöffel ansehen',
    'Over Structon': 'Über Structon',
    'Contact opnemen': 'Kontakt aufnehmen',
    
    # Contact info
    'Direct contact': 'Direkter Kontakt',
    'Adres': 'Adresse',
    'Routebeschrijving': 'Routenbeschreibung',
    'Telefon': 'Telefon',
    'E-Mail': 'E-Mail'
}

def translate_offerte_page(filepath, translations):
    """Translate offerte-aanvragen page"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Sort by length (longest first) to avoid partial replacements
        sorted_translations = sorted(translations.items(), key=lambda x: len(x[0]), reverse=True)
        
        for dutch, translation in sorted_translations:
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
    
    # Process be-fr offerte page
    print("Processing be-fr offerte-aanvragen page...")
    be_fr_offerte = base_dir / 'be-fr' / 'offerte-aanvragen' / 'index.html'
    if be_fr_offerte.exists():
        if translate_offerte_page(be_fr_offerte, translations_fr):
            print(f"  ✓ {be_fr_offerte.relative_to(base_dir)}")
        else:
            print(f"  - No changes needed for {be_fr_offerte.relative_to(base_dir)}")
    
    # Process de-de offerte page
    print("\nProcessing de-de offerte-aanvragen page...")
    de_de_offerte = base_dir / 'de-de' / 'offerte-aanvragen' / 'index.html'
    if de_de_offerte.exists():
        if translate_offerte_page(de_de_offerte, translations_de):
            print(f"  ✓ {de_de_offerte.relative_to(base_dir)}")
        else:
            print(f"  - No changes needed for {de_de_offerte.relative_to(base_dir)}")
    
    print("\n✅ Offerte-aanvragen pages translation completed")

if __name__ == '__main__':
    main()
