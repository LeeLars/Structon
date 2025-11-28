# Railway CMS Deployment - Stap voor Stap

## 🚀 CMS Deployen op Railway

### Stap 1: Railway Account
1. Ga naar https://railway.app
2. Klik op "Login with GitHub"
3. Autoriseer Railway toegang tot je GitHub

### Stap 2: Nieuw Project Aanmaken
1. Klik op "New Project"
2. Selecteer "Deploy from GitHub repo"
3. Kies de repository: `LeeLars/Structon`
4. Railway detecteert automatisch de configuratie

### Stap 3: PostgreSQL Database Toevoegen
1. In je Railway project, klik op "New"
2. Selecteer "Database" → "PostgreSQL"
3. Railway maakt automatisch een database aan
4. De `DATABASE_URL` wordt automatisch gekoppeld

### Stap 4: Environment Variables Instellen
Ga naar je service → "Variables" tab en voeg toe:

```bash
NODE_ENV=production
PORT=4000
JWT_SECRET=jouw-super-geheime-sleutel-hier-minimaal-32-karakters
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://leelars.github.io
```

**⚠️ BELANGRIJK:** 
- `JWT_SECRET` moet een lange, willekeurige string zijn
- Gebruik een password generator voor veiligheid
- Minimaal 32 karakters aanbevolen

### Stap 5: Database Migreren
Na eerste deployment, run de database migrations:

1. Ga naar je service in Railway
2. Klik op "Settings" → "Deploy Logs"
3. Wacht tot deployment compleet is
4. De migrations draaien automatisch bij eerste start

**Of handmatig via Railway CLI:**
```bash
# Installeer Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Run migrations
railway run npm run migrate
```

### Stap 6: Custom Domain (Optioneel)
1. Ga naar "Settings" → "Domains"
2. Klik op "Generate Domain"
3. Railway geeft je een URL zoals: `structon-cms.up.railway.app`
4. Of voeg je eigen domain toe

### Stap 7: Eerste Admin Account Aanmaken
Na deployment, maak een admin account aan:

```bash
# Via Railway CLI
railway run npm run seed:admin

# Of via API (Postman/curl)
curl -X POST https://jouw-railway-url.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@structon.nl",
    "password": "JouwVeiligWachtwoord123!",
    "name": "Admin"
  }'
```

## ✅ Verificatie

### Test of alles werkt:

**1. Health Check:**
```bash
curl https://jouw-railway-url.up.railway.app/api/health
```

Verwacht:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-11-28T..."
}
```

**2. CMS Dashboard:**
Open in browser:
```
https://jouw-railway-url.up.railway.app/cms/
```

**3. API Test:**
```bash
curl https://jouw-railway-url.up.railway.app/api/products
curl https://jouw-railway-url.up.railway.app/api/categories
```

## 🔄 Automatische Deployments

Na setup deployt Railway automatisch bij elke push naar `main`:

```bash
git add .
git commit -m "Update CMS"
git push origin main
# → Railway deployt automatisch binnen 1-2 minuten
```

## 📊 Railway Dashboard

### Belangrijke Tabs:
- **Deployments**: Deployment geschiedenis en logs
- **Metrics**: CPU, Memory, Network usage
- **Variables**: Environment variables
- **Settings**: Domain, build commands, etc.
- **Logs**: Real-time server logs

### Logs Bekijken:
```bash
# Via CLI
railway logs

# Of in dashboard: Service → "Deployments" → "View Logs"
```

## 🛠️ Troubleshooting

### Deployment Faalt
**Check build logs:**
1. Railway Dashboard → Service → "Deployments"
2. Klik op laatste deployment
3. Bekijk "Build Logs" en "Deploy Logs"

**Veelvoorkomende problemen:**
- ❌ `npm install` faalt → Check `package.json`
- ❌ Database connection error → Check `DATABASE_URL` variable
- ❌ Port binding error → Railway gebruikt automatisch `PORT` variable

### CMS Laadt Niet
**Check:**
1. Is deployment succesvol? (groene vinkje)
2. Zijn alle environment variables ingesteld?
3. Draait PostgreSQL database?
4. Check logs voor errors

**Test handmatig:**
```bash
# Health check
curl https://jouw-url.up.railway.app/api/health

# Als 404: Service draait niet
# Als 500: Server error, check logs
# Als 200: Alles werkt!
```

### Database Problemen
**Reset database:**
```bash
# Via Railway CLI
railway run npm run migrate:reset
railway run npm run seed
```

**Of via Railway Dashboard:**
1. PostgreSQL service → "Data" tab
2. Gebruik Query editor voor handmatige queries

## 💰 Kosten

Railway heeft een gratis tier met:
- ✅ 500 uur compute per maand
- ✅ 1GB RAM
- ✅ Shared CPU
- ✅ PostgreSQL database

**Voor productie:**
- Upgrade naar Pro plan ($5/maand per service)
- Meer resources en betere performance
- Custom domains zonder limiet

## 🔐 Beveiliging

### Checklist:
- ✅ Sterke `JWT_SECRET` (minimaal 32 karakters)
- ✅ Admin wachtwoord wijzigen na eerste login
- ✅ HTTPS enabled (automatisch via Railway)
- ✅ CORS correct ingesteld
- ✅ Environment variables niet in code
- ✅ `.env` in `.gitignore`

## 📚 Meer Info

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Structon Docs**: Zie `/docs/` folder

---

## Quick Start Checklist

- [ ] Railway account aangemaakt
- [ ] GitHub repository gekoppeld
- [ ] PostgreSQL database toegevoegd
- [ ] Environment variables ingesteld
- [ ] Eerste deployment succesvol
- [ ] Database migrations gedraaid
- [ ] Admin account aangemaakt
- [ ] Health check werkt
- [ ] CMS dashboard bereikbaar
- [ ] API endpoints werken
- [ ] Website kan data ophalen

**Geschatte tijd:** 15-20 minuten

---

**Hulp nodig?** Check de Railway logs of vraag hulp in Railway Discord!
