/**
 * All Products Page
 * Displays all available products with filters
 * Also handles single product detail view when ?id= parameter is present
 */

import { products, categories, subcategories, brands } from '../api/client.js';
import { createProductCardHorizontal, createProductCard, createIndustryProductCard, showLoading, showError, showNoResults, escapeHtml } from '../main.js';
import { initFilters, getActiveFilters } from '../filters.js';
import { initPagination, updatePagination, getOffset, getItemsPerPage } from '../pagination.js';
import { createExpertBox } from '../components/expert-box.js';

let allProducts = [];
let currentProduct = null;
let currentCategory = null;

// Check if user is logged in
const isLoggedIn = localStorage.getItem('authToken') !== null;

document.addEventListener('DOMContentLoaded', () => {
  initPage();
});

/**
 * Initialize page
 */
async function initPage() {
  // Check if we're viewing a single product
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  const categoryParam = params.get('cat');
  
  if (productId) {
    // Show single product detail view
    await loadSingleProduct(productId);
  } else {
    // Show products list
    await initFilters(handleFilterChange);
    
    // Load subcategories only if viewing a main category (not a subcategory)
    if (categoryParam) {
      // Check if categoryParam is a main category or subcategory
      const subcategoriesData = await subcategories.getAll();
      const isSubcategory = subcategoriesData?.subcategories?.some(sub => sub.slug === categoryParam);
      
      if (!isSubcategory) {
        // It's a main category - load its subcategories
        await loadSubcategories(categoryParam);
      } else {
        // It's a subcategory - update page title
        const subcat = subcategoriesData.subcategories.find(s => s.slug === categoryParam);
        if (subcat) {
          const pageTitle = document.querySelector('.page-title');
          const pageSubtitle = document.querySelector('.page-subtitle');
          if (pageTitle) pageTitle.textContent = subcat.title.toUpperCase();
          if (pageSubtitle) {
            const description = SUBCATEGORY_DESCRIPTIONS[categoryParam] || 
              `Bekijk ons assortiment ${subcat.title.toLowerCase()}`;
            pageSubtitle.textContent = description;
          }
        }
      }
    }
    
    await loadProducts();
  }
}

/**
 * Load and display subcategories for a main category
 */
async function loadSubcategories(categorySlug) {
  const section = document.getElementById('subcategories-section');
  const grid = document.getElementById('subcategories-grid');
  
  if (!section || !grid) return;
  
  try {
    console.log('🔍 Loading subcategories for:', categorySlug);
    
    // Fetch all categories to find the main category
    const categoriesData = await categories.getAll(true);
    console.log('📦 Categories data:', categoriesData);
    
    if (!categoriesData || !categoriesData.categories) {
      console.log('No categories data available');
      return;
    }
    
    // Find the main category by slug
    const mainCategory = categoriesData.categories.find(cat => 
      cat.slug === categorySlug || cat.title.toLowerCase() === categorySlug.toLowerCase()
    );
    
    if (!mainCategory) {
      console.log('Main category not found:', categorySlug);
      return;
    }
    
    currentCategory = mainCategory;
    console.log('✅ Found main category:', mainCategory.title, 'ID:', mainCategory.id);
    
    // Fetch all subcategories
    const subcategoriesData = await subcategories.getAll();
    console.log('📦 Subcategories data:', subcategoriesData);
    
    if (!subcategoriesData || !subcategoriesData.subcategories) {
      console.log('No subcategories data available');
      section.style.display = 'none';
      return;
    }
    
    // Filter subcategories that belong to this main category
    const categorySubcategories = subcategoriesData.subcategories.filter(subcat => 
      subcat.category_id === mainCategory.id && subcat.is_active
    );
    
    console.log(`📋 Found ${categorySubcategories.length} subcategories for this category`);
    
    if (categorySubcategories.length === 0) {
      section.style.display = 'none';
      return;
    }
    
    // Fetch product counts and first product image for each subcategory
    const subcategoriesWithCounts = await Promise.all(
      categorySubcategories.map(async (subcat) => {
        try {
          const productsData = await products.getAll({ 
            subcategory_id: subcat.id,
            limit: 1 
          });
          
          let firstProductImage = null;
          if (productsData.products && productsData.products.length > 0) {
            const product = productsData.products[0];
            if (product.cloudinary_images && product.cloudinary_images.length > 0) {
              firstProductImage = product.cloudinary_images[0].url;
            }
          }

          return {
            ...subcat,
            product_count: productsData.total || 0,
            first_product_image: firstProductImage
          };
        } catch (error) {
          console.error(`Error fetching products for subcategory ${subcat.slug}:`, error);
          return {
            ...subcat,
            product_count: 0,
            first_product_image: null
          };
        }
      })
    );
    
    // Filter out subcategories with no products
    const subcategoriesWithProducts = subcategoriesWithCounts.filter(subcat => 
      subcat.product_count > 0
    );
    
    console.log(`📋 Found ${subcategoriesWithProducts.length} subcategories with products`);
    
    if (subcategoriesWithProducts.length === 0) {
      section.style.display = 'none';
      return;
    }
    
    // Update page title and description
    const pageTitle = document.querySelector('.page-title');
    const pageSubtitle = document.querySelector('.page-subtitle');
    if (pageTitle) pageTitle.textContent = mainCategory.title.toUpperCase();
    if (pageSubtitle && mainCategory.description) {
      pageSubtitle.textContent = mainCategory.description;
    }
    
    // Render subcategories
    grid.innerHTML = subcategoriesWithProducts.map(subcat => createSubcategoryCard(subcat)).join('');
    section.style.display = 'block';
    
  } catch (error) {
    console.error('Error loading subcategories:', error);
    section.style.display = 'none';
  }
}

/**
 * Create subcategory card HTML
 */
function createSubcategoryCard(subcategory) {
  // Use first product image as primary source, then category image, then fallback
  const imageUrl = subcategory.first_product_image || 
    subcategory.image_url || 
    subcategory.cloudinary_image?.url || 
    'https://res.cloudinary.com/dchrgzyb4/image/upload/v1768988292/graafbak-hero_apbtll.png';
  
  const productCount = subcategory.product_count || 0;
  // If we are already on the products page with ?cat=, clicking a subcategory should filter by that subcategory
  // But currently the URL structure is ?cat=subcategory-slug for main categories.
  // The subcategory filter should probably just set the filter in the sidebar or navigate to filtered view.
  // Since this is a simple page, let's make it link to the same page but with extra filter? 
  // Wait, the user request implied "viewing a main category". 
  // If I click "Slotenbakken" while inside "Graafbakken", it usually filters the list below.
  // For now, let's keep it simple: ?cat=subcategory-slug (if that works) or implement click handler.
  // Based on previous code: const categoryUrl = `?cat=${subcategory.slug}`;
  // This seems to assume subcategories can be treated as main categories in the URL or the logic handles it.
  // Let's stick to the existing URL logic.
  const categoryUrl = `?cat=${subcategory.slug}`;
  
  return `
    <a href="${categoryUrl}" class="subcategory-card">
      <div class="subcategory-image">
        <img src="${imageUrl}" alt="${escapeHtml(subcategory.title)}">
      </div>
      <div class="subcategory-overlay"></div>
      <div class="subcategory-content">
        <h3>${escapeHtml(subcategory.title)}</h3>
        <div class="subcategory-count">
          ${productCount} ${productCount === 1 ? 'product' : 'producten'}
        </div>
      </div>
    </a>
  `;
}

/**
 * Unique category descriptions
 */
const CATEGORY_DESCRIPTIONS = {
  'graafbakken': 'Professionele graafbakken voor alle grondwerkzaamheden. Van standaard graafwerk tot gespecialiseerde toepassingen zoals drainage, rioleringen en funderingen. Onze graafbakken zijn vervaardigd uit hoogwaardig Hardox staal voor maximale slijtvastheid en een lange levensduur. Verkrijgbaar in diverse breedtes en voor alle tonnageklassen, van minigraver tot zware graafmachine.',
  'sloop-sorteergrijpers': 'Robuuste sloop- en sorteergrijpers voor afbraak, recycling en materiaalverwerking. Speciaal ontworpen voor het efficiënt sorteren van puin, hout, metaal en andere bouwmaterialen. Onze grijpers combineren krachtige hydrauliek met precisie voor optimale productiviteit op recyclingparken, sloopwerven en overslaglocaties.',
  'adapters': 'Snelwissels, adapterplaten en rotators voor flexibel machinegebruik. Wissel moeiteloos tussen verschillende aanbouwdelen zonder gereedschap. Onze adaptersystemen zijn compatibel met alle gangbare merken en verhogen de veelzijdigheid van uw graafmachine aanzienlijk. Verkrijgbaar in mechanische en hydraulische uitvoeringen.',
  'overige': 'Gespecialiseerde aanbouwdelen voor specifieke toepassingen. Van hydraulische hamers voor breekwerk tot egaliseerbalken voor afwerking. Ons assortiment aanvullende aanbouwdelen maakt uw graafmachine geschikt voor vrijwel elke klus in de grond-, weg- en waterbouw.'
};

/**
 * Unique subcategory descriptions
 */
const SUBCATEGORY_DESCRIPTIONS = {
  // Graafbakken subcategorieën
  'slotenbakken': 'Slotenbakken zijn gespecialiseerde smalle graafbakken voor het graven van sleuven en leidingsloten. Perfect voor drainage, kabels, leidingen en funderingen. De smalle constructie (vanaf 200mm) zorgt voor minimale grondverzet en nauwkeurig graafwerk. Standaard voorzien van tanden voor penetratie in harde grond en versterkingen op slijtgevoelige punten.',
  'dieplepelbakken': 'Dieplepelbakken zijn extra diepe graafbakken voor het uitgraven van vijvers, watergangen en diepe funderingen. De verlengde constructie biedt een groter bereik en volume dan standaard graafbakken. Ideaal voor baggerwerk, vijveraanleg en situaties waar u dieper moet graven dan de standaard graafdiepte van uw machine toelaat.',
  'sleuvenbakken': 'Sleuvenbakken combineren smalle breedte met extra diepte voor het graven van diepe, smalle sleuven. Essentieel voor rioleringen, drainage en kabeltrajecten waar minimale grondinname vereist is. De versterkte zijwanden en bodemconstructie garanderen stabiliteit bij diep graafwerk in moeilijke grondsoorten.',
  'kantelbakken': 'Kantelbakken beschikken over een hydraulisch kantelbare bak voor het werken op taluds en in moeilijk bereikbare hoeken. Ideaal voor het afwerken van hellingen, het graven langs muren en het egaliseren van ongelijke terreinen. De hydraulische kantelfunctie biedt tot 45 graden bewegingsvrijheid zonder de machine te verplaatsen.',
  'rioolbakken': 'Rioolbakken zijn speciaal gevormde bakken met afgeronde bodem voor het graven van rioolsleuven. De gebogen bodemvorm komt overeen met de diameter van rioolbuizen en zorgt voor een perfect passend tracé. Verkrijgbaar in verschillende bodemradii passend bij gangbare buisdiameters van 200mm tot 800mm.',
  'trapezium-bakken': 'Trapezium bakken hebben een trapeziumvormig profiel voor het graven van stabiele sleuven met schuine wanden. De schuin aflopende zijkanten voorkomen instorting bij graafwerk in losse grondsoorten. Ideaal voor drainage, watergangen en situaties waar geen beschoeiing mogelijk is. Voldoet aan veiligheidsnormen voor sleufgraafwerk.',
  
  // Sloop- en Sorteergrijpers subcategorieën
  'sorteergrijpers': 'Sorteergrijpers zijn hydraulische grijpers voor het efficiënt sorteren en verplaatsen van bouw- en sloopafval. De krachtige bekken met getande binnenzijde grijpen stevig vast in puin, hout en andere materialen. Perfect voor recyclingparken, overslagstations en sloopwerven waar materiaalscheiding essentieel is voor hergebruik.',
  'sloopgrijpers': 'Sloopgrijpers zijn extra zware grijpers speciaal ontworpen voor afbraakwerk. Voorzien van verstevigde bekken en slijtvaste tanden voor het slopen van beton, metselwerk en andere constructies. De robuuste hydrauliek genereert enorme krachten voor het breken en verwijderen van hardnekkige bouwmaterialen.',
  'puingrijpers': 'Puingrijpers zijn veelzijdige grijpers voor het laden en sorteren van puin en grof materiaal. De brede bekopening en getande binnenzijde zorgen voor optimale grip op losse materialen. Ideaal voor het ruimen van slooppuin, het laden van containers en het sorteren van recyclingmateriaal op bouw- en slooplocaties.',
  
  // Adapters subcategorieën
  'snelwissels': 'Snelwissels maken het mogelijk om binnen seconden van aanbouwdeel te wisselen zonder uit de cabine te stappen. Verkrijgbaar in mechanische en volledig hydraulische uitvoering. Compatibel met alle gangbare CW-koppelingen en S-systemen. Verhoogt de productiviteit en flexibiliteit van uw graafmachine aanzienlijk.',
  'adapterplaten': 'Adapterplaten verbinden aanbouwdelen met verschillende koppelingssystemen aan uw graafmachine. Essentieel wanneer u bakken of grijpers met een ander systeem wilt gebruiken dan de standaardkoppeling van uw machine. Verkrijgbaar voor alle gangbare combinaties van CW, S-systeem en merkspecifieke koppelingen.',
  'rotators': 'Hydraulische rotators maken 360 graden rotatie van aanbouwdelen mogelijk. Ideaal voor sorteergrijpers, kantelbakken en andere aanbouwdelen waar positionering cruciaal is. De continue rotatie verhoogt de efficiëntie bij laden, sorteren en precisiewerk. Verkrijgbaar in verschillende tonnageklassen met variabele rotatiesnelheid.',
  
  // Overige subcategorieën
  'ripper-tanden': 'Ripper tanden zijn krachtige breektanden voor het openbreken van verhardingen, bevroren grond en rotsachtige bodems. De versterkte constructie en scherpe punt penetreren moeiteloos in harde ondergronden. Onmisbaar voor grondwerk in moeilijke omstandigheden waar standaard graaftanden tekortschieten.',
  'hydraulische-hamers': 'Hydraulische hamers zijn slagkrachtige breekhamers voor het slopen van beton, asfalt en rotsformaties. Aangedreven door de hydrauliek van uw graafmachine leveren ze enorme slagkracht voor efficiënt breekwerk. Verkrijgbaar in verschillende gewichtsklassen passend bij uw machinegrootte, van minigraver tot zware graafmachine.',
  'egaliseerbalken': 'Egaliseerbalken zijn precisie-afwerkingsgereedschap voor het egaliseren en afwerken van terreinen. De brede, vlakke constructie creëert perfecte vlakke oppervlakken voor funderingen, terrassen en sportvelden. Vaak voorzien van verstelbare schoenen voor nauwkeurige hoogte-instelling en laser-compatibiliteit.',
  'verdichtingsplaten': 'Hydraulische verdichtingsplaten voor het verdichten van grond, zand en grind. De trilplaat genereert hoogfrequente trillingen voor optimale verdichting van ophogingen, sleufvullingen en funderingen. Essentieel voor het bereiken van de vereiste draagkracht volgens bouwvoorschriften. Verkrijgbaar in verschillende breedtes en trilfrequenties.'
};

/**
 * Update category header with dynamic title and description
 */
async function updateCategoryHeader() {
  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get('cat');
  const subcategoryParam = params.get('subcat');
  
  const headerSection = document.getElementById('category-header');
  const headerTitle = document.getElementById('category-header-title');
  const headerDescription = document.getElementById('category-header-description');
  
  if (!headerSection || !headerTitle || !headerDescription) return;
  
  // If viewing a specific subcategory via ?subcat=
  if (subcategoryParam && currentCategory) {
    const data = await subcategories.getAll();
    const subcat = data.subcategories?.find(s => s.slug === subcategoryParam);
    if (subcat) {
      headerTitle.textContent = subcat.title.toUpperCase();
      // Use unique description or fallback to generic
      const description = SUBCATEGORY_DESCRIPTIONS[subcategoryParam] || 
        `Ontdek ons assortiment ${subcat.title.toLowerCase()} bij Structon. Professionele ${subcat.title.toLowerCase()} voor alle toepassingen. Scherpe prijzen, snelle levering en deskundig advies.`;
      headerDescription.textContent = description;
      headerSection.style.display = 'block';
      return;
    }
  }
  
  // Check if categoryParam is actually a subcategory (e.g., ?cat=slotenbakken)
  if (categoryParam) {
    // First check if it's a subcategory
    const subcategoriesData = await subcategories.getAll();
    const subcat = subcategoriesData.subcategories?.find(s => s.slug === categoryParam);
    
    if (subcat) {
      // It's a subcategory - show subcategory header
      headerTitle.textContent = subcat.title.toUpperCase();
      const description = SUBCATEGORY_DESCRIPTIONS[categoryParam] || 
        `Ontdek ons assortiment ${subcat.title.toLowerCase()} bij Structon. Professionele ${subcat.title.toLowerCase()} voor alle toepassingen. Scherpe prijzen, snelle levering en deskundig advies.`;
      headerDescription.textContent = description;
      headerSection.style.display = 'block';
      return;
    }
    
    // If not a subcategory, treat as main category
    if (currentCategory) {
      headerTitle.textContent = currentCategory.title.toUpperCase();
      // Use unique description or fallback to generic
      const description = CATEGORY_DESCRIPTIONS[categoryParam] || 
        `Ontdek ons complete assortiment ${currentCategory.title.toLowerCase()} bij Structon. Hoogwaardige ${currentCategory.title.toLowerCase()} voor professioneel gebruik. Scherpe prijzen, snelle levering en deskundig advies.`;
      headerDescription.textContent = description;
      headerSection.style.display = 'block';
      return;
    }
  }
  
  // Hide header when viewing all products
  headerSection.style.display = 'none';
}

/**
 * Load products
 */
async function loadProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  showLoading(container);

  try {
    const filters = getActiveFilters();
    filters.limit = getItemsPerPage();
    filters.offset = getOffset();

    console.log('🔍 Loading products with filters:', filters);
    const data = await products.getAll(filters);
    
    console.log('📦 Products API Response:', {
      total: data.total,
      itemsCount: data.items?.length || 0,
      items: data.items
    });
    
    allProducts = data.items || [];
    const total = data.total || allProducts.length;

    // Update count
    document.getElementById('products-count').textContent = total;

    // Update category header
    updateCategoryHeader();

    // Initialize/update pagination
    initPagination(total, handlePageChange);

    // Render products
    renderProducts(allProducts);
  } catch (error) {
    console.error('Error loading products:', error);
    showError(container, 'Kon producten niet laden. Probeer het later opnieuw.');
  }
}

/**
 * Render products with horizontal cards
 */
function renderProducts(productList) {
  const container = document.getElementById('products-grid');
  if (!container) return;

  if (productList.length === 0) {
    showNoResults(container, 'Geen producten gevonden met de huidige filters.');
    return;
  }

  // Use horizontal card layout
  container.className = 'products-list';
  container.innerHTML = productList.map(product => 
    createProductCardHorizontal(product, isLoggedIn)
  ).join('');
}

/**
 * Handle filter change
 */
function handleFilterChange(filters) {
  loadProducts();
}

/**
 * Handle page change
 */
function handlePageChange(page, offset) {
  loadProducts();
}

/**
 * Load single product detail view
 */
async function loadSingleProduct(productId) {
  // Hide filters sidebar and show full width content
  const sidebar = document.getElementById('filters-sidebar');
  const toolbar = document.querySelector('.products-toolbar');
  const pagination = document.getElementById('pagination');
  const container = document.getElementById('products-grid');
  
  if (sidebar) sidebar.style.display = 'none';
  if (toolbar) toolbar.style.display = 'none';
  if (pagination) pagination.style.display = 'none';
  
  // Update page layout for full width
  const layout = document.querySelector('.category-layout');
  if (layout) layout.style.gridTemplateColumns = '1fr';
  
  if (!container) return;
  
  showLoading(container);
  
  try {
    console.log('🔍 Loading product with ID/slug:', productId);
    const data = await products.getById(productId);
    console.log('📦 Product API Response:', data);
    
    currentProduct = data.product;
    
    if (!currentProduct) {
      console.error('❌ Product not found in API response');
      showProductNotFound(container);
      return;
    }
    
    console.log('✅ Product loaded successfully:', currentProduct.title);
    
    // Update page title and breadcrumb
    document.title = `${currentProduct.title} | Structon`;
    
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
      breadcrumb.innerHTML = `
        <a href="../index.html">Home</a>
        <span>/</span>
        <a href="./">Producten</a>
        <span>/</span>
        <span aria-current="page">${escapeHtml(currentProduct.title)}</span>
      `;
    }
    
    // Update hero
    const heroTitle = document.querySelector('.page-title');
    const heroSubtitle = document.querySelector('.page-subtitle');
    if (heroTitle) heroTitle.textContent = currentProduct.title.toUpperCase();
    if (heroSubtitle) heroSubtitle.textContent = currentProduct.category_title || 'Product';

    // Resolve compatible brand titles (for "Geschikt voor merken")
    const compatibleBrandIds = currentProduct?.specs?.compatible_brand_ids;
    if (compatibleBrandIds) {
      try {
        if (compatibleBrandIds === 'all') {
          currentProduct.compatible_brand_titles = 'all';
        } else if (Array.isArray(compatibleBrandIds) && compatibleBrandIds.length > 0) {
          const brandsData = await brands.getAll(false);
          const brandList = brandsData?.brands || [];
          const byId = new Map(brandList.map(b => [b.id, b.title]));
          currentProduct.compatible_brand_titles = compatibleBrandIds
            .map(id => byId.get(id))
            .filter(Boolean);
        }
      } catch (e) {
        console.warn('⚠️ Failed to resolve compatible brand titles:', e);
      }
    }

    // Render product detail
    renderProductDetail(currentProduct, container);
    
  } catch (error) {
    console.error('❌ Error loading product:', error);
    console.error('Product ID/Slug:', productId);
    
    // Check if it's a 404 (product not found)
    if (error.message && (error.message.includes('404') || error.message.includes('not found'))) {
      showProductNotFound(container);
    } else {
      showError(container, 'Kon product niet laden. Probeer het later opnieuw.');
    }
  }
}

/**
 * Show product not found message
 */
function showProductNotFound(container) {
  container.innerHTML = `
    <div class="no-results" style="text-align: center; padding: 60px 20px;">
      <h2 style="margin-bottom: 16px;">Product niet gevonden</h2>
      <p style="margin-bottom: 24px;">Het product dat u zoekt bestaat niet of is niet meer beschikbaar.</p>
      <a href="./" class="btn btn-primary">Bekijk alle producten</a>
    </div>
  `;
}

/**
 * Render product detail view - PRO Version
 */
function renderProductDetail(product, container) {
  // Inject custom styles for the pro layout
  injectProStyles();

  const images = product.cloudinary_images || [];
  const mainImage = images[0]?.url || 'https://via.placeholder.com/600x600?text=Geen+Afbeelding';
  
  // Build specs arrays
  const keySpecs = [];
  if (product.weight) keySpecs.push({ label: 'Gewicht', value: `${product.weight} kg`, icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></svg>' }); // Using heart as placeholder, ideally weight icon
  if (product.width) keySpecs.push({ label: 'Breedte', value: `${product.width} mm`, icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20"/><path d="M5 9v6"/><path d="M19 9v6"/></svg>' });
  if (product.volume) keySpecs.push({ label: 'Inhoud', value: `${product.volume} L`, icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>' });
  if (product.attachment_type) keySpecs.push({ label: 'Ophanging', value: product.attachment_type, icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>' });

  // Fix icons for weight (scale)
  if (keySpecs.find(s => s.label === 'Gewicht')) {
     keySpecs.find(s => s.label === 'Gewicht').icon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18"/><path d="M5 8h14"/><path d="M2 18h20"/></svg>';
  }

  const allSpecs = [];
  if (product.id) allSpecs.push({ label: 'Artikelnummer', value: product.id.substring(0, 8).toUpperCase() });
  if (product.category_title) allSpecs.push({ label: 'Categorie', value: product.category_title });
  if (product.brand_title) allSpecs.push({ label: 'Merk', value: product.brand_title });
  if (product.weight) allSpecs.push({ label: 'Gewicht', value: `${product.weight} kg` });
  if (product.width) allSpecs.push({ label: 'Breedte', value: `${product.width} mm` });
  if (product.volume) allSpecs.push({ label: 'Inhoud (SAE)', value: `${product.volume} liter` });
  if (product.attachment_type) allSpecs.push({ label: 'Ophanging', value: product.attachment_type });
  if (product.excavator_weight_min && product.excavator_weight_max) {
    allSpecs.push({ 
      label: 'Machine klasse', 
      value: `${parseFloat(product.excavator_weight_min).toFixed(1)} - ${parseFloat(product.excavator_weight_max).toFixed(1)} ton` 
    });
  }

  // Quote URL
  const basePath = window.location.pathname.includes('/Structon/') ? '/Structon' : '';
  const quoteParams = new URLSearchParams();
  quoteParams.set('product_id', product.id);
  quoteParams.set('product_name', product.title);
  if (product.category_title) quoteParams.set('product_category', product.category_title);
  const quoteUrl = `${basePath}/offerte-aanvragen/?${quoteParams.toString()}`;

  // Build HTML
  container.innerHTML = `
    <div class="pro-product-page">
      <!-- Breadcrumbs -->
      <nav class="pro-breadcrumbs">
        <a href="./">Home</a>
        <span class="separator">/</span>
        <a href="./">Producten</a>
        ${product.category_title ? `
          <span class="separator">/</span>
          <span class="current">${escapeHtml(product.category_title)}</span>
        ` : ''}
        <span class="separator">/</span>
        <span class="current">${escapeHtml(product.title)}</span>
      </nav>

      <!-- Header Section -->
      <div class="pro-header">
        <h1 class="pro-title">${escapeHtml(product.title)}</h1>
      </div>

      <div class="pro-grid">
        <!-- 1. Gallery Column -->
        <div class="pro-col-gallery">
          <div class="main-image-wrapper">
            <img src="${mainImage}" alt="${escapeHtml(product.title)}" id="main-product-image">
          </div>
          ${images.length > 1 ? `
            <div class="thumbnail-list">
              ${images.map((img, i) => `
                <button class="thumb-btn ${i === 0 ? 'active' : ''}" data-image="${img.url}">
                  <img src="${img.url}" alt="Thumbnail ${i + 1}">
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- 2. Details Column -->
        <div class="pro-col-details">
          <!-- Price Block -->
          <div class="price-block">
            ${isLoggedIn ? `
              <div class="price-row">
                <span class="price-amount">€${product.price_excl_vat || '0.00'}</span>
                <span class="price-suffix">excl. BTW</span>
              </div>
            ` : `
              <div class="price-request">Prijs op aanvraag</div>
            `}
          </div>

          <!-- Key Specs Grid -->
          <div class="key-specs-grid">
            ${keySpecs.map(spec => `
              <div class="key-spec-item">
                <span class="spec-icon">${spec.icon}</span>
                <span class="spec-label">${spec.label}</span>
                <span class="spec-value">${spec.value}</span>
              </div>
            `).join('')}
          </div>

          <!-- Brand Compatibility -->
          ${product.brand_title ? `
            <div class="brand-compatibility">
              <h4 class="compatibility-title">Compatibel met</h4>
              <div class="compatibility-brands">
                <span class="brand-tag">${escapeHtml(product.brand_title)}</span>
              </div>
              <p class="compatibility-note">Deze kraanbak is speciaal ontworpen voor ${escapeHtml(product.brand_title)} machines.</p>
            </div>
          ` : ''}

          <!-- Description Snippet -->
          ${product.description ? `
            <div class="pro-description">
              <p>${escapeHtml(product.description).substring(0, 150)}...</p>
              <a href="#full-specs" class="read-more-link">Bekijk alle specificaties ↓</a>
            </div>
          ` : ''}

          <!-- CTAs -->
          <div class="pro-actions">
            ${isLoggedIn ? `
              <button class="btn-primary btn-lg btn-block icon-btn" onclick="addToCart('${product.id}', '${escapeHtml(product.title)}')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                In Winkelwagen
              </button>
            ` : ''}
            <a href="${quoteUrl}" id="btn-request-quote" class="btn-split btn-split-lg" style="width: 100%; text-decoration: none;">
              <span class="btn-split-text">Offerte Aanvragen</span>
              <span class="btn-split-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </span>
            </a>
          </div>
        </div>

        <!-- 3. Sidebar Column (Expert & Trust) -->
        <div class="pro-col-sidebar">
          <!-- Expert Box -->
          ${createExpertBox()}
        </div>
      </div>

      <!-- Full Specs & Details Section -->
      <div id="full-specs" class="pro-details-section">
        <div class="tabs-header">
          <button class="tab-btn active" data-target="specs">Specificaties</button>
          <button class="tab-btn" data-target="desc">Omschrijving</button>
        </div>
        
        <div id="tab-specs" class="tab-content active">
          <h3 class="specs-title">Technische Specificaties</h3>
          <table class="pro-specs-table">
            <tbody>
              ${allSpecs.map((s, i) => `
                <tr class="${i % 2 === 0 ? 'bg-gray' : ''}">
                  <th>${s.label}</th>
                  <td>${s.value}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div id="tab-desc" class="tab-content" style="display: none;">
          <h3 class="specs-title">Product Omschrijving</h3>
          <div class="pro-description-content">
            <p>${escapeHtml(product.description || 'Geen omschrijving beschikbaar.')}</p>
          </div>
          
          ${(product.compatible_brand_titles || product.brand_title) ? `
          <div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid var(--pro-border);">
            <h3 class="specs-title">Geschikt voor merken</h3>
            <div class="pro-description-content">
              <p style="margin-bottom: 16px;">Deze kraanbak is geschikt voor gebruik met de volgende merken:</p>
              <div style="display: flex; flex-wrap: wrap; gap: 12px;">
                ${(() => {
                  if (product.compatible_brand_titles === 'all') {
                    return `<span style="display: inline-block; background: white; border: 2px solid var(--pro-primary); color: var(--pro-primary); padding: 8px 20px; border-radius: 24px; font-weight: 600; font-size: 1rem;">Alle merken</span>`;
                  }
                  if (Array.isArray(product.compatible_brand_titles) && product.compatible_brand_titles.length > 0) {
                    return product.compatible_brand_titles.map(t => `
                      <span style="display: inline-block; background: white; border: 2px solid var(--pro-primary); color: var(--pro-primary); padding: 8px 20px; border-radius: 24px; font-weight: 600; font-size: 1rem;">
                        ${escapeHtml(t)}
                      </span>
                    `).join('');
                  }
                  if (product.brand_title) {
                    return `<span style="display: inline-block; background: white; border: 2px solid var(--pro-primary); color: var(--pro-primary); padding: 8px 20px; border-radius: 24px; font-weight: 600; font-size: 1rem;">${escapeHtml(product.brand_title)}</span>`;
                  }
                  return '';
                })()}
              </div>
              <p style="margin-top: 16px; color: #64748b; font-size: 0.9rem;">
                <strong>Let op:</strong> Controleer altijd de specificaties van uw machine om te zorgen voor een perfecte pasvorm. Neem bij twijfel contact op met onze specialisten.
              </p>
            </div>
          </div>
          ` : ''}
        </div>
      </div>

      <!-- Featured Products Section -->
      <div class="related-section">
        <h2 class="related-title">Uitgelichte Producten</h2>
        <div id="related-products-grid" class="related-grid">
          <!-- Zal worden gevuld door loadFeaturedProducts -->
          <div style="padding: 20px; text-align: center; color: #94a3b8;">Laden...</div>
        </div>
      </div>
    </div>
  `;
  
  // Setup handlers
  setupThumbnailHandlers();
  setupTabHandlers();
  loadFeaturedProducts(product);
}

/**
 * Setup tab switching handlers
 */
function setupTabHandlers() {
  const tabs = document.querySelectorAll('.tab-btn');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Hide all contents
      document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
      });
      
      // Show target content
      const targetId = `tab-${tab.dataset.target}`;
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.style.display = 'block';
        // Add simple animation
        targetContent.style.opacity = '0';
        setTimeout(() => targetContent.style.opacity = '1', 10);
        targetContent.style.transition = 'opacity 0.3s ease';
      }
    });
  });
}

/**
 * Load featured products
 */
async function loadFeaturedProducts(currentProduct) {
  const container = document.getElementById('related-products-grid');
  if (!container) return;

  try {
    // Fetch featured products
    const filters = {
      is_featured: true,
      limit: 5 // Fetch 5 to have a buffer if we filter out the current one
    };

    const data = await products.getAll(filters);
    let featured = data.items || [];

    // Filter out current product
    featured = featured.filter(p => p.id !== currentProduct.id).slice(0, 4);

    // If no featured products, fall back to same category
    if (featured.length === 0) {
      const categoryFilters = {
        limit: 5
      };
      if (currentProduct.category_id) {
        categoryFilters.category_id = currentProduct.category_id;
      }
      const categoryData = await products.getAll(categoryFilters);
      featured = (categoryData.items || []).filter(p => p.id !== currentProduct.id).slice(0, 4);
    }

    if (featured.length === 0) {
      const section = document.querySelector('.related-section');
      if (section) section.style.display = 'none';
      return;
    }

    // Render using Industry Card style
    container.innerHTML = featured.map(p => createIndustryProductCard(p, isLoggedIn)).join('');
    
  } catch (error) {
    console.error('Error loading featured products:', error);
    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #94a3b8;">Kon uitgelichte producten niet laden.</div>';
  }
}

/**
 * Inject Custom CSS for Pro Product Layout
 */
function injectProStyles() {
  if (document.getElementById('pro-product-styles')) return;

  const style = document.createElement('style');
  style.id = 'pro-product-styles';
  style.textContent = `
    /* Pro Product Layout Variables */
    :root {
      --pro-primary: #236773;
      --pro-bg-light: #f8fafc;
      --pro-border: #e2e8f0;
      --pro-text: #334155;
      --pro-text-dark: #0f172a;
    }

    .pro-product-page {
      font-family: 'Inter', -apple-system, sans-serif;
      max-width: 1400px;
      margin: 0 auto;
      color: var(--pro-text);
      animation: fadeIn 0.3s ease;
    }

    /* Breadcrumbs */
    .pro-breadcrumbs {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 24px;
      font-size: 0.9rem;
      color: #64748b;
    }
    .pro-breadcrumbs a {
      color: #64748b;
      text-decoration: none;
      transition: color 0.2s;
    }
    .pro-breadcrumbs a:hover {
      color: var(--pro-primary);
    }
    .pro-breadcrumbs .separator {
      color: #cbd5e1;
    }
    .pro-breadcrumbs .current {
      color: var(--pro-text-dark);
      font-weight: 500;
    }

    /* Header */
    .pro-header { margin-bottom: 32px; }
    .back-link { display: none; } /* Hidden in favor of breadcrumbs */
    .pro-title { font-size: 2.5rem; font-weight: 800; color: var(--pro-text-dark); margin: 0; line-height: 1.1; letter-spacing: -0.02em; text-transform: uppercase; }

    /* Grid Layout */
    .pro-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr; /* 3 Column Layout - equal flexible columns */
      gap: 24px;
      margin-bottom: 64px;
      max-width: 100%;
      overflow: hidden;
    }

    /* Column 1: Gallery */
    .pro-col-gallery { display: flex; flex-direction: column; gap: 16px; min-width: 0; max-width: 100%; }
    .main-image-wrapper { 
      background: white; border: 1px solid var(--pro-border); border-radius: 12px; padding: 24px; 
      position: relative; width: 100%; height: 500px; display: flex; align-items: center; justify-content: center;
    }
    .main-image-wrapper img { max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; }
    
    .thumbnail-list { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 4px; }
    .thumb-btn { 
      width: 80px; height: 80px; border: 2px solid var(--pro-border); border-radius: 8px; 
      padding: 4px; background: white; cursor: pointer; transition: all 0.2s; flex-shrink: 0;
    }
    .thumb-btn:hover, .thumb-btn.active { border-color: var(--pro-primary); }
    .thumb-btn img { width: 100%; height: 100%; object-fit: contain; }

    /* Column 2: Details */
    .pro-col-details { display: flex; flex-direction: column; gap: 24px; min-width: 0; max-width: 100%; overflow: hidden; }
    .price-block { border-bottom: 1px solid var(--pro-border); padding-bottom: 20px; }
    .price-amount { font-size: 2.2rem; font-weight: 700; color: var(--pro-primary); }
    .price-suffix { font-size: 0.9rem; color: #64748b; margin-left: 4px; }
    .price-request { font-size: 1.5rem; font-weight: 600; color: var(--pro-text-dark); }
    
    .key-specs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; max-width: 100%; }
    .key-spec-item { background: var(--pro-bg-light); padding: 12px; border-radius: 8px; display: flex; flex-direction: column; gap: 2px; min-width: 0; overflow: hidden; }
    .spec-icon { color: var(--pro-primary); display: flex; align-items: center; margin-bottom: 4px; }
    .spec-label { font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
    .spec-value { font-weight: 600; color: var(--pro-text-dark); font-size: 0.95rem; word-break: break-word; overflow-wrap: break-word; }

    .pro-description p { color: #475569; line-height: 1.6; font-size: 0.95rem; margin-bottom: 8px; word-break: break-word; overflow-wrap: break-word; }
    .read-more-link { color: var(--pro-primary); text-decoration: none; font-size: 0.9rem; font-weight: 600; border-bottom: 1px dashed var(--pro-primary); }
    
    /* Brand Compatibility */
    .brand-compatibility { background: var(--pro-bg-light); padding: 20px; border-radius: 12px; border-left: 4px solid var(--pro-primary); }
    .compatibility-title { font-size: 0.85rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
    .compatibility-brands { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
    .brand-tag { display: inline-block; background: white; border: 2px solid var(--pro-primary); color: var(--pro-primary); padding: 6px 16px; border-radius: 20px; font-weight: 600; font-size: 0.9rem; }
    .compatibility-note { font-size: 0.85rem; color: #64748b; margin: 0; line-height: 1.5; }
    
    .pro-actions { display: flex; flex-direction: column; gap: 12px; margin-top: 0; }
    .btn-block { width: 100%; justify-content: flex-start; }
    .icon-btn { display: flex; align-items: center; justify-content: flex-start; gap: 8px; }
    #btn-request-quote { justify-content: flex-start !important; }

    /* Column 3: Sidebar */
    .pro-col-sidebar { display: flex; flex-direction: column; gap: 24px; min-width: 0; max-width: 100%; }
    .expert-box { background: white; border: 1px solid var(--pro-border); border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden; }
    .expert-header { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
    .expert-avatar { width: 48px; height: 48px; background: #e0f2f1; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .expert-info { display: flex; flex-direction: column; }
    .expert-info strong { font-size: 1.1rem; color: var(--pro-text-dark); }
    .expert-info span { font-size: 0.9rem; color: #64748b; }
    .expert-text { font-size: 0.9rem; color: #475569; margin-bottom: 16px; line-height: 1.5; }
    .expert-phone, .expert-email { display: flex; text-decoration: none; color: var(--pro-primary); font-weight: 600; margin-bottom: 8px; align-items: center; gap: 8px; transition: opacity 0.2s; word-break: break-word; overflow-wrap: break-word; }
    .expert-phone:hover, .expert-email:hover { opacity: 0.8; }

    /* Bottom Section */
    .pro-details-section { border-top: 1px solid var(--pro-border); padding-top: 48px; margin-bottom: 64px; }
    .tabs-header { display: flex; gap: 24px; border-bottom: 2px solid var(--pro-border); margin-bottom: 32px; }
    .tab-btn { background: none; border: none; padding: 0 0 16px 0; font-size: 1.1rem; font-weight: 500; color: #64748b; cursor: pointer; position: relative; }
    .tab-btn.active { color: var(--pro-primary); font-weight: 700; }
    .tab-btn.active::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 2px; background: var(--pro-primary); }
    
    .specs-title { margin-bottom: 24px; font-size: 1.5rem; color: var(--pro-text-dark); }
    .pro-specs-table { width: 100%; max-width: 800px; border-collapse: collapse; }
    .pro-specs-table tr { border-bottom: 1px solid var(--pro-border); }
    .pro-specs-table tr.bg-gray { background: #f8fafc; }
    .pro-specs-table th { text-align: left; padding: 12px 16px; color: #64748b; font-weight: 500; width: 40%; }
    .pro-specs-table td { padding: 12px 16px; color: var(--pro-text-dark); font-weight: 600; }
    
    .pro-description-content { max-width: 800px; line-height: 1.8; color: #334155; }

    /* Featured Products */
    .related-section { border-top: 1px solid var(--pro-border); padding-top: 48px; margin-top: 48px; }
    .related-title { font-size: 1.8rem; margin-bottom: 32px; color: var(--pro-text-dark); font-weight: 700; text-transform: uppercase; }
    .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 32px; }

    /* Responsive */
    @media (max-width: 1200px) {
      .pro-grid { grid-template-columns: 1fr 1fr; gap: 20px; }
      .pro-col-sidebar { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    }
    @media (max-width: 768px) {
      .pro-grid { grid-template-columns: 1fr; gap: 24px; }
      .pro-col-sidebar { grid-template-columns: 1fr; }
      .pro-title { font-size: 1.8rem; }
      .key-specs-grid { grid-template-columns: 1fr; }
      .main-image-wrapper { height: 300px; }
      .related-grid { grid-template-columns: 1fr; }
    }
    
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `;
  document.head.appendChild(style);
}

/**
 * Setup thumbnail click handlers for image gallery
 */
function setupThumbnailHandlers() {
  const thumbnails = document.querySelectorAll('.thumb-btn');
  const mainImage = document.getElementById('main-product-image');
  
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      // Update main image
      mainImage.src = thumb.dataset.image;
      
      // Update active state
      thumbnails.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
}
