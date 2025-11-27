# Quick Start: Eerste Producten Toevoegen

## 🚀 In 15 minuten je eerste producten online

### Stap 1: Start de CMS Backend (5 min)

```bash
# Terminal 1: Start CMS backend
cd cms
npm install
npm run dev

# Output:
# 🚀 Structon CMS draait op poort 3000
```

### Stap 2: Open CMS Interface (1 min)

```
Browser: http://localhost:3000/cms/
Login: admin@structon.nl
Password: [Uw wachtwoord]
```

---

## 📁 Stap 3: Categorieën Aanmaken (3 min)

### Categorie 1: Slotenbakken
```
Titel: Slotenbakken
Slug: slotenbakken (automatisch)
Beschrijving: Slotenbakken voor alle graafmachines en minigravers. 
              Geschikt voor grondwerk, kabels leggen en precisiegraven.
Afbeelding: [Upload categorie afbeelding]
Sorteervolgorde: 1
Status: ✓ Actief
```

### Categorie 2: Dieplepelbakken
```
Titel: Dieplepelbakken
Slug: dieplepelbakken
Beschrijving: Dieplepelbakken voor sloten graven en watergangen. 
              Extra smalle uitvoering voor precisiewerk.
Sorteervolgorde: 2
Status: ✓ Actief
```

### Categorie 3: Puinbakken
```
Titel: Puinbakken
Slug: puinbakken
Beschrijving: Robuuste puinbakken voor zwaar sloopwerk. 
              Versterkte constructie met Hardox staal.
Sorteervolgorde: 3
Status: ✓ Actief
```

---

## 🏷️ Stap 4: Merken Aanmaken (2 min)

```
1. Caterpillar (slug: caterpillar)
2. Komatsu (slug: komatsu)
3. Volvo (slug: volvo)
4. Kubota (slug: kubota)
5. JCB (slug: jcb)
```

---

## 📦 Stap 5: Eerste Producten Toevoegen (4 min)

### Product 1: Slotenbak 300mm CW10

```javascript
// BASIS INFO
Titel: Slotenbak 300mm CW10
Slug: slotenbak-300mm-cw10
Categorie: Slotenbakken
Merk: Caterpillar

// BESCHRIJVING
Hoogwaardige slotenbak van 300mm breed, speciaal ontworpen voor 
minigravers van 1-2 ton. Vervaardigd uit Hardox 450 staal voor 
maximale slijtvastheid. Ideaal voor kabels leggen, leidingwerk 
en precisiegraven.

// SPECIFICATIES
Breedte: 300 mm
Inhoud: 80 liter
Gewicht: 45 kg
Min. graafmachine: 1000 kg (1 ton)
Max. graafmachine: 2000 kg (2 ton)
Ophanging: CW10

// EXTRA SPECS (JSON)
{
  "materiaal": "Hardox 450",
  "kleur": "Geel",
  "garantie": "2 jaar",
  "slijtplaten": "Ja",
  "tanden": "3 stuks"
}

// VOORRAAD
Voorraad: 15
Status: ✓ Actief
Featured: ✓ Ja (toon op homepage)
```

### Product 2: Slotenbak 400mm CW10

```javascript
Titel: Slotenbak 400mm CW10
Slug: slotenbak-400mm-cw10
Categorie: Slotenbakken
Merk: Caterpillar

Beschrijving: Slotenbak 400mm breed voor minigravers 1.5-3 ton. 
Hardox 450 constructie met versterkte slijtplaten.

Breedte: 400 mm
Inhoud: 120 liter
Gewicht: 58 kg
Min. graafmachine: 1500 kg
Max. graafmachine: 3000 kg
Ophanging: CW10

Voorraad: 12
Status: ✓ Actief
Featured: ☐ Nee
```

### Product 3: Dieplepelbak 600mm CW10

```javascript
Titel: Dieplepelbak 600mm CW10
Slug: dieplepelbak-600mm-cw10
Categorie: Dieplepelbakken
Merk: Volvo

Beschrijving: Extra smalle dieplepelbak voor sloten graven en 
watergangen. Geschikt voor minigravers 2-4 ton.

Breedte: 600 mm
Inhoud: 180 liter
Gewicht: 85 kg
Min. graafmachine: 2000 kg
Max. graafmachine: 4000 kg
Ophanging: CW10

Voorraad: 8
Status: ✓ Actief
Featured: ✓ Ja
```

### Product 4: Puinbak 1200mm CW30

```javascript
Titel: Puinbak 1200mm CW30
Slug: puinbak-1200mm-cw30
Categorie: Puinbakken
Merk: Komatsu

Beschrijving: Robuuste puinbak voor zwaar sloopwerk. Extra versterkte 
constructie met Hardox 500 staal. Geschikt voor graafmachines 8-12 ton.

Breedte: 1200 mm
Inhoud: 800 liter
Gewicht: 285 kg
Min. graafmachine: 8000 kg
Max. graafmachine: 12000 kg
Ophanging: CW30

Extra specs:
{
  "materiaal": "Hardox 500",
  "kleur": "Oranje",
  "garantie": "3 jaar",
  "slijtplaten": "Extra dik",
  "versterking": "Dubbel"
}

Voorraad: 5
Status: ✓ Actief
Featured: ☐ Nee
```

---

## 💰 Stap 6: Prijzen Toevoegen

### Prijs voor Slotenbak 300mm
```
Product: Slotenbak 300mm CW10
Prijs: 1250.00
Valuta: EUR
Zichtbaar voor: Alle ingelogde gebruikers
Geldig vanaf: [Vandaag]
Geldig tot: [Leeg laten]
```

### Prijs voor Slotenbak 400mm
```
Product: Slotenbak 400mm CW10
Prijs: 1450.00
Valuta: EUR
```

### Prijs voor Dieplepelbak 600mm
```
Product: Dieplepelbak 600mm CW10
Prijs: 1850.00
Valuta: EUR
```

### Prijs voor Puinbak 1200mm
```
Product: Puinbak 1200mm CW30
Prijs: 3250.00
Valuta: EUR
```

---

## 📸 Afbeeldingen Tips

### Waar vind ik goede product afbeeldingen?

**Optie 1: Eigen foto's**
- Maak foto's met witte achtergrond
- Gebruik goede belichting
- Meerdere hoeken (voor, zij, boven)

**Optie 2: Stock foto's (tijdelijk)**
```
Unsplash.com zoektermen:
- "excavator bucket"
- "construction equipment"
- "heavy machinery"
- "digging bucket"
```

**Optie 3: Leverancier foto's**
- Vraag foto's aan bij leverancier
- Check copyright/gebruiksrechten

### Afbeelding Formaat
```
Resolutie: 1200x1200px (minimaal)
Formaat: JPG (foto's) of PNG (transparante achtergrond)
Grootte: Max 5MB
Achtergrond: Wit (#FFFFFF) of transparant
```

---

## ✅ Checklist: Is alles klaar?

```
☐ CMS backend draait (http://localhost:3000)
☐ Ingelogd in CMS interface
☐ 3+ Categorieën aangemaakt
☐ 5+ Merken aangemaakt
☐ 4+ Producten toegevoegd
☐ Prijzen ingesteld voor alle producten
☐ Afbeeldingen geüpload
☐ Producten op "Actief" gezet
☐ 2+ Producten als "Featured" gemarkeerd
```

---

## 🌐 Stap 7: Controleer op Website

### Start Frontend
```bash
# Terminal 2: Start frontend
cd web
# Open index.html in browser of gebruik live server
```

### Controleer
```
✓ Homepage toont featured producten
✓ Categoriepagina toont alle producten
✓ Product detail pagina werkt
✓ Prijzen verborgen voor niet-ingelogde bezoekers
✓ "Offerte aanvragen" button werkt
```

---

## 🎯 Volgende Stappen

### Meer Producten Toevoegen
```
Aanbevolen: 20-50 producten per categorie
- Varieer in breedtes (200mm - 1500mm)
- Verschillende ophangingen (CW00 - CW45)
- Meerdere merken per categorie
```

### Gebruikers Aanmaken
```
1. Maak test gebruiker aan
2. Test login op website
3. Controleer of prijzen zichtbaar zijn
4. Test offerte aanvraag
```

### SEO Optimalisatie
```
- Voeg uitgebreide beschrijvingen toe
- Gebruik relevante zoekwoorden
- Voeg alt-teksten toe aan afbeeldingen
- Controleer slugs (URL-vriendelijk)
```

---

## 📊 Voorbeeld Product Data (CSV Import)

Als je veel producten hebt, kun je deze CSV gebruiken voor bulk import:

```csv
title,slug,category,width,volume,weight,attachment_type,price,stock
Slotenbak 200mm CW05,slotenbak-200mm-cw05,slotenbakken,200,50,35,CW05,950.00,20
Slotenbak 250mm CW05,slotenbak-250mm-cw05,slotenbakken,250,65,40,CW05,1050.00,18
Slotenbak 300mm CW10,slotenbak-300mm-cw10,slotenbakken,300,80,45,CW10,1250.00,15
Slotenbak 350mm CW10,slotenbak-350mm-cw10,slotenbakken,350,95,52,CW10,1350.00,12
Slotenbak 400mm CW10,slotenbak-400mm-cw10,slotenbakken,400,120,58,CW10,1450.00,12
Dieplepelbak 500mm CW10,dieplepelbak-500mm-cw10,dieplepelbakken,500,150,72,CW10,1650.00,10
Dieplepelbak 600mm CW10,dieplepelbak-600mm-cw10,dieplepelbakken,600,180,85,CW10,1850.00,8
Puinbak 1000mm CW20,puinbak-1000mm-cw20,puinbakken,1000,600,220,CW20,2850.00,6
Puinbak 1200mm CW30,puinbak-1200mm-cw30,puinbakken,1200,800,285,CW30,3250.00,5
```

**Import via API:**
```bash
node cms/scripts/import-products.js products.csv
```

---

## 🆘 Problemen?

### CMS laadt niet
```bash
# Check of backend draait
curl http://localhost:3000/api/health

# Herstart backend
cd cms
npm run dev
```

### Kan niet inloggen
```bash
# Reset admin wachtwoord
cd cms
node scripts/reset-admin-password.js
```

### Afbeeldingen uploaden niet
```
- Check Cloudinary credentials in .env
- Controleer bestandsgrootte (max 5MB)
- Controleer bestandsformaat (JPG/PNG)
```

---

**Klaar!** 🎉 Je hebt nu een werkende productcatalogus met CMS!

**Volgende stap**: Voeg meer producten toe en test de volledige flow.
