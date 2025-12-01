# API Integratie Documentatie - Structon CMS ↔ Website

## 📋 Overzicht

Deze documentatie beschrijft de complete integratie tussen de Structon CMS en de publieke website. Alle data stroomt bidirectioneel tussen beide systemen.

## 🔄 Data Flow

```
┌─────────────────┐         API          ┌─────────────────┐
│                 │ ◄──────────────────► │                 │
│   CMS Admin     │                      │    Website      │
│   (Railway)     │                      │  (GitHub Pages) │
│                 │                      │                 │
└─────────────────┘                      └─────────────────┘
        │                                         │
        │                                         │
        ▼                                         ▼
  PostgreSQL DB                            API Client
  - Products                               - Caching
  - Categories                             - Error handling
  - Brands                                 - Fallback data
  - Quotes
  - Orders
```

## 🌐 API Endpoints

### Base URL
- **Development**: `http://localhost:4000/api`
- **Production**: `https://structon-production.up.railway.app/api`

### Public Endpoints (Geen authenticatie vereist)

#### Products
```javascript
GET  /api/products              // Alle producten
GET  /api/products/:id          // Enkel product (UUID of slug)
GET  /api/products/featured     // Uitgelichte producten
GET  /api/products/filters      // Filter opties
```

#### Categories
```javascript
GET  /api/categories            // Alle categorieën
GET  /api/categories/:slug      // Categorie details
```

#### Brands
```javascript
GET  /api/brands                // Alle merken
GET  /api/brands/:slug          // Merk details
```

#### Quotes (Offerte aanvragen)
```javascript
POST /api/quotes                // Nieuwe offerte aanvraag
```

**Request Body:**
```json
{
  "product_id": "uuid",           // Optioneel
  "product_name": "string",       // Optioneel
  "customer_name": "string",      // Verplicht
  "customer_email": "string",     // Verplicht
  "customer_phone": "string",     // Optioneel
  "message": "string"             // Optioneel
}
```

**Response:**
```json
{
  "success": true,
  "message": "Offerte aanvraag ontvangen",
  "quote_id": 123,
  "created_at": "2024-01-01T12:00:00Z"
}
```

### Protected Endpoints (Admin authenticatie vereist)

#### Quotes Management
```javascript
GET    /api/quotes              // Alle offertes (admin)
PUT    /api/quotes/:id          // Update offerte status
DELETE /api/quotes/:id          // Verwijder offerte
```

#### Products Management
```javascript
POST   /api/admin/products      // Nieuw product
PUT    /api/admin/products/:id  // Update product
DELETE /api/admin/products/:id  // Verwijder product
```

## 💻 Website API Client

### Gebruik

```javascript
import { products, categories, brands, quotes } from './api/client.js';

// Producten ophalen
const data = await products.getAll({ category: 'graafbakken', limit: 12 });

// Offerte aanvragen
const result = await quotes.submit({
  customer_name: 'Jan Jansen',
  customer_email: 'jan@example.com',
  product_id: 'uuid-here',
  message: 'Ik wil graag een offerte'
});
```

### Features

✅ **Automatische caching** (5 minuten)
✅ **Request deduplication** (voorkomt dubbele calls)
✅ **Error handling** met fallback data
✅ **Timeout protection** (10 seconden)
✅ **User-friendly error messages**

## 🎯 CMS → Website Data Flow

### 1. Product wordt toegevoegd in CMS
```
Admin voegt product toe
    ↓
Opgeslagen in PostgreSQL
    ↓
Direct beschikbaar via API
    ↓
Website haalt data op
    ↓
Cached voor 5 minuten
    ↓
Getoond aan bezoekers
```

### 2. Category/Brand wordt gewijzigd
```
Admin wijzigt categorie
    ↓
Database update
    ↓
Cache wordt gecleared
    ↓
Website haalt nieuwe data op
    ↓
Menu's worden bijgewerkt
```

## 📨 Website → CMS Data Flow

### Offerte Aanvraag

```
Bezoeker vult formulier in
    ↓
JavaScript valideert input
    ↓
POST naar /api/quotes
    ↓
Server valideert & opslaat
    ↓
Bevestiging naar gebruiker
    ↓
Admin ziet aanvraag in CMS
```

**Validatie regels:**
- Naam: verplicht
- Email: verplicht + format check
- Telefoon: optioneel
- Product: optioneel (kan algemene aanvraag zijn)

## 🔒 Authenticatie

### JWT Tokens
- Opgeslagen in HTTP-only cookies
- Automatisch meegestuurd bij requests
- 24 uur geldig
- Refresh bij elke request

### CORS
Toegestane origins:
- `http://localhost:3000`
- `http://localhost:8080`
- `https://leelars.github.io`
- `https://structon-production.up.railway.app`

## 🚀 Performance Optimalisatie

### Caching Strategie

| Endpoint | Cache Duur | CDN Cache |
|----------|-----------|-----------|
| Products | 5 min | 10 min |
| Categories | 5 min | 10 min |
| Brands | 5 min | 10 min |
| Quotes | No cache | No cache |

### Compression
- Gzip compression actief
- Threshold: 1KB
- Level: 6 (balanced)

### Database Indexen
```sql
-- Performance indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_created_at ON quotes(created_at);
```

## 🛠️ Troubleshooting

### Website kan geen data ophalen

**Symptomen:**
- Lege product lijsten
- Error toast: "Kan geen verbinding maken met CMS"

**Oplossingen:**
1. Check of Railway server draait
2. Controleer CORS instellingen
3. Bekijk browser console voor errors
4. Test API direct: `https://structon-production.up.railway.app/api/products`

### Offerte aanvraag komt niet aan

**Checklist:**
1. ✅ Formulier validatie geslaagd?
2. ✅ Network tab: POST request succesvol (201)?
3. ✅ CMS database: quote aanwezig in `quotes` tabel?
4. ✅ Server logs: geen errors?

### Cache problemen

**Symptomen:**
- Oude data blijft zichtbaar na CMS update

**Oplossingen:**
```javascript
// Clear cache programmatisch
import { clearApiCache } from './api/client.js';
clearApiCache('products'); // Clear product cache
clearApiCache();           // Clear all cache
```

Of hard refresh: `Cmd + Shift + R` (Mac) / `Ctrl + Shift + R` (Windows)

## 📊 Monitoring

### Server Health Check
```bash
curl https://structon-production.up.railway.app/api/ping
```

### Database Connection
```bash
curl https://structon-production.up.railway.app/api/health
```

### API Response Times
- Products: < 200ms
- Categories: < 100ms
- Quotes POST: < 300ms

## 🔄 Keep-Alive Mechanisme

Railway servers gaan in "sleep mode" na inactiviteit. Om dit te voorkomen:

```javascript
// Automatisch ping elke 4 minuten
keepAlive.start();
```

Dit gebeurt automatisch in de CMS, maar niet op de publieke website (om resources te sparen).

## 📝 Best Practices

### Voor Developers

1. **Altijd error handling**
   ```javascript
   try {
     const data = await products.getAll();
   } catch (error) {
     console.error('Failed to load products:', error);
     // Show fallback UI
   }
   ```

2. **Gebruik caching**
   - GET requests worden automatisch gecached
   - POST/PUT/DELETE clearen relevante cache

3. **Valideer input**
   - Client-side validatie voor UX
   - Server-side validatie voor security

4. **Test beide kanten**
   - Test API endpoints direct
   - Test website integratie
   - Test error scenarios

### Voor Content Managers

1. **Product toevoegen:**
   - Vul alle verplichte velden in
   - Upload minimaal 1 afbeelding
   - Kies categorie en merk
   - Klik "Opslaan"
   - Check website na 5 minuten (cache)

2. **Offerte aanvragen bekijken:**
   - CMS → Offertes
   - Filter op status
   - Klik "Bekijken" voor details
   - Update status naar "In behandeling"

## 🎓 Voorbeelden

### Volledige Product Flow

```javascript
// 1. Admin voegt product toe in CMS
POST /api/admin/products
{
  "title": "Slotenbak 1500mm",
  "slug": "slotenbak-1500mm",
  "category_id": "uuid",
  "brand_id": "uuid",
  "price": 1250.00,
  "stock": 5
}

// 2. Website haalt producten op
GET /api/products?category=slotenbakken
Response: { products: [...], total: 12 }

// 3. Bezoeker vraagt offerte aan
POST /api/quotes
{
  "product_id": "uuid",
  "customer_name": "Jan Jansen",
  "customer_email": "jan@example.com"
}

// 4. Admin ziet aanvraag
GET /api/quotes (authenticated)
Response: { quotes: [...], total: 1 }

// 5. Admin update status
PUT /api/quotes/123
{ "status": "quoted" }
```

## 🔐 Security

- ✅ SQL injection protection (parameterized queries)
- ✅ XSS protection (input sanitization)
- ✅ CSRF protection (SameSite cookies)
- ✅ Rate limiting (100 req/15min per IP)
- ✅ HTTPS only in production
- ✅ Environment variables voor secrets

## 📞 Support

Bij problemen:
1. Check deze documentatie
2. Bekijk browser console logs
3. Check Railway logs
4. Test API endpoints direct

---

**Laatst bijgewerkt:** 1 december 2024
**Versie:** 1.0.0
