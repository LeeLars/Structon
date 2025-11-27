# Structon Project - Clean Structure

## 📁 Project Overzicht

```
Structon/
├── cms/                          # Backend API & Admin CMS
│   ├── config/                   # Database, Cloudinary, ENV config
│   ├── database/                 # Migrations & seeds
│   ├── middleware/               # Auth, error handling, rate limiting
│   ├── models/                   # Database models (Product, Category, etc.)
│   ├── public/                   # CMS admin interface
│   ├── routes/                   # API & admin routes
│   ├── server.js                 # Express server
│   └── package.json              # Backend dependencies
│
├── web/                          # Frontend webshop
│   ├── assets/
│   │   ├── css/
│   │   │   ├── global.css        # Global styles & navigation
│   │   │   └── pages/            # Page-specific CSS
│   │   │       ├── home.css
│   │   │       ├── category.css
│   │   │       ├── product.css
│   │   │       ├── blog.css
│   │   │       ├── brand.css
│   │   │       ├── sector.css
│   │   │       ├── login.css
│   │   │       └── unique-section.css
│   │   │
│   │   └── js/
│   │       ├── api/              # API client
│   │       ├── pages/            # Page-specific JS
│   │       ├── auth.js           # Authentication
│   │       ├── filters.js        # Product filtering
│   │       ├── pagination.js     # Pagination logic
│   │       ├── pricing.js        # Price display logic
│   │       └── main.js           # Global JS & utilities
│   │
│   ├── pages/                    # Standalone pages
│   │   ├── category.html         # Category overview
│   │   ├── product.html          # Product detail
│   │   ├── contact.html          # Contact form
│   │   └── login.html            # Login page
│   │
│   ├── kraanbakken/              # SEO landing pages
│   │   └── caterpillar/
│   ├── slotenbakken/
│   ├── sectoren/
│   │   └── grondwerkers/
│   ├── kennisbank/
│   │   └── wat-is-een-cw-aansluiting/
│   │
│   └── index.html                # Homepage
│
├── docs/                         # Documentation
│   ├── CLOUDINARY_SETUP.md
│   ├── CMS-FEATURES.md
│   ├── CMS-OVERZICHT.md
│   ├── DEPLOY-CMS-RAILWAY.md
│   └── POSTGRESQL_MIGRATION.md
│
├── .github/workflows/            # GitHub Actions (auto-deploy)
├── .gitignore
└── README.md
```

## 🎯 Core Features

### Frontend (web/)
- **Homepage** met hero, categorieën, "Wat maakt Structon uniek?" sectie
- **Product catalogus** met filtering, zoeken, paginering
- **SEO landing pages** voor categorieën, merken, sectoren
- **B2B functionaliteit**: Prijzen alleen voor ingelogde gebruikers
- **Split button** design voor CTAs en offerte aanvragen

### Backend (cms/)
- **REST API** voor producten, categorieën, merken, sectoren
- **Admin CMS** voor contentbeheer
- **PostgreSQL database** (Railway)
- **Cloudinary** voor afbeeldingen
- **JWT authenticatie**

## 🎨 Design System

### Kleuren
- Primary: `#236773` (petrol)
- Primary Light: `#2C5F6F`
- Primary Dark: `#1E636D`

### Fonts
- Headings: Oswald (bold, uppercase)
- Body: Inter (400, 500, 600, 700)

### Components
- **Split Button**: 2 blokken met 2px gap, 8px border-radius
  - Standaard: `.btn-split`
  - Klein: `.btn-split-sm` (voor product cards)
- **Navigation**: Top bar (donker petrol) + Main nav (wit)
- **Product Cards**: Image, titel, specs, prijs (locked/visible), CTA

## 🚀 Deployment

### Frontend
- **Platform**: GitHub Pages
- **URL**: https://leelars.github.io/Structon/
- **Deploy**: Automatisch bij push naar `main`

### Backend
- **Platform**: Railway
- **Database**: PostgreSQL (Railway)
- **ENV vars**: DATABASE_URL, CLOUDINARY_*, JWT_SECRET

## 📊 SEO Strategy

### URL Structuur
```
/kraanbakken/                    # Hoofdcategorie
/slotenbakken/                   # Categorie
/kraanbakken/caterpillar/        # Machine brand cluster
/sectoren/grondwerkers/          # Sector landing page
/kennisbank/artikel-slug/        # Blog/kennisbank
```

### Target Keywords
- kraanbak kopen
- slotenbak kraan/minigraver
- sorteergrijper cw05/cw10
- sloophamer kraan
- graafbak + merk (caterpillar, kubota, etc.)

## 🗄️ Database Schema

### Core Tables
- `products` - Producten (kraanbakken, grijpers, etc.)
- `categories` - Productcategorieën
- `machine_brands` - Caterpillar, Komatsu, Volvo, etc.
- `product_machine_brands` - Koppeltabel
- `seo_pages` - Landing pages met SEO content
- `blog_posts` - Kennisbank artikelen
- `users` - B2B klanten
- `redirects` - 301 redirects

## 🔧 Development

### Start Backend
```bash
cd cms
npm install
npm run dev
```

### Start Frontend
```bash
cd web
# Open index.html in browser
# Of gebruik live server
```

### Database Migrations
```bash
cd cms
node database/migrate.js
node database/seeds/run.js
```

## ✅ Removed (Cleanup)

### Verwijderde bestanden
- ❌ `web/pages/index.html` (oude template)
- ❌ `web/pages/about.html`
- ❌ `web/pages/opvang.html`
- ❌ `web/pages/locaties.html`
- ❌ `web/pages/team.html`
- ❌ `web/assets/css/main.css` (oude template CSS)
- ❌ `web/assets/css/pages/about.css`
- ❌ `web/assets/js/pages/opvang.js`
- ❌ `web/assets/js/pages/locaties.js`
- ❌ `web/assets/js/pages/team.js`
- ❌ `cms/controllers/` (lege folder)
- ❌ `cms/services/` (lege folder)
- ❌ Alle `.DS_Store` files

### Behouden bestanden
✅ Alle Structon-specifieke code
✅ CMS admin interface
✅ API routes en models
✅ SEO landing pages
✅ Product catalogus
✅ Documentation

---

**Project Status**: Clean & Production Ready 🚀
