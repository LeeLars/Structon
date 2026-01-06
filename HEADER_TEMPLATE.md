# 📋 HEADER TEMPLATE DOCUMENTATIE

## 🎯 Overzicht

De header met mega menu's is een **vaste template** die op alle pagina's gebruikt moet worden. Deze documentatie legt uit hoe je de header correct implementeert op nieuwe pagina's.

## 📦 Header Componenten

De header bestaat uit 3 delen:

### 1. **Top Bar** (donker petrol)
- Login link
- Navigatie links: Over, Dealer worden, Blog, FAQ, Configurator, Contact

### 2. **Main Navigation** (wit met logo)
- Structon logo (links)
- 4 Mega Menu items:
  - Graafbakken (4 subcategorieën, 17 links)
  - Sloop- en sorteergrijpers (4 subcategorieën, 14 links)
  - Adapterstukken (4 subcategorieën, 14 links)
  - Overige (4 subcategorieën, 12 links)
- "Bekijk alles" CTA button (rechts)
- Hamburger menu toggle (mobile)

### 3. **Mobile Navigation**
- Slide-in menu voor mobile devices
- Simplified navigation zonder mega menus

---

## 🔧 Implementatie per Pagina Type

### **Root Level** (`/web/index.html`)
```html
<!-- In <head> -->
<link rel="stylesheet" href="assets/css/components/mega-menu.css">

<!-- In <body>, direct na opening tag -->
<div id="header-placeholder">
  <!-- KOPIEER VOLLEDIGE HEADER HTML HIER -->
  <!-- Zie: /web/index.html regels 162-660 -->
</div>

<!-- Link paths: GEEN prefix -->
<a href="pages/category.html?cat=graafbakken">
```

### **Pages Folder** (`/web/pages/*.html`)
```html
<!-- In <head> -->
<link rel="stylesheet" href="../assets/css/components/mega-menu.css">

<!-- Link paths: ../ prefix -->
<a href="../pages/category.html?cat=graafbakken">
<a href="../pages/contact.html">
```

### **Brand/Industry Pages** (`/web/kraanbakken/[brand]/` of `/web/industrieen/[industry]/`)
```html
<!-- In <head> -->
<link rel="stylesheet" href="../../assets/css/components/mega-menu.css">

<!-- Link paths: ../../ prefix -->
<a href="../../pages/category.html?cat=graafbakken">
<a href="../../pages/contact.html">
```

---

## 📝 Stappen voor Nieuwe Pagina

1. **Kopieer volledige header HTML** van `/web/index.html` (regels 162-660)
2. **Pas link paths aan** op basis van pagina locatie (zie boven)
3. **Voeg CSS link toe** in `<head>`: `mega-menu.css`
4. **Test alle mega menu links** werken correct
5. **Test mobile menu** werkt correct

---

## ⚠️ BELANGRIJK

### **NIET WIJZIGEN zonder toestemming:**
- Header structuur
- Mega menu content
- Mobile navigation
- CSS classes

### **WEL aanpassen per pagina:**
- Link paths (relatieve paden)
- Active state van menu items (optioneel)

---

## 🎨 Styling

**CSS Files nodig:**
- `global.css` - Basis styling
- `components/mega-menu.css` - Mega menu specifieke styling

**Kleuren:**
- Top bar: `#2C5F6F` (donker petrol)
- Main nav: `#ffffff` (wit)
- Mega menu titles: `#2C5F6F` (petrol)
- Hover states: `#1a4f59` (petrol dark)

---

## 🔗 Mega Menu Structuur

Elk mega menu heeft:
- **Header** met titel en "Bekijk alles" link
- **4-kolom grid** met subcategorieën
- **Tonnage/type links** per subcategorie
- **CTA box** onderaan met "Hulp nodig?" bericht

---

## 📊 Totaal Overzicht

- **4 Mega Menus** volledig geïmplementeerd
- **16 Subcategorieën** met gedetailleerde links
- **57+ Product Links** in totaal
- **Responsive** (verbergt op mobile, toont mobile nav)

---

## 🚀 Toekomstige Verbetering

Voor een echt template systeem zou je kunnen overwegen:
- **PHP includes**: `<?php include 'header.php'; ?>`
- **Server-side includes**: `<!--#include virtual="header.html" -->`
- **Build tool**: Gebruik een static site generator
- **JavaScript loader**: Dynamisch laden via fetch (complexer)

Voor nu: **kopieer en pas aan per pagina**.

---

## 📍 Referentie Bestanden

- **Voorbeeld header**: `/web/index.html` (regels 162-660)
- **Mega menu CSS**: `/web/assets/css/components/mega-menu.css`
- **Mobile nav JS**: `/web/assets/js/main.js`

---

**Laatst bijgewerkt:** 6 januari 2026  
**Versie:** 1.0  
**Status:** ✅ Productie-klaar
