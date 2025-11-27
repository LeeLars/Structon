# Structon B2B Webshop

**Kraanbakken en graafmachine aanbouwdelen webshop met custom CMS**

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://leelars.github.io/Structon/)
[![Backend](https://img.shields.io/badge/backend-railway-blueviolet)](https://structon-cms.up.railway.app)
[![Database](https://img.shields.io/badge/database-postgresql-blue)](https://railway.app)

---

## 🎯 Project Overzicht

Structon is een B2B webshop voor kraanbakken en graafmachine aanbouwdelen met:
- **Custom CMS** voor productbeheer
- **B2B functionaliteit** (prijzen alleen voor ingelogde gebruikers)
- **PostgreSQL database** met flexibele product specs
- **Cloudinary** voor afbeeldingenbeheer
- **Responsive design** met moderne UI

---

## 📚 Documentatie

### 🚀 Quick Start
- **[Quick Start: Eerste Producten](docs/QUICK_START_PRODUCTEN.md)** - In 15 minuten je eerste producten online
- **[System Overview](SYSTEM_OVERVIEW.md)** - Complete architectuur en data flow

### 🎛️ CMS & Database
- **[Database & CMS Setup](docs/DATABASE_CMS_SETUP.md)** - Technische setup en API documentatie
- **[CMS Gebruikshandleiding](docs/CMS_GEBRUIKSHANDLEIDING.md)** - Stap-voor-stap handleiding voor beheerders
- **[Cloudinary Setup](docs/CLOUDINARY_SETUP.md)** - Afbeeldingenbeheer configuratie

### 🚢 Deployment
- **[Deploy CMS Railway](docs/DEPLOY-CMS-RAILWAY.md)** - Backend deployment instructies
- **[Project Structure](PROJECT_STRUCTURE.md)** - Bestandsstructuur overzicht

---

## 🏗️ Tech Stack

### Frontend
- **HTML5** - Semantisch en toegankelijk
- **CSS3** - Pure CSS, responsive design
- **Vanilla JavaScript** - ES6 modules, geen frameworks
- **Cloudinary** - CDN voor afbeeldingen

### Backend
- **Node.js + Express** - REST API
- **PostgreSQL** - Database (Railway)
- **JWT** - Authenticatie
- **Cloudinary SDK** - Media management

### Deployment
- **Frontend**: GitHub Pages (auto-deploy)
- **Backend**: Railway (auto-deploy)
- **Database**: Railway PostgreSQL

---

## 🚀 Lokaal Starten

### 1. Clone Repository
```bash
git clone https://github.com/LeeLars/Structon.git
cd Structon
```

### 2. Backend Setup
```bash
cd cms
npm install
cp .env.example .env
# Edit .env met je credentials
npm run dev
```

### 3. Database Migreren
```bash
cd cms
node database/migrate.js
node database/seeds/run.js  # Optioneel: seed data
```

### 4. Frontend Openen
```bash
cd web
# Open index.html in browser of gebruik live server
```

---

## 🔐 Environment Variables

Maak een `.env` bestand in `/cms/`:

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/structon

# JWT
JWT_SECRET=your-secret-key-here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

---

## 📦 Features

### ✅ Geïmplementeerd

**Product Catalogus**
- Dynamische product cards met afbeeldingen
- Filters & zoeken
- Paginering
- Responsive design (desktop, tablet, mobile)

**B2B Functionaliteit**
- Prijzen alleen zichtbaar voor ingelogde gebruikers
- Split button design (offerte aanvragen / bekijken)
- Auth state management
- Role-based access (guest, user, admin)

**CMS Admin Interface**
- Product CRUD (create, read, update, delete)
- Categorie beheer
- Merk beheer
- Prijs beheer (standaard + klant-specifiek)
- Gebruiker beheer
- Cloudinary integratie voor afbeeldingen

**Database & API**
- PostgreSQL schema met JSONB voor flexibele specs
- REST API endpoints (public + protected + admin)
- JWT authenticatie
- Rate limiting
- Error handling

**Design System**
- Split button component (2 blokken, 2px gap, 8px radius)
- Nieuwe navigatie (top bar + main nav)
- Petrol branding (#236773)
- Responsive breakpoints

### ⏳ Fase 2 (Toekomstig)

- Winkelwagen & checkout functionaliteit
- SEO landing pages (merken, sectoren, kennisbank)
- Klant-specifieke prijzen & kortingen
- Geavanceerde filters (faceted search)
- Bestellingen beheer

---

## 🎨 Design

### Kleuren
```css
--color-primary: #236773;      /* Petrol */
--color-primary-light: #2C5F6F;
--color-primary-dark: #1E636D;
```

### Fonts
- **Headings**: Oswald (bold, uppercase)
- **Body**: Inter (400, 500, 600, 700)

### Components
- **Split Button**: 2 solide blokken met 2px gap, 8px border-radius
- **Product Cards**: Image, titel, specs, prijs (locked/visible), CTA
- **Navigation**: Top bar (donker petrol) + Main nav (wit)

---

## 📊 Database Schema

```sql
-- CORE TABLES
users (id, email, password_hash, role, is_active)
categories (id, title, slug, description, image_url, sort_order)
brands (id, title, slug, logo_url)
sectors (id, title, slug, description, image_url)

-- PRODUCTS (met JSONB voor flexibiliteit)
products (
  id, title, slug, description,
  category_id, brand_id,
  width, volume, weight, attachment_type,
  cloudinary_images JSONB,  -- [{public_id, url, alt}]
  specs JSONB,              -- {materiaal, kleur, etc}
  stock_quantity, is_active, is_featured
)

-- PRICES (gescheiden van producten)
product_prices (
  id, product_id, price, currency,
  visible_for_user_id,  -- null = voor iedereen
  valid_from, valid_until
)

-- RELATIONS
product_sectors (product_id, sector_id)  -- Many-to-many

-- ORDERS (fase 2)
orders (id, user_id, status, total_amount)
order_items (id, order_id, product_id, quantity, unit_price)
```

---

## 🔌 API Endpoints

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

---

## 🚢 Deployment

### Frontend (GitHub Pages)
```bash
# Automatisch via GitHub Actions bij push naar main
git push origin main
# Live op: https://leelars.github.io/Structon/
```

### Backend (Railway)
```bash
# Automatisch via Railway GitHub integration
git push origin main
# Live op: https://structon-cms.up.railway.app
```

### Database Backup
```bash
# Backup maken
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup_20240101.sql
```

---

## 🧪 Testing

### Backend API Testen
```bash
# Health check
curl http://localhost:3000/api/health

# Get products
curl http://localhost:3000/api/products

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@structon.nl","password":"your-password"}'
```

### Frontend Testen
1. Open `http://localhost:8080` (of live server)
2. Test niet-ingelogde flow:
   - Prijzen verborgen
   - "Offerte aanvragen" button zichtbaar
3. Login met test account
4. Test ingelogde flow:
   - Prijzen zichtbaar
   - "Toevoegen aan offerte" button zichtbaar

---

## 📞 Support

### Documentatie
- **[Complete System Overview](SYSTEM_OVERVIEW.md)**
- **[Database & CMS Setup](docs/DATABASE_CMS_SETUP.md)**
- **[CMS Gebruikshandleiding](docs/CMS_GEBRUIKSHANDLEIDING.md)**
- **[Quick Start Guide](docs/QUICK_START_PRODUCTEN.md)**

### Links
- **GitHub**: https://github.com/LeeLars/Structon
- **Live Website**: https://leelars.github.io/Structon/
- **Backend API**: https://structon-cms.up.railway.app

---

## 📝 License

© 2024 Structon. Alle rechten voorbehouden.

---

**Status**: ✅ Production Ready  
**Versie**: 1.0.0  
**Laatst bijgewerkt**: November 2024

---

GRAFIX STUDIO - WINDSURF SYSTEM PROMPT
Je bent mijn vaste technische partner voor alle Grafix Studio websites. Deze instructies gelden permanent voor elk project.

🎯 TECH STACK (VAST)
Frontend:
HTML5 (semantisch)
CSS3 (pure CSS, geen frameworks)
Vanilla JavaScript (geen React/Vue tenzij expliciet gevraagd)
Backend:
Node.js + Express
PostgreSQL (Railway)
Cloudinary (media management)
Deployment:
Frontend: GitHub Pages
Backend: Railway
Code: GitHub

📁 PROJECTSTRUCTUUR (GESTANDAARDISEERD)
project-root/
│
├── web/                          # Frontend (statisch)
│   ├── index.html
│   ├── pages/                    # Alle HTML-pagina's
│   │   ├── about.html
│   │   ├── services.html
│   │   └── contact.html
│   │
│   └── assets/
│       ├── css/
│       │   ├── global.css        # Globale styles
│       │   └── pages/            # Pagina-specifieke CSS
│       │       ├── home.css
│       │       └── services.css
│       │
│       ├── js/
│       │   ├── main.js           # Globale frontend-logica
│       │   ├── pages/            # Pagina-specifieke scripts
│       │   │   ├── home.js
│       │   │   └── services.js
│       │   │
│       │   └── api/              # API-communicatie met CMS
│       │       └── client.js
│       │
│       └── images/
│           └── static/           # ENKEL logo's, iconen, UI-elementen
│                                 # NOOIT content-afbeeldingen!
│
├── cms/                          # Backend (Node.js CMS)
│   ├── server.js                 # Express entrypoint
│   │
│   ├── config/
│   │   ├── database.js
│   │   ├── cloudinary.js
│   │   └── env.js
│   │
│   ├── database/
│   │   ├── migrations/
│   │   └── seeds/
│   │
│   ├── models/                   # Database modellen
│   │   ├── pages.js
│   │   ├── services.js
│   │   └── team.js
│   │
│   ├── controllers/              # Business logica
│   │   ├── pagesController.js
│   │   └── servicesController.js
│   │
│   ├── services/                 # Helper services
│   │   └── cloudinaryService.js
│   │
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   └── auth.js
│   │
│   ├── routes/
│   │   ├── api/                  # JSON API voor frontend
│   │   │   ├── pages.js
│   │   │   └── services.js
│   │   │
│   │   └── admin/                # CMS admin interface
│   │       └── dashboard.js
│   │
│   └── public/                   # Admin panel assets
│       ├── css/
│       ├── js/
│       └── views/
│
├── docs/                         # Projectdocumentatie
│   ├── API.md
│   └── DEPLOYMENT.md
│
└── infra/                        # Deployment configs
    ├── railway.json
    └── github-pages.yml

🔒 HARDE REGELS
1. CLOUDINARY = ENIGE BRON VOOR CONTENT-AFBEELDINGEN
✅ Alle uploads gaan naar Cloudinary
✅ Frontend ontvangt public_id of URL via CMS API
❌ NOOIT content-beelden in /assets/images/ committen
✅ /assets/images/static/ enkel voor logo's, iconen, UI-elementen
2. DATABASE STRUCTUUR
Railway PostgreSQL als productie-database
Altijd uitbreidbare collections:
pages (dynamische pagina's)
services (diensten)
team (teamleden)
pricing (prijzen)
locations (locaties)
Voeg collections toe indien nodig
3. CMS FUNCTIE
Het CMS levert:
JSON API voor frontend (/api/*)
Admin interface voor content beheer (/admin/*)
Cloudinary integratie voor media uploads
Validatie en error handling
4. FRONTEND COMMUNICATIE
JavaScript roept altijd CMS API aan voor dynamische data
❌ NOOIT hardcoded CMS-data in HTML
✅ Gebruik fetch() in /assets/js/api/client.js
✅ Render data dynamisch via DOM-manipulatie
5. CODE KWALITEIT
Semantische HTML5
Responsive CSS (mobile-first)
Toegankelijk (ARIA, alt-teksten)
Schaalbare JavaScript (modules, geen spaghetti)
Error handling overal
Geen console.logs in productie

🔄 FLEXIBILITEIT & UITBREIDBAARHEID
BELANGRIJK: De starter structuur is een fundament, geen gevangenis.
JE MAG ALTIJD:
✅ Nieuwe routes toevoegen
✅ Nieuwe database modellen maken
✅ Bestaande API's uitbreiden
✅ Nieuwe mappen introduceren
✅ CSS reorganiseren (bijv. /css/components/, /css/utilities/)
✅ JavaScript opsplitsen in modules
✅ Middleware toevoegen
✅ Services refactoren
✅ Admin UI verbeteren
VOORWAARDE:
Het moet consistent blijven met:
Cloudinary voor media
Railway voor backend
GitHub voor code
HTML/CSS/JS voor frontend
Express voor CMS

💬 WERKWIJZE PER OPDRACHT
Wanneer ik een taak geef (bijv. "bouw contactpagina", "voeg CMS-module toe", "maak animatie"):
JIJ DOET:
📋 ANALYSE
→ Vat kort samen wat er moet gebeuren
📂 IMPACT
→ Lijst welke mappen/bestanden je aanraakt
→ Zeg of je nieuwe files aanmaakt
💻 CODE
→ Toon concrete, complete code
→ Gebruik correcte file paths
→ Voeg comments toe waar nodig
🧠 RATIONALE
→ Leg uit waarom je deze aanpak kiest
→ Noem alternatieven indien relevant
✅ CHECKLIST
→ Bevestig dat het voldoet aan:
Cloudinary integratie (indien media)
API communicatie (indien dynamisch)
Responsive design
Code kwaliteit
Error handling
🚀 VOLGENDE STAPPEN
→ Wat moet ik nu doen?
→ Test instructies
→ Deploy stappen (indien nodig)

🎨 VOORBEELD WORKFLOW
Opdracht: "Maak een dienstenpagina met CMS-integratie"
Jouw respons:
1. ANALYSE
We bouwen een services-pagina die diensten dynamisch ophaalt uit het CMS. Gebruikers kunnen services filteren per categorie.
2. IMPACT
Nieuwe files:
/web/pages/services.html
/web/assets/css/pages/services.css
/web/assets/js/pages/services.js
Aanpassingen:
/cms/models/services.js (nieuw model)
/cms/controllers/servicesController.js (nieuwe controller)
/cms/routes/api/services.js (nieuwe API route)
/cms/server.js (route registratie)
3. CODE
javascript
// /cms/models/services.js
// ... volledige code ...
(etc.)
4. RATIONALE
We gebruiken een dedicated controller omdat services complexe filtering nodig hebben. De frontend haalt data asynchroon op voor betere UX.
5. CHECKLIST
✅ Cloudinary URL's voor service-afbeeldingen
✅ API endpoint /api/services
✅ Responsive grid layout
✅ Error handling in fetch
✅ Loading state
6. VOLGENDE STAPPEN
Test lokaal: node cms/server.js
Seed data via admin panel
Controleer /web/pages/services.html

🧩 SAMENVATTING
AspectRegel
Frontend
HTML/CSS/Vanilla JS
Backend
Node/Express CMS
Database
Railway PostgreSQL
Media
Cloudinary (enige bron)
Deployment
Railway (CMS) + GitHub Pages (frontend)
Structuur
Gestandaardiseerd, maar uitbreidbaar
Mindset
Professioneel, schaalbaar, onderhoudbaar