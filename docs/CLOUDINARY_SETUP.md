# Cloudinary Setup

1. Maak een Cloudinary account.
2. Maak een nieuw environment preset voor dit project.
3. Voeg volgende variabelen toe in Railway en in een lokale `.env` in `/cms`:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. De app gebruikt `config/cloudinary.js` als entrypoint.
