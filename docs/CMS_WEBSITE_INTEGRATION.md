# CMS ↔ Website Integratie

## 🔗 Hoe Werkt de Connectie?

De **website** (frontend) haalt alle data van de **CMS** (backend) via de REST API.

```
┌─────────────────┐         API Calls          ┌─────────────────┐
│                 │  ────────────────────────>  │                 │
│  WEBSITE        │                             │  CMS BACKEND    │
│  (GitHub Pages) │  <────────────────────────  │  (Railway)      │
│                 │         JSON Data           │                 │
└─────────────────┘                             └─────────────────┘
```

---

## 📊 Wat Wordt Gesynchroniseerd?

### 1. **Producten** ✅

**CMS:** Voeg product toe via `/cms/products.html`
```javascript
{
  title: "Slotenbak 300mm CW10",
  slug: "slotenbak-300mm-cw10",
  category_id: "...",
  brand_id: "...",
  width: 300,
  volume: 80,
  price: 1250.00,
  is_active: true,
  is_featured: true
}
```

**Website:** Product verschijnt automatisch op:
- Homepage (als featured)
- Categoriepagina
- Productpagina (`/pages/product.html?id=slotenbak-300mm-cw10`)
- Zoekresultaten

---

### 2. **Categorieën** ✅

**CMS:** Maak categorie via `/cms/categories.html`
```javascript
{
  title: "Slotenbakken",
  slug: "slotenbakken",
  description: "Smalle bakken voor sloten graven",
  seo_title: "Slotenbak Kopen | Slotenbakken",
  is_active: true
}
```

**Website:** Categorie verschijnt op:
- Navigatie menu
- Categorie overzicht
- Product filters
- SEO landing page (`/slotenbakken/`)

---

### 3. **Merken** ✅

**CMS:** Voeg merk toe via `/cms/brands.html`
```javascript
{
  title: "Caterpillar",
  slug: "caterpillar",
  logo_url: "https://cloudinary.com/...",
  is_active: true
}
```

**Website:** Merk verschijnt op:
- Product filters
- Product detail pagina
- Merk overzicht
- SEO landing page (`/kraanbakken/caterpillar/`)

---

### 4. **Prijzen** ✅

**CMS:** Stel prijs in via `/cms/prices.html`
```javascript
{
  product_id: "...",
  price: 1250.00,
  visible_for_user_id: null, // null = voor iedereen
  valid_from: "2024-01-01",
  valid_until: null // null = onbeperkt
}
```

**Website:** Prijs wordt getoond:
- **Niet ingelogd:** "Login voor prijs"
- **Ingelogd:** "€ 1.250,00"
- Product cards
- Product detail pagina

---

### 5. **Gebruikers** ✅

**CMS:** Maak gebruiker via `/cms/users.html`
```javascript
{
  email: "klant@bedrijf.nl",
  password: "********",
  role: "user", // of "admin"
  is_active: true
}
```

**Website:** Gebruiker kan:
- Inloggen op website
- Prijzen zien
- Offerte aanvragen
- (Fase 2: Bestellen)

---

## 🔄 Real-time Synchronisatie

**Alles wat je in de CMS wijzigt, is DIRECT zichtbaar op de website!**

### Test Flow:

1. **CMS:** Voeg nieuw product toe
   ```
   https://your-railway-url.up.railway.app/cms/products.html
   ```

2. **API:** Product wordt opgeslagen in database
   ```
   POST /api/admin/products
   ```

3. **Website:** Product verschijnt direct
   ```
   https://leelars.github.io/Structon/
   ```

**Geen cache, geen delay - instant updates!** ⚡

---

## 🧪 Test Checklist

### ✅ Producten Synchronisatie

- [ ] Voeg product toe in CMS
- [ ] Refresh website homepage
- [ ] Product verschijnt in featured section (als featured = true)
- [ ] Ga naar categoriepagina
- [ ] Product verschijnt in lijst
- [ ] Klik op product
- [ ] Product detail pagina laadt correct

### ✅ Prijzen Synchronisatie

- [ ] Stel prijs in via CMS
- [ ] **Niet ingelogd:** Zie "Login voor prijs"
- [ ] Login op website
- [ ] **Ingelogd:** Zie correcte prijs
- [ ] Prijs matcht met CMS

### ✅ Categorieën Synchronisatie

- [ ] Maak categorie in CMS
- [ ] Refresh website
- [ ] Categorie verschijnt in navigatie
- [ ] Categorie filter werkt
- [ ] Producten filteren op categorie

### ✅ Status Synchronisatie

- [ ] Zet product op "Inactief" in CMS
- [ ] Product verdwijnt van website
- [ ] Zet product op "Actief"
- [ ] Product verschijnt weer

---

## 🔌 API Endpoints

### Website gebruikt deze endpoints:

**Public (geen login):**
```javascript
GET  /api/products              // Alle producten
GET  /api/products/:slug        // Product detail
GET  /api/products/featured     // Featured producten
GET  /api/categories            // Alle categorieën
GET  /api/brands                // Alle merken
GET  /api/sectors               // Alle sectoren
```

**Protected (login required):**
```javascript
GET  /api/products/:id/price    // Product prijs
POST /api/auth/login            // Inloggen
POST /api/auth/logout           // Uitloggen
GET  /api/auth/me               // Huidige gebruiker
```

**Admin only (CMS):**
```javascript
POST   /api/admin/products      // Product toevoegen
PUT    /api/admin/products/:id  // Product bewerken
DELETE /api/admin/products/:id  // Product verwijderen
// ... etc voor categories, brands, prices, users
```

---

## 🛠️ Configuratie

### CMS API URL

**Lokaal:**
```javascript
http://localhost:4000/api
```

**Productie:**
```javascript
https://structon-cms.up.railway.app/api
```

### Website API Client

**Bestand:** `/web/assets/js/api/client.js`

```javascript
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:4000/api';
  }
  
  // Production
  return 'https://structon-cms.up.railway.app/api';
};
```

**Automatische detectie:**
- Localhost → `http://localhost:4000/api`
- GitHub Pages → `https://structon-cms.up.railway.app/api`

---

## 🔐 Authenticatie Flow

### Niet-ingelogde Bezoeker

```
1. Bezoeker → Website
2. Website → API: GET /api/products
3. API → Producten zonder prijzen
4. Website → Toont "Login voor prijs"
5. Website → Toont "Offerte aanvragen" button
```

### Ingelogde Gebruiker

```
1. Gebruiker → Login
2. Website → API: POST /api/auth/login
3. API → JWT token in cookie
4. Website → API: GET /api/products/:id/price (met cookie)
5. API → Prijs data
6. Website → Toont "€ 1.250,00"
7. Website → Toont "Toevoegen aan offerte" button
```

---

## 📝 Data Flow Voorbeeld

### Scenario: Nieuw Product Toevoegen

**Stap 1: Admin voegt product toe in CMS**
```javascript
// CMS: /cms/products.html
{
  title: "Puinbak 1200mm CW30",
  slug: "puinbak-1200mm-cw30",
  category_id: "uuid-puinbakken",
  price: 3250.00,
  stock_quantity: 5,
  is_active: true,
  is_featured: false
}
```

**Stap 2: CMS slaat op in database**
```sql
INSERT INTO products (title, slug, category_id, ...)
VALUES ('Puinbak 1200mm CW30', 'puinbak-1200mm-cw30', ...);

INSERT INTO product_prices (product_id, price)
VALUES ('new-uuid', 3250.00);
```

**Stap 3: Website haalt data op**
```javascript
// Website: /pages/category.html
const data = await api.products.getAll({
  category_id: 'uuid-puinbakken'
});

// Response:
{
  products: [
    {
      id: "new-uuid",
      title: "Puinbak 1200mm CW30",
      slug: "puinbak-1200mm-cw30",
      category_title: "Puinbakken",
      price_excl_vat: null, // niet ingelogd
      is_active: true
    }
  ]
}
```

**Stap 4: Website rendert product**
```html
<article class="product-card">
  <img src="..." alt="Puinbak 1200mm CW30">
  <h3>Puinbak 1200mm CW30</h3>
  <span class="price-locked">Login voor prijs</span>
  <a href="/contact/?product=puinbak-1200mm-cw30" class="btn">
    Offerte aanvragen
  </a>
</article>
```

**✅ Product is nu live op de website!**

---

## 🚨 Troubleshooting

### Product verschijnt niet op website

**Check:**
1. Is `is_active` = `true` in CMS?
2. Is product opgeslagen (geen errors in CMS)?
3. Refresh website (hard refresh: Cmd+Shift+R)
4. Check browser console voor API errors
5. Test API direct: `https://your-railway-url.up.railway.app/api/products`

### Prijzen worden niet getoond

**Check:**
1. Is gebruiker ingelogd?
2. Is prijs ingesteld in CMS → Prijzen?
3. Is prijs geldig (valid_from/until)?
4. Check browser console voor auth errors

### CORS Errors

**Check:**
1. Is Railway backend online?
2. Is CORS geconfigureerd voor GitHub Pages?
3. Check `server.js` → `allowedOrigins`

---

## 📊 Monitoring

### Check of alles werkt:

**1. Test API Health**
```bash
curl https://structon-cms.up.railway.app/api/health
```

**2. Test Products Endpoint**
```bash
curl https://structon-cms.up.railway.app/api/products
```

**3. Check Website Console**
```javascript
// Open browser console op website
console.log('API Base:', getApiBaseUrl());
// Should show: https://structon-cms.up.railway.app/api
```

---

## ✅ Samenvatting

**Alles wat je in de CMS instelt, verschijnt automatisch op de website:**

| CMS Actie | Website Effect | Real-time |
|-----------|---------------|-----------|
| Product toevoegen | Verschijnt in lijst | ✅ Direct |
| Prijs instellen | Zichtbaar voor ingelogde users | ✅ Direct |
| Product deactiveren | Verdwijnt van website | ✅ Direct |
| Categorie aanmaken | Verschijnt in navigatie | ✅ Direct |
| Merk toevoegen | Beschikbaar in filters | ✅ Direct |
| Gebruiker aanmaken | Kan inloggen op website | ✅ Direct |

**Geen cache, geen delay - alles is instant gesynchroniseerd!** 🚀

---

**Status**: ✅ Volledig Geïntegreerd  
**Laatst bijgewerkt**: November 2024
