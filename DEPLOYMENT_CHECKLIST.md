# 🚀 Deployment Checklist - Structon Website

## Pre-Deployment Stappen

### 1. Backend Deployment (CMS)

#### **Install Dependencies**
```bash
cd cms
npm install
```

#### **Run Database Migrations**
```bash
# Run ALL migrations (including new performance indexes)
npm run migrate

# Verify migrations
psql $DATABASE_URL -c "SELECT * FROM pg_indexes WHERE tablename = 'products';"
```

#### **Verify Environment Variables**
```bash
# Check .env file has:
DATABASE_URL=postgresql://...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FRONTEND_URL=https://yourdomain.com
PORT=4000
```

#### **Test Server Locally**
```bash
npm start

# Test endpoints:
curl http://localhost:4000/api/products
curl http://localhost:4000/api/categories
curl http://localhost:4000/api/subcategories
```

### 2. Frontend Deployment

#### **Update API URLs**
Controleer dat `web/assets/js/api/client.js` de juiste API URL heeft:
```javascript
export const API_BASE_URL = 'https://your-api-domain.com/api';
```

#### **Test Service Worker Locally**
```bash
# Serve with a local server (niet file://)
npx http-server web -p 8080

# Open http://localhost:8080
# Check DevTools > Application > Service Workers
```

#### **Verify Resource Caching**
- Open Chrome DevTools > Network
- Refresh pagina 2x
- Check dat CSS/JS/images uit cache komen (size kolom toont "disk cache")

---

## Deployment Steps

### Backend (Railway/Heroku/VPS)

1. **Push naar Git**:
```bash
git push origin main
```

2. **Railway Auto-Deploy** (als geconfigureerd):
   - Railway detecteert changes automatisch
   - Runs `npm install` en `npm start`
   - Check logs voor errors

3. **Manual Deploy**:
```bash
# SSH naar server
ssh user@your-server.com

# Pull latest code
cd /var/www/structon-cms
git pull origin main

# Install deps
npm install

# Run migrations
npm run migrate

# Restart service
pm2 restart structon-cms
```

### Frontend (GitHub Pages/Netlify/Vercel)

#### **GitHub Pages**:
```bash
# Already configured in repository
# Automatic deployment on push to main
```

#### **Netlify**:
```bash
# Build command: (none - static site)
# Publish directory: web
# Environment variables: none needed
```

#### **Vercel**:
```bash
vercel --prod
```

---

## Post-Deployment Verificatie

### ✅ Backend Health Checks

```bash
# 1. API is reachable
curl https://your-api.com/api/products

# 2. Compression is working
curl -H "Accept-Encoding: gzip" -I https://your-api.com/api/products
# Should see: Content-Encoding: gzip

# 3. Caching headers present
curl -I https://your-api.com/api/products
# Should see: Cache-Control: public, max-age=300

# 4. Database indexes active
psql $DATABASE_URL -c "SELECT indexname FROM pg_indexes WHERE tablename = 'products';"
```

### ✅ Frontend Health Checks

```bash
# 1. Service Worker registered
# Open DevTools > Application > Service Workers
# Should show: "Activated and is running"

# 2. Resources cached
# DevTools > Application > Cache Storage
# Should see: structon-v1-static, structon-v1-dynamic

# 3. Fonts loading async
# DevTools > Network > Filter: font
# Check waterfall - should load after CSS

# 4. Images lazy loading
# DevTools > Network > Filter: img
# Scroll page - images load on demand
```

### ✅ Performance Audit

```bash
# Run Lighthouse audit
# Chrome DevTools > Lighthouse
# Select: Performance, Best Practices, SEO
# Mode: Navigation (Cold)
# Device: Mobile + Desktop

# Target Scores:
# Performance: 90+
# Best Practices: 95+
# SEO: 95+
```

---

## Performance Monitoring

### Setup Google Analytics (Optional)

```html
<!-- Add to <head> in index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Core Web Vitals Monitoring

Google Analytics > Reports > Engagement > Pages and screens
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1

---

## Rollback Procedure

### Backend Rollback

```bash
# SSH to server
ssh user@your-server.com

# Checkout previous commit
cd /var/www/structon-cms
git log --oneline -5  # Find previous commit
git checkout <previous-commit-hash>

# Restart
pm2 restart structon-cms
```

### Frontend Rollback

```bash
# Revert commit locally
git revert HEAD
git push origin main

# Or rollback in Netlify/Vercel dashboard
```

### Database Rollback (if needed)

```sql
-- Drop new indexes (if causing issues)
DROP INDEX IF EXISTS idx_products_title_search;
DROP INDEX IF EXISTS idx_products_description_search;
-- etc.
```

---

## Troubleshooting

### Issue: Service Worker not updating

**Solution**:
```javascript
// In browser console:
navigator.serviceWorker.getRegistrations().then(r => r[0].unregister());
location.reload();
```

### Issue: API responses not compressed

**Solution**:
```bash
# Check compression package installed
cd cms
npm list compression

# Restart server
pm2 restart structon-cms
```

### Issue: Database queries slow

**Solution**:
```sql
-- Check if indexes exist
SELECT * FROM pg_indexes WHERE tablename = 'products';

-- Re-run migration
npm run migrate

-- Analyze tables
ANALYZE products;
ANALYZE categories;
```

### Issue: Cache not clearing

**Solution**:
```javascript
// Backend - clear API cache
import { clearCache } from './middleware/cache.js';
clearCache();

// Frontend - clear browser cache
// DevTools > Application > Clear storage > Clear site data
```

---

## Maintenance Schedule

### Daily
- ✅ Check server logs voor errors
- ✅ Monitor response times (< 200ms avg)

### Weekly
- ✅ Review Lighthouse scores
- ✅ Check cache hit rates
- ✅ Monitor database query performance

### Monthly
- ✅ Update dependencies (`npm outdated`)
- ✅ Review and optimize slow queries
- ✅ Clean up old cache entries
- ✅ Database VACUUM ANALYZE

---

## Support Contacts

**Development**: Lars Leenders
**Hosting**: Railway/Netlify
**Database**: PostgreSQL on Railway

Voor vragen: Check PERFORMANCE_OPTIMIZATION.md voor details
