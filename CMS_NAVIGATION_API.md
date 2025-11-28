# CMS Navigation API Specificatie

## Overzicht
De frontend haalt de mega menu structuur dynamisch op uit de CMS via een REST API endpoint.

## Endpoint

### GET `/api/navigation/menu-structure`

Retourneert de volledige mega menu structuur voor alle categorieën.

#### Response Format

```json
{
  "data": {
    "graafbakken": [
      {
        "title": "Slotenbakken",
        "slug": "graafbakken/slotenbakken",
        "tonnages": [
          {
            "label": "Slotenbakken voor kranen van 1t - 2,5t",
            "id": "1t-2-5t"
          },
          {
            "label": "Slotenbakken voor kranen van 2,5t - 5t",
            "id": "2-5t-5t"
          },
          {
            "label": "Slotenbakken voor kranen van 5t - 10t",
            "id": "5t-10t"
          }
        ]
      },
      {
        "title": "Dieplepelbakken",
        "slug": "graafbakken/dieplepelbakken",
        "tonnages": [
          {
            "label": "Dieplepelbakken voor kranen van 1t - 2,5t",
            "id": "1t-2-5t"
          }
        ]
      }
    ],
    "sloop-sorteergrijpers": [
      {
        "title": "Sloophamers",
        "slug": "sloop-sorteergrijpers/sloophamers",
        "tonnages": [
          {
            "label": "Sloophamers voor kranen van 1t - 2,5t",
            "id": "1t-2-5t"
          }
        ]
      }
    ],
    "adapters": [],
    "overige": []
  }
}
```

## Data Structuur

### Hoofdcategorieën (keys)
De keys van het object zijn de **category slugs** zoals ze in de URL staan:
- `graafbakken`
- `sloop-sorteergrijpers`
- `adapters`
- `overige`

### Subcategorieën (array items)
Elke hoofdcategorie bevat een array van subcategorieën met:

| Veld | Type | Beschrijving | Voorbeeld |
|------|------|--------------|-----------|
| `title` | string | Weergavenaam van de subcategorie | "Slotenbakken" |
| `slug` | string | Volledige URL path (inclusief hoofdcategorie) | "graafbakken/slotenbakken" |
| `tonnages` | array | Lijst van tonnage varianten (optioneel) | Zie hieronder |

### Tonnages (optioneel)
Elke subcategorie kan een array van tonnages bevatten:

| Veld | Type | Beschrijving | Voorbeeld |
|------|------|--------------|-----------|
| `label` | string | Volledige beschrijvende tekst | "Slotenbakken voor kranen van 1t - 2,5t" |
| `id` | string | URL-vriendelijke identifier | "1t-2-5t" |

## URL Structuur

De frontend genereert de volgende URLs:

### Subcategorie pagina
```
/{slug}/
```
Voorbeeld: `/graafbakken/slotenbakken/`

### Tonnage gefilterde pagina
```
/{slug}/?tonnage={tonnage_id}
```
Voorbeeld: `/graafbakken/slotenbakken/?tonnage=1t-2-5t`

## CMS Implementatie Vereisten

### Database Schema Suggestie

```sql
-- Hoofdcategorieën
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  display_order INT DEFAULT 0
);

-- Subcategorieën
CREATE TABLE subcategories (
  id SERIAL PRIMARY KEY,
  category_id INT REFERENCES categories(id),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  display_order INT DEFAULT 0,
  UNIQUE(category_id, slug)
);

-- Tonnages
CREATE TABLE tonnages (
  id SERIAL PRIMARY KEY,
  subcategory_id INT REFERENCES subcategories(id),
  label VARCHAR(255) NOT NULL,
  tonnage_id VARCHAR(50) NOT NULL,
  display_order INT DEFAULT 0
);
```

### Backend Controller Voorbeeld (Node.js/Express)

```javascript
// GET /api/navigation/menu-structure
router.get('/menu-structure', async (req, res) => {
  try {
    const categories = await db.query(`
      SELECT 
        c.slug as category_slug,
        json_agg(
          json_build_object(
            'title', sc.name,
            'slug', c.slug || '/' || sc.slug,
            'tonnages', (
              SELECT json_agg(
                json_build_object(
                  'label', t.label,
                  'id', t.tonnage_id
                )
                ORDER BY t.display_order
              )
              FROM tonnages t
              WHERE t.subcategory_id = sc.id
            )
          )
          ORDER BY sc.display_order
        ) as subcategories
      FROM categories c
      LEFT JOIN subcategories sc ON sc.category_id = c.id
      GROUP BY c.id, c.slug
      ORDER BY c.display_order
    `);

    // Transform to required format
    const menuStructure = {};
    categories.rows.forEach(row => {
      menuStructure[row.category_slug] = row.subcategories || [];
    });

    res.json({ data: menuStructure });
  } catch (error) {
    console.error('Error fetching menu structure:', error);
    res.status(500).json({ error: 'Failed to fetch menu structure' });
  }
});
```

## Fallback Mechanisme

De frontend heeft een **fallback structuur** ingebouwd. Als de API niet beschikbaar is of een fout retourneert, wordt de hardcoded fallback gebruikt.

Dit betekent:
- De site blijft werken zelfs als de CMS API down is
- Je kunt de API geleidelijk implementeren zonder de site te breken

## Testing

Test de API met:

```bash
curl https://structon-cms.up.railway.app/api/navigation/menu-structure
```

Verwachte response: JSON object met de menu structuur zoals hierboven beschreven.

## Vragen?

Contact de frontend developer voor verdere uitleg of aanpassingen aan de data structuur.
