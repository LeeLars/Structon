# Deploy CMS naar Railway

1. Maak een nieuw project aan op Railway.
2. Koppel de GitHub repository.
3. Stel environment variables in:
   - `DATABASE_URL`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Railway detecteert `cms/package.json` en `cms/server.js` als Node-app.
5. Zorg dat het startscript in `cms/package.json` naar `server.js` verwijst.

De frontend in `/web` kan via GitHub Pages, Netlify of een andere static host.
