# Structon B2B Webshop - Complete Systeem Overzicht

## 🏗️ Architectuur Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         STRUCTON PLATFORM                           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (WEB)                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📱 PUBLIC WEBSITE                                                  │
│  ├─ Homepage (featured products, USP sectie)                       │
│  ├─ Categoriepagina's (filters, zoeken, paginering)               │
│  ├─ Productpagina's (specs, afbeeldingen, prijzen*)               │
│  ├─ SEO Landing Pages (merken, sectoren, kennisbank)              │
│  └─ Contact & Login                                                │
│                                                                     │
│  🎨 DESIGN SYSTEM                                                   │
│  ├─ Split Button (offerte/bekijken)                               │
│  ├─ Navigatie (top bar + main nav)                                │
│  ├─ Product Cards (responsive)                                     │
│  └─ Petrol branding (#236773)                                      │
│                                                                     │
│  🔐 AUTH STATE                                                      │
│  ├─ Niet-ingelogd: "Login voor prijs" + Offerte button           │
│  └─ Ingelogd: Prijzen + "Toevoegen aan offerte" button           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ HTTPS/REST API
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (CMS API)                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🔌 REST API ENDPOINTS                                              │
│  ├─ /api/products (GET, POST, PUT, DELETE)                        │
│  ├─ /api/categories                                                │
│  ├─ /api/brands                                                    │
│  ├─ /api/sectors                                                   │
│  ├─ /api/auth (login, logout, me)                                 │
│  └─ /api/admin/* (admin-only routes)                              │
│                                                                     │
│  🛡️ MIDDLEWARE                                                      │
│  ├─ JWT Authentication                                             │
│  ├─ Role-based Access (admin/user)                                │
│  ├─ Rate Limiting                                                  │
│  ├─ Error Handling                                                 │
│  └─ Request Logging                                                │
│                                                                     │
│  🎛️ ADMIN CMS INTERFACE                                            │
│  ├─ Dashboard (stats, recente activiteit)                         │
│  ├─ Producten Beheer (CRUD, afbeeldingen, specs)                  │
│  ├─ Categorieën Beheer                                             │
│  ├─ Merken Beheer                                                  │
│  ├─ Prijzen Beheer (standaard + klant-specifiek)                  │
│  └─ Gebruikers Beheer                                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ PostgreSQL
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DATABASE (PostgreSQL)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📊 CORE TABLES                                                     │
│  ├─ users (email, password, role)                                 │
│  ├─ categories (title, slug, image)                               │
│  ├─ brands (title, slug, logo)                                    │
│  ├─ sectors (title, slug, description)                            │
│  ├─ products (specs, images JSONB, stock)                         │
│  ├─ product_prices (price, currency, user-specific)               │
│  ├─ product_sectors (many-to-many)                                │
│  ├─ orders (status, total)                                        │
│  └─ order_items (quantity, price)                                 │
│                                                                     │
│  🔍 INDEXES                                                         │
│  ├─ Slug indexes (fast lookups)                                   │
│  ├─ Foreign key indexes                                            │
│  ├─ Status indexes (active, featured)                             │
│  └─ JSONB indexes (specs queries)                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      CLOUDINARY (MEDIA CDN)                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📸 AFBEELDING STORAGE                                              │
│  ├─ Product afbeeldingen                                           │
│  ├─ Categorie afbeeldingen                                         │
│  ├─ Merk logo's                                                    │
│  └─ SEO afbeeldingen                                               │
│                                                                     │
│  ⚡ TRANSFORMATIES                                                  │
│  ├─ Responsive images (w_auto)                                     │
│  ├─ Format optimalisatie (f_auto, q_auto)                         │
│  ├─ WebP conversie                                                 │
│  └─ Lazy loading                                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structuur

```
Structon/
│
├── 🌐 web/                          # Frontend Website
│   ├── index.html                   # Homepage
│   ├── pages/                       # Standalone pagina's
│   │   ├── category.html            # Categorie overzicht
│   │   ├── product.html             # Product detail
│   │   ├── contact.html             # Contact formulier
│   │   └── login.html               # Login pagina
│   │
│   ├── assets/
│   │   ├── css/
│   │   │   ├── global.css           # 🎨 Global styles + navigatie
│   │   │   └── pages/               # Page-specific CSS
│   │   │       ├── home.css
│   │   │       ├── category.css
│   │   │       ├── product.css
│   │   │       └── unique-section.css
│   │   │
│   │   └── js/
│   │       ├── main.js              # 🔧 Global JS + product cards
│   │       ├── auth.js              # 🔐 Authentication
│   │       ├── pricing.js           # 💰 Dynamic pricing
│   │       ├── filters.js           # 🔍 Product filtering
│   │       ├── pagination.js        # 📄 Pagination
│   │       ├── api/                 # API client
│   │       └── pages/               # Page-specific JS
│   │
│   └── [SEO Landing Pages]/         # 🎯 SEO optimized pages
│       ├── kraanbakken/
│       ├── slotenbakken/
│       ├── sectoren/grondwerkers/
│       └── kennisbank/
│
├── 🎛️ cms/                          # Backend CMS
│   ├── server.js                    # Express server
│   ├── config/                      # Configuration
│   │   ├── database.js              # PostgreSQL config
│   │   ├── cloudinary.js            # Cloudinary config
│   │   └── env.js                   # Environment variables
│   │
│   ├── models/                      # Database models
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Brand.js
│   │   ├── Sector.js
│   │   ├── User.js
│   │   └── ProductPrice.js
│   │
│   ├── routes/                      # API routes
│   │   ├── api/                     # Public API
│   │   │   ├── products.routes.js
│   │   │   ├── categories.routes.js
│   │   │   ├── brands.routes.js
│   │   │   ├── sectors.routes.js
│   │   │   └── auth.routes.js
│   │   │
│   │   └── admin/                   # Admin API
│   │       ├── products.routes.js
│   │       ├── categories.routes.js
│   │       ├── brands.routes.js
│   │       ├── sectors.routes.js
│   │       ├── prices.routes.js
│   │       └── users.routes.js
│   │
│   ├── middleware/                  # Express middleware
│   │   ├── auth.js                  # JWT authentication
│   │   ├── errorHandler.js          # Error handling
│   │   ├── logger.js                # Request logging
│   │   └── rateLimit.js             # Rate limiting
│   │
│   ├── database/                    # Database management
│   │   ├── migrations/
│   │   │   └── 001_create_tables.sql
│   │   └── seeds/
│   │       ├── seed.js
│   │       └── run.js
│   │
│   └── public/                      # CMS Admin Interface
│       ├── index.html               # Dashboard
│       └── assets/
│           ├── css/admin.css
│           └── js/admin.js
│
├── 📚 docs/                         # Documentation
│   ├── DATABASE_CMS_SETUP.md        # Database & CMS setup
│   ├── CMS_GEBRUIKSHANDLEIDING.md   # CMS user guide
│   ├── QUICK_START_PRODUCTEN.md     # Quick start guide
│   ├── CLOUDINARY_SETUP.md          # Cloudinary setup
│   └── DEPLOY-CMS-RAILWAY.md        # Deployment guide
│
├── .github/workflows/               # CI/CD
│   └── deploy.yml                   # Auto-deploy to GitHub Pages
│
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── README.md                        # Project README
└── PROJECT_STRUCTURE.md             # Project structure overview
```

---

## 🔄 Data Flow

### 1️⃣ Bezoeker komt op website

```
Bezoeker → Homepage
         ↓
    Featured Products laden
         ↓
    GET /api/products?featured=true
         ↓
    Backend haalt data uit database
         ↓
    Product cards renderen
         ↓
    Prijzen verborgen (niet ingelogd)
         ↓
    "Offerte aanvragen" button getoond
```

### 2️⃣ Bezoeker logt in

```
Bezoeker → Login pagina
         ↓
    Email + Wachtwoord invoeren
         ↓
    POST /api/auth/login
         ↓
    Backend valideert credentials
         ↓
    JWT token gegenereerd
         ↓
    Token opgeslagen in cookie
         ↓
    Redirect naar homepage
         ↓
    Auth state update
         ↓
    Prijzen nu zichtbaar
         ↓
    "Toevoegen aan offerte" button getoond
```

### 3️⃣ Ingelogde gebruiker bekijkt product

```
Gebruiker → Product pagina
         ↓
    GET /api/products/:id
         ↓
    Product data laden
         ↓
    GET /api/products/:id/price (met JWT token)
         ↓
    Backend checkt auth
         ↓
    Prijs uit database halen
         ↓
    Prijs + voorraad tonen
         ↓
    "Toevoegen aan offerte" button actief
```

### 4️⃣ Admin beheert producten via CMS

```
Admin → CMS Dashboard
         ↓
    Login met admin credentials
         ↓
    JWT token met role=admin
         ↓
    Producten → Nieuw Product
         ↓
    Formulier invullen
         ↓
    Afbeelding uploaden
         ↓
    POST naar Cloudinary
         ↓
    Cloudinary URL ontvangen
         ↓
    POST /api/admin/products (met JWT)
         ↓
    Backend valideert admin role
         ↓
    Product opslaan in database
         ↓
    Success → Product zichtbaar op website
```

---

## 🔐 Authenticatie & Autorisatie

### Rollen

```
┌──────────────────────────────────────────────────────────┐
│                    GUEST (Niet ingelogd)                 │
├──────────────────────────────────────────────────────────┤
│ ✅ Producten bekijken                                    │
│ ✅ Categorieën browsen                                   │
│ ✅ Zoeken & filteren                                     │
│ ❌ Prijzen zien                                          │
│ ❌ Bestellen                                             │
│ ➡️ "Login voor prijs" + "Offerte aanvragen" button      │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                    USER (Ingelogde klant)                │
├──────────────────────────────────────────────────────────┤
│ ✅ Alles van Guest                                       │
│ ✅ Prijzen bekijken                                      │
│ ✅ Voorraad zien                                         │
│ ✅ Offerte aanvragen                                     │
│ ✅ Bestellen (fase 2)                                    │
│ ❌ CMS toegang                                           │
│ ➡️ Prijzen zichtbaar + "Toevoegen aan offerte" button   │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                    ADMIN (Beheerder)                     │
├──────────────────────────────────────────────────────────┤
│ ✅ Alles van User                                        │
│ ✅ CMS toegang                                           │
│ ✅ Producten beheren                                     │
│ ✅ Categorieën beheren                                   │
│ ✅ Prijzen instellen                                     │
│ ✅ Gebruikers beheren                                    │
│ ✅ Alle admin functies                                   │
│ ➡️ Volledige controle over platform                     │
└──────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment

### Frontend (GitHub Pages)
```
Repository: github.com/LeeLars/Structon
Branch: main
Auto-deploy: ✅ (via GitHub Actions)
URL: https://leelars.github.io/Structon/
```

### Backend (Railway)
```
Platform: Railway.app
Database: PostgreSQL (Railway)
Environment: Production
URL: https://structon-cms.up.railway.app
Auto-deploy: ✅ (via Railway GitHub integration)
```

### Cloudinary (Media CDN)
```
Cloud: Cloudinary
Plan: Free tier (25GB storage, 25GB bandwidth)
Transformations: Automatisch
CDN: Global
```

---

## 📊 Database Schema Samenvatting

```sql
-- USERS (Klanten + Admins)
users (id, email, password_hash, role, is_active)

-- PRODUCTEN
products (id, title, slug, description, category_id, brand_id,
          width, volume, weight, attachment_type,
          cloudinary_images JSONB, specs JSONB,
          stock_quantity, is_active, is_featured)

-- PRIJZEN (Gescheiden van producten)
product_prices (id, product_id, price, currency,
                visible_for_user_id, valid_from, valid_until)

-- CATEGORIEËN
categories (id, title, slug, description, image_url, sort_order)

-- MERKEN
brands (id, title, slug, logo_url)

-- SECTOREN
sectors (id, title, slug, description, image_url)

-- KOPPELTABELLEN
product_sectors (product_id, sector_id)

-- BESTELLINGEN (Fase 2)
orders (id, user_id, status, total_amount)
order_items (id, order_id, product_id, quantity, unit_price)
```

---

## 🎯 Key Features

### ✅ Geïmplementeerd

1. **Product Catalogus**
   - Dynamische product cards
   - Filters & zoeken
   - Paginering
   - Responsive design

2. **B2B Functionaliteit**
   - Prijzen alleen voor ingelogde gebruikers
   - Split button design (offerte/bekijken)
   - Auth state management
   - Role-based access

3. **CMS Admin Interface**
   - Product CRUD
   - Categorie beheer
   - Merk beheer
   - Prijs beheer
   - Gebruiker beheer
   - Cloudinary integratie

4. **Database & API**
   - PostgreSQL schema
   - REST API endpoints
   - JWT authenticatie
   - Rate limiting
   - Error handling

5. **Design System**
   - Split button component
   - Nieuwe navigatie (top bar + main nav)
   - Petrol branding
   - Responsive breakpoints

### ⏳ Fase 2 (Toekomstig)

1. **Winkelwagen & Checkout**
   - Winkelwagen functionaliteit
   - Checkout proces
   - Bestellingen beheer

2. **SEO Optimalisatie**
   - SEO landing pages
   - Blog/kennisbank
   - Structured data
   - Sitemap generatie

3. **Klant-specifieke Prijzen**
   - Prijsgroepen
   - Volume kortingen
   - Klant-specifieke prijzen

4. **Geavanceerde Filters**
   - Faceted search
   - Prijs range filters
   - Merk filters
   - Voorraad filters

---

## 📞 Support & Documentatie

### Documentatie Bestanden
```
📚 docs/
├─ DATABASE_CMS_SETUP.md        → Database & CMS technische setup
├─ CMS_GEBRUIKSHANDLEIDING.md   → CMS gebruikershandleiding
├─ QUICK_START_PRODUCTEN.md     → Quick start: eerste producten
├─ CLOUDINARY_SETUP.md          → Cloudinary configuratie
└─ DEPLOY-CMS-RAILWAY.md        → Deployment instructies
```

### Quick Links
- **GitHub Repo**: https://github.com/LeeLars/Structon
- **Live Website**: https://leelars.github.io/Structon/
- **CMS Backend**: http://localhost:3000/cms/ (lokaal)
- **API Docs**: http://localhost:3000/api/ (lokaal)

---

**Status**: ✅ Production Ready  
**Versie**: 1.0.0  
**Laatst bijgewerkt**: November 2024
