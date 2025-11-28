# Subcategorieën Setup - Tonnage Navigatie

## Wat is er geïmplementeerd?

✅ **Database structuur**
- Nieuwe `subcategories` tabel met tonnage ranges
- Relatie tussen categories en subcategories
- Products kunnen nu gekoppeld worden aan subcategorieën

✅ **Backend (CMS)**
- Subcategory model met CRUD operaties
- API endpoints: `/api/subcategories`
- Admin routes: `/api/admin/subcategories`
- Seed data met tonnage-gebaseerde subcategorieën voor alle categorieën

✅ **Frontend**
- **Mega menu's** over volledige breedte van het scherm
- Dynamisch laden van subcategorieën per categorie
- "Bekijk alle [Category]" knop in elk mega menu
- Hover animaties en smooth transitions
- Responsive (mega menu alleen op desktop)

## Subcategorieën per categorie

### Kraanbakken
- 1t - 2,5t
- 2,5t - 5t
- 5t - 10t
- 10t - 15t
- 15t - 25t
- 25t+

### Slotenbakken
- 1t - 2,5t
- 2,5t - 5t
- 5t - 10t
- 10t - 15t
- 15t - 25t

### Dieplepelbakken
- 1t - 2,5t
- 2,5t - 5t
- 5t - 10t
- 10t - 15t
- 15t - 25t
- 25t+

### Sorteergrijpers
- 2,5t - 5t
- 5t - 10t
- 10t - 15t
- 15t - 25t

### Sloophamers
- 1t - 2,5t
- 2,5t - 5t
- 5t - 10t
- 10t - 15t
- 15t - 25t

### Adapters
- Geen tonnage subcategorieën (adapters zijn universeel)

## Database Migratie & Seed Uitvoeren

### Stap 1: Database migratie uitvoeren
```bash
cd cms
npm run migrate
```

Dit voert de nieuwe migratie uit: `003_create_subcategories.sql`

### Stap 2: Seed data uitvoeren
```bash
npm run seed
```

Dit vult de database met:
- Alle categorieën
- Alle subcategorieën met tonnage ranges
- Test producten
- Brands, sectors, etc.

### Stap 3: CMS server herstarten
```bash
npm run dev
```

### Stap 4: Frontend testen
Open de website en hover over de menu items. Je zou nu mega menu's moeten zien met:
- Titel: "[Category] per tonnage"
- "Bekijk alle [Category]" knop (rechts)
- Grid met alle tonnage subcategorieën

## API Endpoints

### Public API
```
GET /api/subcategories
GET /api/subcategories?category_slug=kraanbakken
GET /api/subcategories?category_id={uuid}
GET /api/subcategories/:id
```

### Admin API (vereist authenticatie)
```
GET    /api/admin/subcategories
POST   /api/admin/subcategories
PATCH  /api/admin/subcategories/:id
DELETE /api/admin/subcategories/:id
```

## Mega Menu Features

✨ **Full-width design**
- Mega menu neemt volledige breedte van viewport
- Max-width container voor content (1200px)
- Grid layout voor subcategorieën

✨ **"Bekijk alle" knop**
- Prominent geplaatst in header van mega menu
- Linkt naar hoofdcategorie pagina
- Hover animatie met pijl

✨ **Smooth UX**
- Hover delay zodat menu niet te snel verdwijnt
- Fade in/out animaties
- Hover states op alle items

## Volgende Stappen

1. **Category pagina's aanpassen** om subcategorie filtering te ondersteunen
2. **Product toewijzing** - producten koppelen aan juiste subcategorieën
3. **Breadcrumbs** toevoegen voor betere navigatie
4. **Mobile menu** uitbreiden met subcategorieën (accordion style)

## Troubleshooting

**Mega menu verschijnt niet?**
- Check of CMS server draait en API bereikbaar is
- Open browser console voor JavaScript errors
- Controleer of subcategorieën correct zijn aangemaakt in database

**Database errors?**
- Zorg dat alle eerdere migraties zijn uitgevoerd
- Check database connectie in `.env` file
- Bekijk CMS server logs voor details
