# CMS Toegang & Deployment Info

## 🔗 CMS URLs

### Productie (Railway)
- **CMS Dashboard**: https://structon-cms.up.railway.app/cms/
- **API Base**: https://structon-cms.up.railway.app/api/
- **Health Check**: https://structon-cms.up.railway.app/api/health

### Lokale Development
- **CMS Dashboard**: http://localhost:4000/cms/
- **API Base**: http://localhost:4000/api/

## 📂 CMS Structuur

```
cms/
├── server.js           # Express server
├── public/             # CMS frontend files
│   ├── index.html     # Dashboard
│   ├── products.html  # Product beheer
│   ├── categories.html
│   ├── brands.html
│   └── assets/        # CSS, JS, images
├── routes/            # API routes
├── models/            # Database models
└── database/          # Database migrations
```

## 🚀 Railway Deployment

### Automatische Deployment
Elke push naar `main` branch triggert automatisch een deployment op Railway.

```bash
git push origin main
# → Railway detecteert wijzigingen in /cms/
# → Bouwt en deployt automatisch
# → Live binnen 1-2 minuten
```

### Railway Configuratie

**Build Command:**
```bash
cd cms && npm install
```

**Start Command:**
```bash
cd cms && npm start
```

**Environment Variables (Railway Dashboard):**
- `NODE_ENV=production`
- `PORT=4000` (automatisch door Railway)
- `DATABASE_URL` (automatisch door Railway PostgreSQL)
- `JWT_SECRET` (handmatig instellen)
- `FRONTEND_URL=https://leelars.github.io`

## 🔐 CMS Login

### Default Admin Account
Na eerste database setup:

```
Email: admin@structon.nl
Password: [Zie .env.example]
```

**⚠️ BELANGRIJK:** Wijzig het wachtwoord direct na eerste login!

## 🛠️ Troubleshooting

### CMS laadt niet
1. Check of Railway service draait:
   ```bash
   curl https://structon-cms.up.railway.app/api/health
   ```

2. Verwachte response:
   ```json
   {
     "status": "ok",
     "timestamp": "2024-..."
   }
   ```

3. Als 404 of 500:
   - Check Railway logs in dashboard
   - Verify environment variables
   - Check database connection

### API werkt niet
1. Test API endpoints:
   ```bash
   curl https://structon-cms.up.railway.app/api/products
   curl https://structon-cms.up.railway.app/api/categories
   ```

2. Check CORS headers:
   ```bash
   curl -I https://structon-cms.up.railway.app/api/products
   # Moet bevatten: Access-Control-Allow-Origin
   ```

### Database problemen
1. Check Railway PostgreSQL service status
2. Verify `DATABASE_URL` environment variable
3. Run migrations opnieuw:
   ```bash
   # Lokaal met Railway DB
   npm run migrate
   ```

## 📱 CMS Toegang via Website

De website heeft een CMS login link in de footer:
- **Icon**: 🔒 (slot icon)
- **Locatie**: Footer rechtsonder
- **Link**: Wijst automatisch naar juiste URL (lokaal of productie)

## 🔄 Updates & Maintenance

### CMS Code Updaten
```bash
# 1. Maak wijzigingen in /cms/
# 2. Test lokaal
npm run dev

# 3. Commit en push
git add cms/
git commit -m "Update CMS feature"
git push origin main

# 4. Railway deployt automatisch
```

### Database Backup
Railway maakt automatisch backups van PostgreSQL database.

**Handmatige backup:**
```bash
# Via Railway CLI
railway db backup

# Of via pg_dump
pg_dump $DATABASE_URL > backup.sql
```

## 📊 Monitoring

### Railway Dashboard
- **URL**: https://railway.app/project/[your-project-id]
- **Metrics**: CPU, Memory, Network
- **Logs**: Real-time server logs
- **Deployments**: Deployment geschiedenis

### Health Check Endpoint
```bash
# Automatische health check
curl https://structon-cms.up.railway.app/api/health

# Response:
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-11-28T13:00:00.000Z"
}
```

## 🆘 Support

### Railway Issues
- **Docs**: https://docs.railway.app
- **Discord**: https://discord.gg/railway
- **Status**: https://status.railway.app

### CMS Issues
- Check `/docs/TROUBLESHOOTING.md`
- Check Railway logs
- Verify environment variables
- Test API endpoints

---

**Laatst geüpdatet:** November 2024
**Railway Project:** Structon CMS
**Database:** PostgreSQL (Railway)
