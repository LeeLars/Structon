# Product Filtering - CMS ↔ Website

## 🎯 Overzicht

Complete documentatie van de product filtering tussen CMS database en website.

## 📊 Data Flow

```
GEBRUIKER KLIKT IN MENU
    ↓
"Slotenbakken voor kranen van 1t - 2,5t"
    ↓
URL: /category.html?cat=graafbakken&subcat=slotenbakken&tonnage=1t-2-5t
    ↓
FILTERS.JS parseert URL parameters
    ↓
Converteert tonnage naar excavator_weight (kg)
    ↓
API CALL: /api/products?category_slug=graafbakken&subcategory_slug=slotenbakken&excavator_weight=1750
    ↓
BACKEND filtert producten uit database
    ↓
ALLEEN producten die passen bij 1-2.5 ton kranen
    ↓
WEBSITE toont gefilterde producten
```

## 🔧 Tonnage Conversie

### URL Parameter → Excavator Weight

| Tonnage ID | Betekenis | Gewicht (kg) | Logica |
|------------|-----------|--------------|--------|
| `1t-2-5t` | 1 tot 2.5 ton | 1750 | Gemiddelde: (1000 + 2500) / 2 |
| `2-5t-5t` | 2.5 tot 5 ton | 3750 | Gemiddelde: (2500 + 5000) / 2 |
| `5t-10t` | 5 tot 10 ton | 7500 | Gemiddelde: (5000 + 10000) / 2 |
| `10t-15t` | 10 tot 15 ton | 12500 | Gemiddelde: (10000 + 15000) / 2 |
| `15t-25t` | 15 tot 25 ton | 20000 | Gemiddelde: (15000 + 25000) / 2 |
| `25t-plus` | 25+ ton | 25000 | Minimum waarde |

### Conversie Functie

```javascript
function parseTonnageToWeight(tonnageId) {
  // '25t-plus' -> 25000 kg
  if (tonnageId === '25t-plus') {
    return 25000;
  }
  
  // '1t-2-5t' -> 1750 kg (gemiddelde van 1000 en 2500)
  const decimalMatch = tonnageId.match(/(\d+)t-(\d+)-(\d+)t/);
  if (decimalMatch) {
    const minTon = parseInt(decimalMatch[1]);
    const maxTon = parseFloat(`${decimalMatch[2]}.${decimalMatch[3]}`);
    return Math.round((minTon + maxTon) / 2 * 1000);
  }
  
  // '5t-10t' -> 7500 kg (gemiddelde van 5000 en 10000)
  const rangeMatch = tonnageId.match(/(\d+)t-(\d+)t/);
  if (rangeMatch) {
    const minTon = parseInt(rangeMatch[1]);
    const maxTon = parseInt(rangeMatch[2]);
    return Math.round((minTon + maxTon) / 2 * 1000);
  }
  
  return null;
}
```

## 🗄️ Database Schema

### Products Tabel

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY,
    title VARCHAR(255),
    slug VARCHAR(255),
    category_id UUID REFERENCES categories(id),
    subcategory_id UUID REFERENCES subcategories(id),
    brand_id UUID REFERENCES brands(id),
    
    -- FILTERING VELDEN
    excavator_weight_min INTEGER,  -- Minimum kraangewicht in kg
    excavator_weight_max INTEGER,  -- Maximum kraangewicht in kg
    width INTEGER,                 -- Breedte in mm
    volume INTEGER,                -- Inhoud in liters
    weight INTEGER,                -- Gewicht in kg
    attachment_type VARCHAR(50),   -- CW10, CW20, CW30, etc.
    
    -- METADATA
    stock_quantity INTEGER,
    is_active BOOLEAN,
    is_featured BOOLEAN,
    created_at TIMESTAMP
);
```

### Voorbeeld Product

```json
{
  "id": "uuid-here",
  "title": "Slotenbak 1500mm CW30",
  "slug": "slotenbak-1500mm-cw30",
  "category_id": "uuid-graafbakken",
  "subcategory_id": "uuid-slotenbakken",
  "brand_id": "uuid-caterpillar",
  "excavator_weight_min": 1000,
  "excavator_weight_max": 2500,
  "width": 1500,
  "volume": 850,
  "weight": 450,
  "attachment_type": "CW30",
  "stock_quantity": 8,
  "is_active": true
}
```

## 🔍 Backend Filtering

### SQL Query Logic

```sql
SELECT p.*, 
       c.title as category_title, 
       sc.title as subcategory_title,
       b.title as brand_title
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
LEFT JOIN brands b ON p.brand_id = b.id
WHERE p.is_active = true
  AND c.slug = 'graafbakken'                    -- Category filter
  AND sc.slug = 'slotenbakken'                  -- Subcategory filter
  AND p.excavator_weight_min <= 1750            -- Tonnage filter (min)
  AND p.excavator_weight_max >= 1750            -- Tonnage filter (max)
ORDER BY p.created_at DESC;
```

### Filter Parameters

| Parameter | Type | Voorbeeld | SQL Conditie |
|-----------|------|-----------|--------------|
| `category_slug` | string | `graafbakken` | `c.slug = $1` |
| `subcategory_slug` | string | `slotenbakken` | `sc.slug = $1` |
| `excavator_weight` | integer | `1750` | `weight_min <= $1 AND weight_max >= $1` |
| `volume_min` | integer | `500` | `p.volume >= $1` |
| `volume_max` | integer | `1000` | `p.volume <= $1` |
| `width` | integer | `1500` | `p.width = $1` |
| `attachment_type` | string | `CW30` | `p.attachment_type = $1` |
| `search` | string | `sloten` | `p.title ILIKE '%$1%'` |

## 🌐 Frontend Filtering

### URL Parameters

```
/pages/category.html?cat=graafbakken&subcat=slotenbakken&tonnage=1t-2-5t
                     │              │                    │
                     │              │                    └─ Tonnage filter
                     │              └────────────────────── Subcategory filter
                     └───────────────────────────────────── Category filter
```

### Filter State

```javascript
activeFilters = {
  category: 'graafbakken',        // Main category
  subcategory: 'slotenbakken',    // Subcategory
  excavator_weight: 1750,         // Converted from tonnage
  volume_min: null,
  volume_max: null,
  width: [],
  attachment_type: [],
  search: null,
  sort: 'newest'
}
```

### API Request

```javascript
// Frontend builds this request
const filters = {
  category_slug: 'graafbakken',
  subcategory_slug: 'slotenbakken',
  excavator_weight: 1750,
  limit: 20,
  offset: 0
};

// API call
const response = await fetch('/api/products?' + new URLSearchParams(filters));
```

## ✅ Test Scenarios

### Scenario 1: Slotenbakken voor 1-2.5 ton kranen

**Input:**
- Menu klik: "Slotenbakken voor kranen van 1t - 2,5t"
- URL: `?cat=graafbakken&subcat=slotenbakken&tonnage=1t-2-5t`

**Verwacht Resultaat:**
- Alleen slotenbakken met `excavator_weight_min <= 1750` EN `excavator_weight_max >= 1750`
- Producten geschikt voor kranen tussen 1 en 2.5 ton

**Database Query:**
```sql
WHERE category_slug = 'graafbakken'
  AND subcategory_slug = 'slotenbakken'
  AND excavator_weight_min <= 1750
  AND excavator_weight_max >= 1750
```

### Scenario 2: Dieplepelbakken voor 5-10 ton kranen

**Input:**
- Menu klik: "Dieplepelbakken voor kranen van 5t - 10t"
- URL: `?cat=graafbakken&subcat=dieplepelbakken&tonnage=5t-10t`

**Verwacht Resultaat:**
- Alleen dieplepelbakken met `excavator_weight_min <= 7500` EN `excavator_weight_max >= 7500`
- Producten geschikt voor kranen tussen 5 en 10 ton

### Scenario 3: Alle slotenbakken (zonder tonnage filter)

**Input:**
- Menu klik: "Slotenbakken" (titel link)
- URL: `?cat=graafbakken&subcat=slotenbakken`

**Verwacht Resultaat:**
- Alle slotenbakken, ongeacht tonnage
- Geen excavator_weight filter toegepast

## 🐛 Debugging

### Check 1: URL Parameters

```javascript
// In browser console
const params = new URLSearchParams(window.location.search);
console.log('Category:', params.get('cat'));
console.log('Subcategory:', params.get('subcat'));
console.log('Tonnage:', params.get('tonnage'));
```

### Check 2: Filter Conversie

```javascript
// In browser console
import { getActiveFilters } from './filters.js';
console.log('Active Filters:', getActiveFilters());
```

### Check 3: API Request

```javascript
// In browser console (Network tab)
// Check de uitgaande request naar /api/products
// Verify parameters: category_slug, subcategory_slug, excavator_weight
```

### Check 4: Database Query

```sql
-- Direct in database
SELECT title, excavator_weight_min, excavator_weight_max
FROM products p
JOIN subcategories sc ON p.subcategory_id = sc.id
WHERE sc.slug = 'slotenbakken'
  AND p.excavator_weight_min <= 1750
  AND p.excavator_weight_max >= 1750;
```

## 📝 Checklist voor CMS Admin

Bij het toevoegen van een product in de CMS:

- [ ] **Categorie** geselecteerd (bijv. "Graafbakken")
- [ ] **Subcategorie** geselecteerd (bijv. "Slotenbakken")
- [ ] **Merk** geselecteerd (bijv. "Caterpillar")
- [ ] **Excavator Weight Min** ingevuld in kg (bijv. 1000)
- [ ] **Excavator Weight Max** ingevuld in kg (bijv. 2500)
- [ ] **Width** ingevuld in mm (bijv. 1500)
- [ ] **Volume** ingevuld in liters (bijv. 850)
- [ ] **Attachment Type** geselecteerd (bijv. "CW30")
- [ ] **Is Active** aangevinkt
- [ ] Product opslaan

**Resultaat:** Product verschijnt automatisch op website bij juiste filters!

## 🚀 Performance

### Caching
- API responses: 5 minuten cache
- Database queries: Geoptimaliseerd met indexes
- Frontend: Request deduplication

### Indexes
```sql
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_subcategory ON products(subcategory_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_excavator_weight ON products(excavator_weight_min, excavator_weight_max);
CREATE INDEX idx_products_active ON products(is_active);
```

## 📞 Support

**Probleem:** Producten verschijnen niet op website
**Oplossing:**
1. Check of product `is_active = true` in CMS
2. Check of categorie en subcategorie correct zijn
3. Check of `excavator_weight_min` en `excavator_weight_max` ingevuld zijn
4. Clear browser cache en refresh

**Probleem:** Verkeerde producten bij tonnage filter
**Oplossing:**
1. Check `excavator_weight_min` en `excavator_weight_max` in database
2. Verify tonnage conversie in browser console
3. Check API request parameters in Network tab

---

**Versie:** 1.0.0
**Laatst bijgewerkt:** 1 december 2024
