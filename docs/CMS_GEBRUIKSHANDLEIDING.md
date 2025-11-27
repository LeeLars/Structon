# Structon CMS - Gebruikshandleiding

## 📖 Inhoudsopgave
1. [Inloggen](#inloggen)
2. [Dashboard](#dashboard)
3. [Producten Beheren](#producten-beheren)
4. [Categorieën Beheren](#categorieën-beheren)
5. [Merken Beheren](#merken-beheren)
6. [Prijzen Beheren](#prijzen-beheren)
7. [Gebruikers Beheren](#gebruikers-beheren)
8. [Tips & Tricks](#tips--tricks)

---

## 🔐 Inloggen

### Toegang tot CMS
```
URL: https://your-domain.com/cms/
Email: admin@structon.nl
Wachtwoord: [Uw admin wachtwoord]
```

### Eerste Keer Inloggen
1. Ga naar `/cms/`
2. Voer uw email en wachtwoord in
3. Klik op "Inloggen"
4. U wordt doorgestuurd naar het dashboard

---

## 📊 Dashboard

Het dashboard geeft een overzicht van:
- **Totaal aantal producten**
- **Aantal categorieën**
- **Aantal merken**
- **Aantal gebruikers**
- **Recente activiteit**

---

## 📦 Producten Beheren

### Nieuw Product Toevoegen

#### Stap 1: Basis Informatie
```
Titel: Slotenbak 300mm CW10
Slug: slotenbak-300mm-cw10 (automatisch gegenereerd)
Beschrijving: Hoogwaardige slotenbak geschikt voor minigravers...
```

#### Stap 2: Categorie & Merk
```
Categorie: Slotenbakken (dropdown)
Merk: Caterpillar (optioneel)
```

#### Stap 3: Specificaties
```
AFMETINGEN:
- Breedte: 300 mm
- Inhoud: 80 liter
- Gewicht: 45 kg

GRAAFMACHINE KLASSE:
- Min. gewicht: 1000 kg (1 ton)
- Max. gewicht: 2000 kg (2 ton)

OPHANGING:
- Type: CW10 (dropdown)
  Opties: CW00, CW05, CW10, CW20, CW30, CW40, CW45, S40, S50, S60, S70, S80
```

#### Stap 4: Afbeeldingen
```
1. Klik op "Afbeelding Uploaden"
2. Selecteer bestand (max 5MB)
3. Afbeelding wordt automatisch geüpload naar Cloudinary
4. Voeg meerdere afbeeldingen toe (eerste = hoofdafbeelding)
```

**Aanbevolen afbeelding specs:**
- Formaat: JPG of PNG
- Resolutie: Min. 1200x1200px
- Achtergrond: Wit of transparant
- Bestandsgrootte: Max 5MB

#### Stap 5: Extra Specificaties (Optioneel)
```json
{
  "materiaal": "Hardox 450",
  "kleur": "Geel",
  "garantie": "2 jaar",
  "certificering": "CE"
}
```

#### Stap 6: Voorraad & Status
```
Voorraad: 15 stuks
Status: Actief ✓
Featured: Nee ☐ (toon op homepage)
```

#### Stap 7: Opslaan
- Klik op **"Product Toevoegen"**
- Product is nu zichtbaar in de lijst
- Vergeet niet een prijs toe te voegen! (zie Prijzen Beheren)

---

### Product Bewerken

1. Ga naar **Producten** in het menu
2. Zoek het product in de lijst
3. Klik op **"Bewerken"** (✏️ icoon)
4. Pas de gewenste velden aan
5. Klik op **"Opslaan"**

---

### Product Verwijderen

⚠️ **Let op**: Verwijderde producten kunnen niet worden hersteld!

1. Ga naar **Producten**
2. Klik op **"Verwijderen"** (🗑️ icoon)
3. Bevestig de actie
4. Product wordt permanent verwijderd

**Alternatief**: Zet product op "Inactief" om tijdelijk te verbergen

---

## 📁 Categorieën Beheren

### Nieuwe Categorie Toevoegen

```
Titel: Slotenbakken
Slug: slotenbakken (automatisch)
Beschrijving: Slotenbakken voor alle graafmachines en minigravers...
Afbeelding: [Upload categorie afbeelding]
Sorteervolgorde: 1 (lagere nummers verschijnen eerst)
Status: Actief ✓
```

### Categorieën Sorteren

De **sorteervolgorde** bepaalt de volgorde op de website:
```
1. Slotenbakken (sort_order: 1)
2. Dieplepelbakken (sort_order: 2)
3. Puinbakken (sort_order: 3)
```

---

## 🏷️ Merken Beheren

### Nieuw Merk Toevoegen

```
Titel: Caterpillar
Slug: caterpillar
Logo: [Upload merk logo - bij voorkeur PNG met transparante achtergrond]
Status: Actief ✓
```

### Merken Koppelen aan Producten

1. Bewerk een product
2. Selecteer merk uit dropdown
3. Opslaan

**Gebruik**: Producten filteren per merk, SEO landing pages

---

## 💰 Prijzen Beheren

### Prijs Toevoegen aan Product

#### Standaard Prijs (voor alle klanten)
```
Product: Slotenbak 300mm CW10 (dropdown)
Prijs: 1250.00
Valuta: EUR
Zichtbaar voor: Alle ingelogde gebruikers
Geldig vanaf: 2024-01-01
Geldig tot: [Leeg laten voor onbeperkt]
```

#### Klant-Specifieke Prijs (optioneel)
```
Product: Slotenbak 300mm CW10
Prijs: 1150.00 (korting voor specifieke klant)
Valuta: EUR
Zichtbaar voor: Jan Jansen (klant@bedrijf.nl)
Geldig vanaf: 2024-01-01
Geldig tot: 2024-12-31
```

### Prijs Updaten

**Optie 1: Nieuwe prijs toevoegen**
- Voeg nieuwe prijs toe met nieuwe datum
- Oude prijs blijft in historiek
- Systeem toont altijd de meest recente geldige prijs

**Optie 2: Bestaande prijs bewerken**
- Bewerk de huidige prijs
- Historiek wordt overschreven

---

## 👥 Gebruikers Beheren

### Nieuwe Gebruiker Toevoegen

```
Email: klant@bedrijf.nl
Wachtwoord: [Genereer sterk wachtwoord]
Rol: User (of Admin)
Status: Actief ✓
```

### Rollen

**User (Klant)**
- Kan inloggen op website
- Ziet prijzen
- Kan offerte aanvragen
- Kan bestellen (fase 2)

**Admin**
- Volledige toegang tot CMS
- Kan producten beheren
- Kan prijzen instellen
- Kan gebruikers beheren

### Gebruiker Deactiveren

1. Ga naar **Gebruikers**
2. Klik op **"Bewerken"**
3. Zet **Status** op "Inactief"
4. Gebruiker kan niet meer inloggen

---

## 🎯 Tips & Tricks

### SEO Optimalisatie

#### Product Titels
```
✅ GOED: Slotenbak 300mm CW10 - Hardox 450
❌ SLECHT: Bak 1
```

#### Beschrijvingen
```
✅ GOED: Hoogwaardige slotenbak van 300mm breed, geschikt voor 
         minigravers van 1-2 ton. Vervaardigd uit Hardox 450 staal...
         
❌ SLECHT: Goede bak.
```

#### Slugs
```
✅ GOED: slotenbak-300mm-cw10-hardox
❌ SLECHT: product-123
```

---

### Afbeeldingen Optimalisatie

**Bestandsnamen**
```
✅ GOED: slotenbak-300mm-cw10-voorkant.jpg
❌ SLECHT: IMG_1234.jpg
```

**Alt Tekst** (automatisch gegenereerd uit product titel)
```
✅ GOED: Slotenbak 300mm CW10 voor minigraver
```

---

### Voorraad Beheer

**Voorraad Statussen**
```
> 10 stuks   → "Op voorraad"
1-10 stuks   → "Beperkte voorraad"
0 stuks      → "Niet op voorraad"
```

**Tips:**
- Update voorraad regelmatig
- Zet producten zonder voorraad op "Inactief" of laat ze staan met "Niet op voorraad"
- Gebruik featured flag voor populaire producten

---

### Bulk Acties

**Meerdere Producten Tegelijk Bewerken**
1. Selecteer producten met checkboxes
2. Kies actie uit dropdown:
   - Activeren
   - Deactiveren
   - Verwijderen
   - Categorie wijzigen
3. Klik op "Toepassen"

---

### Zoeken & Filteren

**In Productenlijst:**
```
🔍 Zoeken op:
- Titel
- SKU
- Categorie
- Merk
- Attachment type

📊 Filteren op:
- Status (Actief/Inactief)
- Categorie
- Merk
- Voorraad (Op voorraad/Niet op voorraad)
- Featured
```

---

### Sneltoetsen

```
Ctrl + S    → Opslaan
Ctrl + N    → Nieuw item
Esc         → Annuleren/Sluiten
```

---

## 🆘 Veelgestelde Vragen

### Hoe voeg ik meerdere afbeeldingen toe?
1. Upload eerste afbeelding (wordt hoofdafbeelding)
2. Klik op "+ Afbeelding Toevoegen"
3. Upload volgende afbeelding
4. Herhaal voor meer afbeeldingen
5. Sleep afbeeldingen om volgorde te wijzigen

### Waarom zie ik geen prijs op de website?
- Controleer of er een prijs is toegevoegd in "Prijzen"
- Controleer of de prijs geldig is (valid_from/until)
- Controleer of gebruiker is ingelogd (prijzen alleen voor ingelogde gebruikers)

### Hoe maak ik een product featured?
1. Bewerk product
2. Vink "Featured" aan
3. Opslaan
4. Product verschijnt nu op homepage

### Kan ik producten importeren vanuit Excel?
Ja, via de API. Neem contact op met de developer voor een import script.

### Hoe reset ik mijn wachtwoord?
Neem contact op met de hoofdbeheerder of developer.

---

## 📞 Support

**Technische vragen?**
- Email: support@structon.nl
- Telefoon: +31 (0)12 345 6789

**Bug melden?**
- Beschrijf het probleem
- Voeg screenshots toe
- Vermeld welke browser u gebruikt

---

**Versie**: 1.0.0  
**Laatst bijgewerkt**: November 2024
