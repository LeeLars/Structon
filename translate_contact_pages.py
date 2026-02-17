#!/usr/bin/env python3
"""
Translate Contact Pages for be-fr and de-de
"""

import os
import re
from pathlib import Path

# French translations
translations_fr = {
    'Stel uw vraag': 'Posez votre question',
    'Vul het formulier in en wij nemen zo snel mogelijk contact met u op.': 'Remplissez le formulaire et nous vous contacterons dans les plus brefs délais.',
    'Voor een offerte aanvraag kunt u': 'Pour une demande de devis, vous pouvez',
    'hier terecht': 'cliquer ici',
    
    # Form fields
    'Name': 'Nom',
    'Uw volledige naam': 'Votre nom complet',
    'Vul uw naam in': 'Veuillez entrer votre nom',
    'E-Mail-Adresse': 'Adresse e-mail',
    'uw@email.be': 'votre@email.be',
    'Vul een geldig e-mailadres in': 'Veuillez entrer une adresse e-mail valide',
    'Telefonnummer': 'Numéro de téléphone',
    'Ihre Nachricht': 'Votre message',
    'Stel hier uw vraag of typ uw bericht...': 'Posez votre question ou tapez votre message ici...',
    'Vul uw bericht in': 'Veuillez entrer votre message',
    
    # Privacy
    'Datenschutz': 'Confidentialité',
    'Ik ga akkoord met de': 'J\'accepte la',
    'privacyverklaring': 'politique de confidentialité',
    'algemene voorwaarden': 'conditions générales',
    'U moet akkoord gaan met de privacyverklaring': 'Vous devez accepter la politique de confidentialité',
    
    # Submit button
    'Senden Nachricht': 'Envoyer le message',
    'Verzenden...': 'Envoi en cours...',
    
    # Success message
    'Bedankt voor uw bericht!': 'Merci pour votre message !',
    'Wij hebben uw bericht ontvangen en nemen zo snel mogelijk contact met u op.': 'Nous avons reçu votre message et vous contacterons dans les plus brefs délais.',
    'Terug naar Startseite': 'Retour à l\'accueil',
    
    # Contact info
    'Ontmoet het team': 'Rencontrez l\'équipe',
    'Wij denken graag met u mee voor de beste oplossing.': 'Nous réfléchissons volontiers avec vous pour trouver la meilleure solution.',
    'Mede-eigenaar en oprichter': 'Co-propriétaire et fondateur',
    'External Sales': 'Ventes externes',
    'Direct contact': 'Contact direct',
    'Adres': 'Adresse',
    'Routebeschrijving': 'Itinéraire',
    'Telefon': 'Téléphone',
    'E-Mail': 'E-mail',
    
    # Opening hours
    'Openingstijden': 'Heures d\'ouverture',
    'Maandag - Vrijdag': 'Lundi - Vendredi',
    'Zaterdag': 'Samedi',
    'Op afspraak': 'Sur rendez-vous',
    'Zondag': 'Dimanche',
    'Gesloten': 'Fermé',
    
    # Quick links
    'Snelle Links': 'Liens rapides',
    'Baggerlöffel bekijken': 'Voir les godets',
    'Grabenlöffel bekijken': 'Voir les godets de tranchée',
    'Veelgestelde vragen': 'Questions fréquentes'
}

# German translations
translations_de = {
    'Stel uw vraag': 'Stellen Sie Ihre Frage',
    'Vul het formulier in en wij nemen zo snel mogelijk contact met u op.': 'Füllen Sie das Formular aus und wir werden uns so schnell wie möglich bei Ihnen melden.',
    'Voor een offerte aanvraag kunt u': 'Für eine Angebotsanfrage können Sie',
    'hier terecht': 'hier klicken',
    
    # Form fields
    'Name': 'Name',
    'Uw volledige naam': 'Ihr vollständiger Name',
    'Vul uw naam in': 'Bitte geben Sie Ihren Namen ein',
    'E-Mail-Adresse': 'E-Mail-Adresse',
    'uw@email.be': 'ihre@email.de',
    'Vul een geldig e-mailadres in': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    'Telefonnummer': 'Telefonnummer',
    'Ihre Nachricht': 'Ihre Nachricht',
    'Stel hier uw vraag of typ uw bericht...': 'Stellen Sie hier Ihre Frage oder geben Sie Ihre Nachricht ein...',
    'Vul uw bericht in': 'Bitte geben Sie Ihre Nachricht ein',
    
    # Privacy
    'Datenschutz': 'Datenschutz',
    'Ik ga akkoord met de': 'Ich stimme der',
    'privacyverklaring': 'Datenschutzerklärung',
    'algemene voorwaarden': 'Allgemeinen Geschäftsbedingungen',
    'U moet akkoord gaan met de privacyverklaring': 'Sie müssen der Datenschutzerklärung zustimmen',
    
    # Submit button
    'Senden Nachricht': 'Nachricht senden',
    'Verzenden...': 'Wird gesendet...',
    
    # Success message
    'Bedankt voor uw bericht!': 'Vielen Dank für Ihre Nachricht!',
    'Wij hebben uw bericht ontvangen en nemen zo snel mogelijk contact met u op.': 'Wir haben Ihre Nachricht erhalten und werden uns so schnell wie möglich bei Ihnen melden.',
    'Terug naar Startseite': 'Zurück zur Startseite',
    
    # Contact info
    'Ontmoet het team': 'Lernen Sie das Team kennen',
    'Wij denken graag met u mee voor de beste oplossing.': 'Wir denken gerne mit Ihnen über die beste Lösung nach.',
    'Mede-eigenaar en oprichter': 'Miteigentümer und Gründer',
    'External Sales': 'Außendienst',
    'Direct contact': 'Direkter Kontakt',
    'Adres': 'Adresse',
    'Routebeschrijving': 'Routenbeschreibung',
    'Telefon': 'Telefon',
    'E-Mail': 'E-Mail',
    
    # Opening hours
    'Openingstijden': 'Öffnungszeiten',
    'Maandag - Vrijdag': 'Montag - Freitag',
    'Zaterdag': 'Samstag',
    'Op afspraak': 'Nach Vereinbarung',
    'Zondag': 'Sonntag',
    'Gesloten': 'Geschlossen',
    
    # Quick links
    'Snelle Links': 'Schnellzugriff',
    'Baggerlöffel bekijken': 'Baggerlöffel ansehen',
    'Grabenlöffel bekijken': 'Grabenlöffel ansehen',
    'Veelgestelde vragen': 'Häufig gestellte Fragen'
}

def translate_contact_page(filepath, translations):
    """Translate contact page"""
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
    
    # Process be-fr contact page
    print("Processing be-fr contact page...")
    be_fr_contact = base_dir / 'be-fr' / 'contact' / 'index.html'
    if be_fr_contact.exists():
        if translate_contact_page(be_fr_contact, translations_fr):
            print(f"  ✓ {be_fr_contact.relative_to(base_dir)}")
        else:
            print(f"  - No changes needed for {be_fr_contact.relative_to(base_dir)}")
    
    # Process de-de contact page
    print("\nProcessing de-de contact page...")
    de_de_contact = base_dir / 'de-de' / 'contact' / 'index.html'
    if de_de_contact.exists():
        if translate_contact_page(de_de_contact, translations_de):
            print(f"  ✓ {de_de_contact.relative_to(base_dir)}")
        else:
            print(f"  - No changes needed for {de_de_contact.relative_to(base_dir)}")
    
    print("\n✅ Contact pages translation completed")

if __name__ == '__main__':
    main()
