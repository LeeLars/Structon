# Railway Deployment Guide - Structon CMS

## 🚀 CMS Backend Deployment op Railway

### Stap 1: Railway Project Setup

1. Ga naar [railway.app](https://railway.app)
2. Login met GitHub
3. Klik op "New Project"
4. Selecteer "Deploy from GitHub repo"
5. Kies de `Structon` repository

### Stap 2: Environment Variables Instellen

Ga naar je Railway project → Variables en voeg toe:

```env
# Database (automatisch door Railway PostgreSQL)
DATABASE_URL=[Railway zet dit automatisch]

# JWT Secret (genereer een sterke key)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# JWT Expiry
JWT_EXPIRES_IN=7d

# Node Environment
NODE_ENV=production

# Frontend URL (GitHub Pages)
FRONTEND_URL=https://leelars.github.io

# Cloudinary (voor afbeeldingen)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Stap 3: PostgreSQL Database Toevoegen

1. In je Railway project, klik op "New"
2. Selecteer "Database" → "PostgreSQL"
3. Railway maakt automatisch een `DATABASE_URL` variable aan
4. Deze wordt automatisch gekoppeld aan je CMS service

### Stap 4: Build & Deploy Configuratie

Railway detecteert automatisch Node.js, maar we hebben een custom config:

**Start Command:**
```bash
cd cms && npm start
```

**Build Command:**
```bash
cd cms && npm install
```

### Stap 5: Database Migreren

Na eerste deployment, run migrations via Railway CLI of direct in de database:

```bash
# Via Railway CLI
railway run node cms/database/migrate.js

# Of connect direct naar PostgreSQL en run:
psql $DATABASE_URL < cms/database/migrations/001_create_tables.sql
```

### Stap 6: Seed Data (Optioneel)

Om demo data en admin account aan te maken:

```bash
railway run node cms/database/seeds/run.js
```

Dit maakt aan:
- Admin: `admin@structon.nl` / `admin123`
- Test klant: `klant@test.nl` / `klant123`
- Demo categorieën, merken, producten

---

## 🌐 CMS Toegang

### Production URL

Na deployment is de CMS bereikbaar op:

```
https://your-project-name.up.railway.app/cms/
```

**Let op:** Railway geeft je een automatische URL. Je kunt ook een custom domain instellen.

### API Endpoints

```
https://your-project-name.up.railway.app/api/products
https://your-project-name.up.railway.app/api/categories
https://your-project-name.up.railway.app/api/brands
etc.
```

---

## 📝 Checklist na Deployment

- [ ] Database migrations uitgevoerd
- [ ] Seed data toegevoegd (admin account)
- [ ] Environment variables ingesteld
- [ ] CMS bereikbaar op `/cms/`
- [ ] API endpoints werken
- [ ] Login werkt met admin account
- [ ] CORS ingesteld voor GitHub Pages

---

## 🔧 Troubleshooting

### CMS laadt niet

1. Check Railway logs: `railway logs`
2. Controleer of alle environment variables zijn ingesteld
3. Controleer of database migrations zijn uitgevoerd

### CORS Errors

De server is geconfigureerd voor:
- `http://localhost:3000`
- `http://localhost:8080`
- `https://leelars.github.io`

Als je een andere URL gebruikt, update `server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://leelars.github.io',
  'https://your-custom-domain.com' // Voeg toe
];
```

### Database Connection Errors

1. Check of PostgreSQL service draait in Railway
2. Controleer `DATABASE_URL` environment variable
3. Test connection: `railway run psql $DATABASE_URL`

---

## 🔄 Auto-Deploy

Railway is gekoppeld aan je GitHub repo. Elke push naar `main` triggert automatisch een nieuwe deployment:

```bash
git add .
git commit -m "Update CMS"
git push origin main
```

Railway detecteert de push en deployed automatisch! 🚀

---

## 📊 Monitoring

### Railway Dashboard

- **Logs**: Realtime logs van je applicatie
- **Metrics**: CPU, Memory, Network usage
- **Deployments**: Geschiedenis van alle deployments
- **Variables**: Environment variables beheren

### Health Check

Test of de API werkt:

```bash
curl https://your-project-name.up.railway.app/api/health
```

---

## 🔐 Security

### Production Checklist

- [ ] Sterke JWT_SECRET (min. 32 characters)
- [ ] NODE_ENV=production
- [ ] Database backups ingeschakeld
- [ ] HTTPS only (Railway doet dit automatisch)
- [ ] Rate limiting actief
- [ ] CORS correct geconfigureerd

### Admin Wachtwoord Wijzigen

Na eerste deployment, wijzig het admin wachtwoord:

1. Login op CMS
2. Ga naar Gebruikers
3. Bewerk admin account
4. Stel nieuw wachtwoord in

---

## 💾 Database Backups

Railway maakt automatisch backups, maar je kunt ook handmatig:

```bash
# Backup maken
railway run pg_dump $DATABASE_URL > backup.sql

# Restore
railway run psql $DATABASE_URL < backup.sql
```

---

## 📞 Support

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Structon Docs**: Zie andere docs in `/docs/`

---

**Status**: ✅ Production Ready  
**Laatst bijgewerkt**: November 2024
