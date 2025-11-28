# 🔧 Troubleshooting Guide - Structon Website

## Opgeloste Problemen (28 Nov 2025)

### ✅ Footer Sitemap blijft op "Navigatie laden..."
**Oorzaak**: `API_BASE_URL` was niet geëxporteerd in `client.js`
**Oplossing**: Export toegevoegd in `web/assets/js/api/client.js`
**Status**: ✅ Opgelost

### ✅ Featured Products laden niet
**Oorzaak**: API response format mismatch
**Oplossing**: Correcte handling van `{ categories: [...] }` response
**Status**: ✅ Opgelost

---

## 🔍 Diagnostische Checklist

### 1. API Connectiviteit Testen

#### Check Backend Status
```bash
# Test of backend draait
curl https://structon-cms.up.railway.app/api/categories

# Verwacht: JSON response met categories
# Fout: Connection refused / 404 / 500
```

#### Check CORS Headers
```bash
curl -I https://structon-cms.up.railway.app/api/categories

# Verwacht: Access-Control-Allow-Origin header
```

### 2. Frontend Console Errors

Open **Chrome DevTools** (F12) > **Console** tab

#### Veelvoorkomende Errors:

**Error**: `Failed to fetch`
- **Oorzaak**: Backend is offline of CORS issue
- **Oplossing**: Check Railway deployment status

**Error**: `API_BASE_URL is not defined`
- **Oorzaak**: Import issue in modules
- **Oplossing**: Verify export in `client.js`

**Error**: `Cannot read property 'map' of undefined`
- **Oorzaak**: API response format mismatch
- **Oplossing**: Check API endpoint response structure

**Error**: `Swiper is not defined`
- **Oorzaak**: Swiper library niet geladen
- **Oplossing**: Check `<script>` tag in HTML

### 3. Network Tab Analysis

**DevTools** > **Network** tab

#### Check API Calls:
- `/api/categories` - Status 200? ✅
- `/api/products` - Status 200? ✅
- `/api/subcategories` - Status 200? ✅

#### Response Times:
- < 500ms: ✅ Goed
- 500ms - 2s: ⚠️ Acceptabel
- > 2s: 🔴 Probleem (check backend performance)

### 4. Service Worker Issues

**DevTools** > **Application** > **Service Workers**

**Status**: "Activated and is running" ✅

**Problemen**:
- Not registered: Check `sw-register.js` import
- Error: Check `service-worker.js` syntax
- Stale cache: Clear cache in DevTools

---

## 🐛 Veelvoorkomende Problemen & Oplossingen

### Probleem: "Laden..." blijft staan

**Mogelijke oorzaken**:
1. API endpoint bestaat niet
2. CORS blokkering
3. JavaScript error in fetch handler
4. Response format mismatch

**Debug stappen**:
```javascript
// In browser console:
fetch('https://structon-cms.up.railway.app/api/categories')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

**Oplossing**:
- Check Network tab voor exacte error
- Verify API endpoint in backend
- Check response format matches frontend expectation

---

### Probleem: Mega Menu niet zichtbaar

**Mogelijke oorzaken**:
1. CSS niet geladen
2. JavaScript error in `navigation.js`
3. API call faalt
4. Fallback data niet correct

**Debug stappen**:
```javascript
// In console:
document.querySelectorAll('.menu-dropdown').length
// Verwacht: > 0

// Check if navigation initialized:
console.log('Navigation initialized');
```

**Oplossing**:
- Hard refresh (Cmd+Shift+R)
- Check `initNavigation()` is called
- Verify fallback data in `navigation.js`

---

### Probleem: Images laden niet

**Mogelijke oorzaken**:
1. Cloudinary URL incorrect
2. CORS issue met image host
3. Lazy loading issue

**Debug stappen**:
```javascript
// Check image URLs in console:
document.querySelectorAll('img').forEach(img => {
  console.log(img.src, img.complete);
});
```

**Oplossing**:
- Verify Cloudinary credentials in backend
- Check `loading="lazy"` attribute
- Test image URL directly in browser

---

### Probleem: Producten tonen geen prijs

**Verwacht gedrag**: Prijzen alleen zichtbaar voor ingelogde users

**Check login status**:
```javascript
// In console:
localStorage.getItem('token')
// Null = niet ingelogd
// String = ingelogd
```

**Oplossing**:
- Login via `/pages/login.html`
- Check JWT token in localStorage
- Verify `auth.js` is initialized

---

### Probleem: Database queries traag

**Symptomen**:
- API responses > 2 seconden
- "Laden..." blijft lang staan
- Timeout errors

**Oplossing**:
```bash
# Run database migration voor indexes
cd cms
npm run migrate

# Check of indexes bestaan:
psql $DATABASE_URL -c "SELECT indexname FROM pg_indexes WHERE tablename = 'products';"
```

---

### Probleem: Railway deployment faalt

**Error**: `npm ci` failed

**Oplossing**:
```bash
# Lokaal:
cd cms
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
git push origin main
```

**Error**: Build timeout

**Oplossing**:
- Check Railway logs voor specifieke error
- Verify `package.json` scripts
- Check memory limits in Railway settings

---

## 🔄 Cache Problemen

### Browser Cache Legen

**Chrome**:
1. DevTools (F12)
2. Right-click op refresh button
3. "Empty Cache and Hard Reload"

**Of**:
```javascript
// In console:
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key));
  location.reload();
});
```

### Service Worker Cache Legen

```javascript
// In console:
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister());
  location.reload();
});
```

---

## 📊 Performance Monitoring

### Lighthouse Audit

1. DevTools > Lighthouse
2. Select: Performance, Best Practices, SEO
3. Generate Report

**Target Scores**:
- Performance: 90+
- Best Practices: 95+
- SEO: 95+

### Core Web Vitals

**Check in console**:
```javascript
// Largest Contentful Paint
new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1];
  console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
}).observe({entryTypes: ['largest-contentful-paint']});
```

---

## 🆘 Emergency Fixes

### Rollback naar vorige versie

```bash
# Check recent commits
git log --oneline -5

# Rollback
git revert HEAD
git push origin main
```

### Disable Service Worker

```javascript
// In console (emergency only):
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister());
});
```

### Force API Refresh

```javascript
// Clear API cache
import { clearCache } from './middleware/cache.js';
clearCache();
```

---

## 📞 Support Checklist

Voor support, verzamel deze info:

1. **Browser**: Chrome/Firefox/Safari + versie
2. **Console errors**: Screenshot van Console tab
3. **Network errors**: Screenshot van Network tab
4. **URL**: Exacte pagina waar probleem optreedt
5. **Steps to reproduce**: Wat deed je toen het fout ging?
6. **Expected vs Actual**: Wat verwachtte je vs wat gebeurde er?

---

## 🔗 Nuttige Links

- **Railway Dashboard**: https://railway.app/
- **GitHub Repository**: https://github.com/LeeLars/Structon
- **Live Site**: https://leelars.github.io/Structon/
- **CMS Backend**: https://structon-cms.up.railway.app/cms/

---

## 📝 Maintenance Taken

### Dagelijks
- [ ] Check Railway logs voor errors
- [ ] Monitor response times (< 500ms)

### Wekelijks
- [ ] Run Lighthouse audit
- [ ] Check database query performance
- [ ] Review error logs

### Maandelijks
- [ ] Update dependencies (`npm outdated`)
- [ ] Database VACUUM ANALYZE
- [ ] Review and optimize slow queries
- [ ] Clear old cache entries
