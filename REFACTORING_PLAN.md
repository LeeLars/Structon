# CONTACT & OFFERTE FORMULIER REFACTORING PLAN

## DOEL
Splits het huidige contact/offerte formulier in twee aparte pagina's:
1. **Contact pagina** (`/contact/`) - Simpel contactformulier (naam, email, telefoon, bericht)
2. **Offerte pagina** (`/offerte-aanvragen/`) - Volledig offerte formulier (zoals nu op contact pagina)

## STAP 1: INVENTARISATIE ALLE LINKS

### Offerte Aanvragen Links (moeten naar `/offerte-aanvragen/`)
- **Industrie pagina's** (8x): `/industrieen/[industry]/` - Hero CTA + Bottom CTA
  - loonwerk-landbouw, wegenbouw, verhuur, grondwerkers, baggerwerken, recycling, afbraak-sloop, tuinaanleggers
- **Sector pagina's** (4x): `/sectoren/[sector]/` - Hero CTA buttons
  - grondwerkers, sloop-afbraak, verhuurbedrijven, recycling, wegenbouw
- **Brand pagina's** (15x): `/kraanbakken/[brand]/` - Bottom CTA
  - volvo, caterpillar, komatsu, hitachi, liebherr, jcb, kubota, takeuchi, yanmar, develon, case, hyundai, kobelco, sany, wacker-neuson
- **Product pagina's**: `product.js` - buildQuoteUrl() functie
- **Pricing.js**: renderQuoteRequired() functie
- **Configurator**: `/configurator/` - "Vraag Maatwerk Offerte" button
- **Homepage**: Mogelijk CTA buttons

### Contact Opnemen Links (blijven naar `/contact/`)
- **Login pagina**: "Contact Opnemen" button
- **Sectoren overview**: "Contact Opnemen" CTA
- **Sectoren detail**: "Neem Contact Op" buttons

## STAP 2: NIEUWE OFFERTE PAGINA MAKEN
- [ ] Maak directory `/web/offerte-aanvragen/`
- [ ] Kopieer huidige contact/index.html naar offerte-aanvragen/index.html
- [ ] Behoud volledig offerte formulier met alle velden
- [ ] Update page title, meta description, breadcrumb
- [ ] Maak `/web/assets/js/pages/offerte.js` (kopieer van contact.js)
- [ ] Zorg voor CMS integratie (quotes API endpoint)

## STAP 3: VEREENVOUDIG CONTACT PAGINA
- [ ] Verwijder alle offerte-specifieke velden uit contact/index.html
- [ ] Behoud alleen: naam, email, telefoon, bericht
- [ ] Update contact.js voor simpel contactformulier
- [ ] Gebruik aparte API endpoint voor contact berichten

## STAP 4: UPDATE ALLE LINKS
- [ ] Update alle industrie pagina's (8x)
- [ ] Update alle sector pagina's (4x)
- [ ] Update alle brand pagina's (15x)
- [ ] Update product.js buildQuoteUrl()
- [ ] Update pricing.js renderQuoteRequired()
- [ ] Update configurator pagina
- [ ] Update homepage (indien van toepassing)

## STAP 5: TESTEN & VALIDEREN
- [ ] Test offerte formulier submission
- [ ] Test contact formulier submission
- [ ] Verificeer CMS integratie
- [ ] Test alle links naar beide pagina's
- [ ] Test mobile responsive

## TOTAAL AANTAL BESTANDEN TE UPDATEN
- 1x nieuwe offerte pagina maken
- 1x contact pagina vereenvoudigen
- 2x JavaScript bestanden (offerte.js nieuw, contact.js update)
- 8x industrie pagina's
- 4x sector pagina's
- 15x brand pagina's
- 2x JS modules (product.js, pricing.js)
- 1x configurator pagina
- **TOTAAL: ~34 bestanden**
