# CMS Overzicht

Dit document beschrijft de globale structuur van het CMS in `/cms`.

- `config/` – database, Cloudinary en env-configuratie
- `database/` – migrations en seed scripts
- `middleware/` – auth, logging, error handling
- `models/` – datamodellen voor dynamische content
- `controllers/` – logica per resource
- `services/` – herbruikbare functionaliteit (vb. image service)
- `routes/` – API- en admin-routes
- `public/` – assets en views voor de admin UI
