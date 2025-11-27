# Structon Database & CMS Setup Guide

## 📊 Database Architectuur

### Database Schema Overzicht

```
┌─────────────────────────────────────────────────────────────────┐
│                    STRUCTON DATABASE SCHEMA                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   USERS      │         │  CATEGORIES  │         │    BRANDS    │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (UUID)    │         │ id (UUID)    │         │ id (UUID)    │
│ email        │         │ title        │         │ title        │
│ password     │         │ slug         │         │ slug         │
│ role         │         │ description  │         │ logo_url     │
│ is_active    │         │ image_url    │         │ is_active    │
└──────────────┘         │ sort_order   │         └──────────────┘
                         │ is_active    │
                         └──────────────┘
                                │
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────┐
│                          PRODUCTS                                │
├──────────────────────────────────────────────────────────────────┤
│ id (UUID)                                                        │
│ title, slug, description                                         │
│ category_id (FK) → categories.id                                 │
│ brand_id (FK) → brands.id                                        │
│                                                                  │
│ KRAANBAK SPECS:                                                  │
│ • excavator_weight_min/max (kg)                                  │
│ • width (mm)                                                     │
│ • volume (liters)                                                │
│ • weight (kg)                                                    │
│ • attachment_type (CW00-CW45, S40-S80)                          │
│                                                                  │
│ MEDIA:                                                           │
│ • cloudinary_images (JSONB) - [{public_id, url, alt}]          │
│                                                                  │
│ EXTRA:                                                           │
│ • specs (JSONB) - {materiaal, kleur, etc}                       │
│ • stock_quantity                                                 │
│ • is_active, is_featured                                         │
└──────────────────────────────────────────────────────────────────┘
                                │
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────┐
│                      PRODUCT_PRICES                              │
├──────────────────────────────────────────────────────────────────┤
│ id (UUID)                                                        │
│ product_id (FK) → products.id                                    │
│ price (DECIMAL)                                                  │
│ currency (EUR)                                                   │
│ visible_for_user_id (optioneel voor klant-specifieke prijzen)   │
│ valid_from, valid_until                                          │
└──────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│   SECTORS    │◄────────┤ PRODUCT_SECTORS  │────────►│   PRODUCTS   │
├──────────────┤         ├──────────────────┤         └──────────────┘
│ id (UUID)    │         │ product_id (FK)  │
│ title        │         │ sector_id (FK)   │
│ slug         │         └──────────────────┘
│ description  │         Many-to-Many
│ image_url    │
└──────────────┘

┌──────────────┐         ┌──────────────┐
│    ORDERS    │◄────────┤ ORDER_ITEMS  │
├──────────────┤         ├──────────────┤
│ id (UUID)    │         │ order_id     │
│ user_id (FK) │         │ product_id   │
│ status       │         │ quantity     │
│ total_amount │         │ unit_price   │
└──────────────┘         └──────────────┘
```

### Belangrijke Features

#### 1. **Flexibele Product Specs**
```sql
-- JSONB velden voor dynamische data
cloudinary_images: [
  {
    "public_id": "structon/kraanbak-123",
    "url": "https://res.cloudinary.com/...",
    "alt": "Slotenbak 300mm"
  }
]

specs: {
  "materiaal": "Hardox 450",
  "kleur": "Geel",
  "garantie": "2 jaar"
}
```

#### 2. **Prijzen Gescheiden van Producten**
- Prijzen in aparte tabel voor flexibiliteit
- Optie voor klant-specifieke prijzen
- Tijdsgebonden prijzen (valid_from/until)
- Alleen zichtbaar voor ingelogde gebruikers

#### 3. **SEO-Vriendelijke Slugs**
- Unieke slugs voor alle entiteiten
- Automatische slug generatie
- URL-vriendelijk formaat

## 🎛️ CMS Admin Interface

### Toegang
```
URL: https://your-domain.com/cms/
Login: admin@structon.nl
```

### Dashboard Overzicht

```
┌─────────────────────────────────────────────────────────────────┐
│  STRUCTON CMS                                        [Admin ▼]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 Dashboard                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ 📦  125  │  │ 📁   12  │  │ 🏷️   8   │  │ 👥  45   │      │
│  │ Producten│  │Categorieën│  │  Merken  │  │Gebruikers│      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
│  Recente Activiteit:                                           │
│  • Product "Slotenbak 300mm" toegevoegd                        │
│  • Prijs bijgewerkt voor "Dieplepelbak 600mm"                  │
│  • Nieuwe gebruiker geregistreerd                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

SIDEBAR MENU:
├─ 📊 Dashboard
├─ 📦 Producten
├─ 📁 Categorieën
├─ 🏷️ Merken
├─ 🏭 Sectoren
├─ 💰 Prijzen
└─ 👥 Gebruikers
```

### CMS Modules

#### 1. **Producten Beheer**
```javascript
// Product CRUD operaties
POST   /api/admin/products          // Nieuw product
GET    /api/admin/products          // Alle producten
GET    /api/admin/products/:id      // Specifiek product
PUT    /api/admin/products/:id      // Update product
DELETE /api/admin/products/:id      // Verwijder product

// Product velden:
{
  "title": "Slotenbak 300mm CW10",
  "slug": "slotenbak-300mm-cw10",
  "description": "Hoogwaardige slotenbak...",
  "category_id": "uuid",
  "brand_id": "uuid",
  "excavator_weight_min": 1000,
  "excavator_weight_max": 2000,
  "width": 300,
  "volume": 80,
  "weight": 45,
  "attachment_type": "CW10",
  "cloudinary_images": [...],
  "specs": {...},
  "stock_quantity": 15,
  "is_active": true,
  "is_featured": false
}
```

#### 2. **Categorieën Beheer**
```javascript
POST   /api/admin/categories
GET    /api/admin/categories
PUT    /api/admin/categories/:id
DELETE /api/admin/categories/:id

// Categorie velden:
{
  "title": "Slotenbakken",
  "slug": "slotenbakken",
  "description": "Slotenbakken voor alle graafmachines",
  "image_url": "https://...",
  "sort_order": 1,
  "is_active": true
}
```

#### 3. **Merken Beheer**
```javascript
POST   /api/admin/brands
GET    /api/admin/brands
PUT    /api/admin/brands/:id
DELETE /api/admin/brands/:id

// Merk velden:
{
  "title": "Caterpillar",
  "slug": "caterpillar",
  "logo_url": "https://..."
}
```

#### 4. **Prijzen Beheer**
```javascript
POST   /api/admin/prices
GET    /api/admin/prices
PUT    /api/admin/prices/:id
DELETE /api/admin/prices/:id

// Prijs velden:
{
  "product_id": "uuid",
  "price": 1250.00,
  "currency": "EUR",
  "visible_for_user_id": null,  // null = voor iedereen
  "valid_from": "2024-01-01",
  "valid_until": null
}
```

#### 5. **Gebruikers Beheer**
```javascript
POST   /api/admin/users
GET    /api/admin/users
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id

// Gebruiker velden:
{
  "email": "klant@bedrijf.nl",
  "password": "hashed",
  "role": "user",  // of "admin"
  "is_active": true
}
```

## 🚀 Setup Instructies

### 1. Database Setup

```bash
# 1. PostgreSQL installeren (Railway of lokaal)
# Railway: https://railway.app → New Project → PostgreSQL

# 2. Database migreren
cd cms
node database/migrate.js

# 3. Seed data toevoegen (optioneel)
node database/seeds/run.js
```

### 2. CMS Backend Starten

```bash
# 1. Installeer dependencies
cd cms
npm install

# 2. Configureer .env
cp .env.example .env

# Edit .env:
DATABASE_URL=postgresql://user:pass@host:5432/structon
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
PORT=3000
FRONTEND_URL=http://localhost:8080

# 3. Start server
npm run dev
```

### 3. CMS Admin Interface

```bash
# CMS draait automatisch op:
http://localhost:3000/cms/

# API endpoints:
http://localhost:3000/api/products
http://localhost:3000/api/categories
http://localhost:3000/api/auth/login
```

## 🔐 Authenticatie & Beveiliging

### Admin Login
```javascript
POST /api/auth/login
{
  "email": "admin@structon.nl",
  "password": "your-password"
}

// Response:
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "admin@structon.nl",
    "role": "admin"
  }
}
```

### Beveiligingslagen
1. **JWT Tokens** - Voor authenticatie
2. **Role-based Access** - Admin vs User
3. **Rate Limiting** - API bescherming
4. **Password Hashing** - bcrypt
5. **CORS** - Cross-origin beveiliging

## 📸 Cloudinary Integratie

### Afbeeldingen Uploaden
```javascript
// Via CMS interface:
1. Selecteer product
2. Klik "Upload Afbeelding"
3. Kies bestand
4. Automatisch upload naar Cloudinary
5. URL opgeslagen in database

// Cloudinary response:
{
  "public_id": "structon/kraanbak-123",
  "url": "https://res.cloudinary.com/...",
  "secure_url": "https://res.cloudinary.com/...",
  "width": 1200,
  "height": 800
}
```

### Transformaties
```javascript
// Automatische optimalisatie:
- Responsive images (w_auto, q_auto)
- Format conversie (f_auto)
- Lazy loading
- WebP support
```

## 🔄 API Endpoints Overzicht

### Public API (geen auth)
```
GET  /api/products              - Alle actieve producten
GET  /api/products/:id          - Product detail
GET  /api/categories            - Alle categorieën
GET  /api/brands                - Alle merken
GET  /api/sectors               - Alle sectoren
GET  /api/health                - Health check
```

### Protected API (login required)
```
GET  /api/products/:id/price    - Product prijs
POST /api/auth/me               - Huidige gebruiker
POST /api/auth/logout           - Uitloggen
```

### Admin API (admin only)
```
/api/admin/products/*           - Product CRUD
/api/admin/categories/*         - Categorie CRUD
/api/admin/brands/*             - Merk CRUD
/api/admin/sectors/*            - Sector CRUD
/api/admin/prices/*             - Prijs CRUD
/api/admin/users/*              - Gebruiker CRUD
```

## 📝 Database Queries Voorbeelden

### Product met Prijs en Categorie
```sql
SELECT 
  p.*,
  c.title as category_title,
  b.title as brand_title,
  pp.price,
  pp.currency
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN product_prices pp ON pp.product_id = p.id
WHERE p.is_active = true
  AND pp.visible_for_user_id IS NULL
ORDER BY p.created_at DESC;
```

### Producten per Categorie met Filters
```sql
SELECT p.*, pp.price
FROM products p
LEFT JOIN product_prices pp ON pp.product_id = p.id
WHERE p.category_id = $1
  AND p.is_active = true
  AND ($2::text IS NULL OR p.attachment_type = $2)
  AND ($3::int IS NULL OR p.width >= $3)
  AND ($4::int IS NULL OR p.width <= $4)
ORDER BY p.created_at DESC
LIMIT $5 OFFSET $6;
```

### Featured Producten
```sql
SELECT p.*, c.title as category_title
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_featured = true
  AND p.is_active = true
ORDER BY p.created_at DESC
LIMIT 8;
```

## 🛠️ Maintenance & Backup

### Database Backup
```bash
# Backup maken
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup_20240101.sql
```

### Logs Monitoren
```bash
# Server logs
tail -f cms/logs/server.log

# Database queries
tail -f cms/logs/queries.log
```

## 📊 Performance Tips

1. **Database Indexen** - Al geconfigureerd in migration
2. **Cloudinary CDN** - Automatische caching
3. **API Rate Limiting** - Bescherming tegen overload
4. **JSONB Indexen** - Voor snelle specs queries
5. **Connection Pooling** - Efficiënt database gebruik

## 🎯 Volgende Stappen

1. ✅ Database schema opgezet
2. ✅ CMS backend compleet
3. ✅ Admin interface werkend
4. ✅ API endpoints beschikbaar
5. ⏳ Seed data toevoegen
6. ⏳ Producten importeren
7. ⏳ Gebruikers aanmaken
8. ⏳ Prijzen instellen

---

**Status**: Production Ready 🚀
**Database**: PostgreSQL (Railway)
**Backend**: Node.js + Express
**Admin**: Custom CMS Interface
