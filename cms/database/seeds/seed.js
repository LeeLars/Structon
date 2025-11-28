/**
 * Structon Database Seed
 * Creates initial data for development/testing
 */

import { pool } from '../../config/database.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Create admin user
    console.log('👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
    await pool.query(`
      INSERT INTO users (email, password_hash, role)
      VALUES ('admin@structon.nl', $1, 'admin')
      ON CONFLICT (email) DO UPDATE SET password_hash = $1
    `, [adminPassword]);

    // Create test customer
    console.log('👤 Creating test customer...');
    const customerPassword = await bcrypt.hash('klant123', SALT_ROUNDS);
    await pool.query(`
      INSERT INTO users (email, password_hash, role)
      VALUES ('klant@test.nl', $1, 'user')
      ON CONFLICT (email) DO UPDATE SET password_hash = $1
    `, [customerPassword]);

    // Create categories with SEO content
    console.log('📁 Creating categories...');
    const categories = [
      { 
        title: 'Kraanbakken', 
        slug: 'kraanbakken', 
        description: 'Professionele kraanbakken voor alle graafmachines.',
        seo_title: 'Kraanbak Kopen | Graafbakken voor Minigraver & Kraan',
        seo_description: 'Kraanbak kopen? Structon levert graafbakken voor minigravers en graafmachines. CW00 t/m CW40. Belgische productie, Hardox staal.',
        seo_h1: 'Kraanbak Kopen voor Jouw Graafmachine',
        seo_intro: 'Structon produceert hoogwaardige kraanbakken voor minigravers en graafmachines van 0.8 tot 40 ton. Alle CW-aansluitingen beschikbaar.'
      },
      { 
        title: 'Slotenbakken', 
        slug: 'slotenbakken', 
        description: 'Smalle bakken voor het graven van sloten en kabelsleufjes.',
        seo_title: 'Slotenbak Kopen | Slotenbakken voor Minigraver & Kraan',
        seo_description: 'Slotenbak kopen? Structon levert slotenbakken voor minigravers en graafmachines. CW00 t/m CW40. Belgische productie, Hardox staal.',
        seo_h1: 'Slotenbak Kopen voor Jouw Graafmachine',
        seo_intro: 'Een slotenbak is ideaal voor egalisatiewerk, lichte graafwerken en slotenonderhoud. Structon produceert slotenbakken voor minigravers vanaf 1T tot grote rupskranen van 40T.'
      },
      { 
        title: 'Dieplepelbakken', 
        slug: 'dieplepelbakken', 
        description: 'Standaard graafbakken voor algemeen graafwerk.',
        seo_title: 'Dieplepelbak Kopen | Graafbakken voor Kraan',
        seo_description: 'Dieplepelbak kopen? Structon levert dieplepelbakken voor alle graafmachines. Hardox staal, alle CW-aansluitingen.',
        seo_h1: 'Dieplepelbak Kopen',
        seo_intro: 'De dieplepelbak is de standaard graafbak voor algemeen graafwerk. Geschikt voor grondverzet, funderingswerk en bouwprojecten.'
      },
      { 
        title: 'Sorteergrijpers', 
        slug: 'sorteergrijpers', 
        description: 'Sorteergrijpers voor sloop- en sorteerwerk.',
        seo_title: 'Sorteergrijper Kopen | Sloopgrijpers voor Kraan',
        seo_description: 'Sorteergrijper kopen? Structon levert sorteergrijpers en sloopgrijpers voor minigravers en graafmachines. CW05, CW10, CW20.',
        seo_h1: 'Sorteergrijper Kopen voor Sloop & Sorteerwerk',
        seo_intro: 'Sorteergrijpers zijn onmisbaar voor sloopwerk, sorteren en recycling. Geschikt voor het oppakken en verplaatsen van puin, hout en metaal.'
      },
      { 
        title: 'Sloophamers', 
        slug: 'sloophamers', 
        description: 'Hydraulische sloophamers voor afbraakwerk.',
        seo_title: 'Sloophamer Kopen | Hydraulische Sloophamers voor Kraan',
        seo_description: 'Sloophamer kopen? Structon levert hydraulische sloophamers voor minigravers en graafmachines. Krachtig en betrouwbaar.',
        seo_h1: 'Sloophamer Kopen - Hydraulische Breekhamers',
        seo_intro: 'Hydraulische sloophamers voor het breken van beton, asfalt en steen. Geschikt voor sloopwerk, wegenbouw en renovatieprojecten.'
      },
      { 
        title: 'Adapters', 
        slug: 'adapters', 
        description: 'Snelwissels en adapters voor alle merken.',
        seo_title: 'Adapter Kopen | CW Adapters & Snelwissels',
        seo_description: 'CW adapter kopen? Structon levert adapters en snelwissels voor alle CW-aansluitingen. CW05 naar CW10, CW10 naar CW20.',
        seo_h1: 'Adapters & Snelwissels',
        seo_intro: 'Met onze adapters koppel je aanbouwdelen met verschillende CW-aansluitingen aan jouw graafmachine. Universeel inzetbaar.'
      }
    ];

    for (const cat of categories) {
      await pool.query(`
        INSERT INTO categories (title, slug, description, seo_title, seo_description, seo_h1, seo_intro)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (slug) DO UPDATE SET 
          title = $1, description = $3, 
          seo_title = $4, seo_description = $5, seo_h1 = $6, seo_intro = $7
      `, [cat.title, cat.slug, cat.description, cat.seo_title, cat.seo_description, cat.seo_h1, cat.seo_intro]);
    }

    // Create brands
    console.log('🏷️ Creating brands...');
    const brands = [
      { title: 'Caterpillar', slug: 'caterpillar' },
      { title: 'Komatsu', slug: 'komatsu' },
      { title: 'Volvo', slug: 'volvo' },
      { title: 'Hitachi', slug: 'hitachi' },
      { title: 'Liebherr', slug: 'liebherr' },
      { title: 'JCB', slug: 'jcb' },
      { title: 'Takeuchi', slug: 'takeuchi' },
      { title: 'Kubota', slug: 'kubota' }
    ];

    for (const brand of brands) {
      await pool.query(`
        INSERT INTO brands (title, slug)
        VALUES ($1, $2)
        ON CONFLICT (slug) DO NOTHING
      `, [brand.title, brand.slug]);
    }

    // Create sectors
    console.log('🏭 Creating sectors...');
    const sectors = [
      { title: 'Bouw & Infra', slug: 'bouw-infra', description: 'Graafwerkzaamheden, funderingen en wegenbouw.' },
      { title: 'Agrarisch', slug: 'agrarisch', description: 'Sloten graven, drainage en landbewerking.' },
      { title: 'Sloop & Recycling', slug: 'sloop-recycling', description: 'Sloopwerk, sorteren en recycling.' },
      { title: 'Groenvoorziening', slug: 'groenvoorziening', description: 'Tuinaanleg en landschapsinrichting.' }
    ];

    for (const sector of sectors) {
      await pool.query(`
        INSERT INTO sectors (title, slug, description)
        VALUES ($1, $2, $3)
        ON CONFLICT (slug) DO NOTHING
      `, [sector.title, sector.slug, sector.description]);
    }

    // Get category IDs
    const catResult = await pool.query('SELECT id, slug FROM categories');
    const categoryMap = {};
    catResult.rows.forEach(row => categoryMap[row.slug] = row.id);

    // Create subcategories with tonnage ranges
    console.log('📂 Creating subcategories...');
    const subcategories = [
      // Kraanbakken subcategorieën
      { category_slug: 'kraanbakken', title: 'Kraanbakken voor kranen van 1t - 2,5t', slug: '1t-2-5t', tonnage_min: 1.0, tonnage_max: 2.5, sort_order: 1 },
      { category_slug: 'kraanbakken', title: 'Kraanbakken voor kranen van 2,5t - 5t', slug: '2-5t-5t', tonnage_min: 2.5, tonnage_max: 5.0, sort_order: 2 },
      { category_slug: 'kraanbakken', title: 'Kraanbakken voor kranen van 5t - 10t', slug: '5t-10t', tonnage_min: 5.0, tonnage_max: 10.0, sort_order: 3 },
      { category_slug: 'kraanbakken', title: 'Kraanbakken voor kranen van 10t - 15t', slug: '10t-15t', tonnage_min: 10.0, tonnage_max: 15.0, sort_order: 4 },
      { category_slug: 'kraanbakken', title: 'Kraanbakken voor kranen van 15t - 25t', slug: '15t-25t', tonnage_min: 15.0, tonnage_max: 25.0, sort_order: 5 },
      { category_slug: 'kraanbakken', title: 'Kraanbakken voor kranen van 25t+', slug: '25t-plus', tonnage_min: 25.0, tonnage_max: null, sort_order: 6 },
      
      // Slotenbakken subcategorieën
      { category_slug: 'slotenbakken', title: 'Slotenbakken voor kranen van 1t - 2,5t', slug: '1t-2-5t', tonnage_min: 1.0, tonnage_max: 2.5, sort_order: 1 },
      { category_slug: 'slotenbakken', title: 'Slotenbakken voor kranen van 2,5t - 5t', slug: '2-5t-5t', tonnage_min: 2.5, tonnage_max: 5.0, sort_order: 2 },
      { category_slug: 'slotenbakken', title: 'Slotenbakken voor kranen van 5t - 10t', slug: '5t-10t', tonnage_min: 5.0, tonnage_max: 10.0, sort_order: 3 },
      { category_slug: 'slotenbakken', title: 'Slotenbakken voor kranen van 10t - 15t', slug: '10t-15t', tonnage_min: 10.0, tonnage_max: 15.0, sort_order: 4 },
      { category_slug: 'slotenbakken', title: 'Slotenbakken voor kranen van 15t - 25t', slug: '15t-25t', tonnage_min: 15.0, tonnage_max: 25.0, sort_order: 5 },
      
      // Dieplepelbakken subcategorieën
      { category_slug: 'dieplepelbakken', title: 'Dieplepelbakken voor kranen van 1t - 2,5t', slug: '1t-2-5t', tonnage_min: 1.0, tonnage_max: 2.5, sort_order: 1 },
      { category_slug: 'dieplepelbakken', title: 'Dieplepelbakken voor kranen van 2,5t - 5t', slug: '2-5t-5t', tonnage_min: 2.5, tonnage_max: 5.0, sort_order: 2 },
      { category_slug: 'dieplepelbakken', title: 'Dieplepelbakken voor kranen van 5t - 10t', slug: '5t-10t', tonnage_min: 5.0, tonnage_max: 10.0, sort_order: 3 },
      { category_slug: 'dieplepelbakken', title: 'Dieplepelbakken voor kranen van 10t - 15t', slug: '10t-15t', tonnage_min: 10.0, tonnage_max: 15.0, sort_order: 4 },
      { category_slug: 'dieplepelbakken', title: 'Dieplepelbakken voor kranen van 15t - 25t', slug: '15t-25t', tonnage_min: 15.0, tonnage_max: 25.0, sort_order: 5 },
      { category_slug: 'dieplepelbakken', title: 'Dieplepelbakken voor kranen van 25t+', slug: '25t-plus', tonnage_min: 25.0, tonnage_max: null, sort_order: 6 },
      
      // Sorteergrijpers subcategorieën
      { category_slug: 'sorteergrijpers', title: 'Sorteergrijpers voor kranen van 2,5t - 5t', slug: '2-5t-5t', tonnage_min: 2.5, tonnage_max: 5.0, sort_order: 1 },
      { category_slug: 'sorteergrijpers', title: 'Sorteergrijpers voor kranen van 5t - 10t', slug: '5t-10t', tonnage_min: 5.0, tonnage_max: 10.0, sort_order: 2 },
      { category_slug: 'sorteergrijpers', title: 'Sorteergrijpers voor kranen van 10t - 15t', slug: '10t-15t', tonnage_min: 10.0, tonnage_max: 15.0, sort_order: 3 },
      { category_slug: 'sorteergrijpers', title: 'Sorteergrijpers voor kranen van 15t - 25t', slug: '15t-25t', tonnage_min: 15.0, tonnage_max: 25.0, sort_order: 4 },
      
      // Sloophamers subcategorieën
      { category_slug: 'sloophamers', title: 'Sloophamers voor kranen van 1t - 2,5t', slug: '1t-2-5t', tonnage_min: 1.0, tonnage_max: 2.5, sort_order: 1 },
      { category_slug: 'sloophamers', title: 'Sloophamers voor kranen van 2,5t - 5t', slug: '2-5t-5t', tonnage_min: 2.5, tonnage_max: 5.0, sort_order: 2 },
      { category_slug: 'sloophamers', title: 'Sloophamers voor kranen van 5t - 10t', slug: '5t-10t', tonnage_min: 5.0, tonnage_max: 10.0, sort_order: 3 },
      { category_slug: 'sloophamers', title: 'Sloophamers voor kranen van 10t - 15t', slug: '10t-15t', tonnage_min: 10.0, tonnage_max: 15.0, sort_order: 4 },
      { category_slug: 'sloophamers', title: 'Sloophamers voor kranen van 15t - 25t', slug: '15t-25t', tonnage_min: 15.0, tonnage_max: 25.0, sort_order: 5 }
    ];

    for (const subcat of subcategories) {
      const categoryId = categoryMap[subcat.category_slug];
      if (categoryId) {
        await pool.query(`
          INSERT INTO subcategories (category_id, title, slug, tonnage_min, tonnage_max, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (category_id, slug) DO UPDATE SET 
            title = $2, tonnage_min = $4, tonnage_max = $5, sort_order = $6
        `, [categoryId, subcat.title, subcat.slug, subcat.tonnage_min, subcat.tonnage_max, subcat.sort_order]);
      }
    }

    // Create products
    console.log('📦 Creating products...');
    const products = [
      {
        title: 'Slotenbak 300mm CW10',
        slug: 'slotenbak-300mm-cw10',
        description: 'Smalle slotenbak voor het graven van kabelsleufjes en smalle sloten. Vervaardigd uit Hardox 450 voor maximale slijtvastheid.',
        category_slug: 'slotenbakken',
        excavator_weight_min: 3000,
        excavator_weight_max: 8000,
        width: 300,
        volume: 80,
        weight: 95,
        attachment_type: 'CW10',
        is_featured: true
      },
      {
        title: 'Slotenbak 400mm CW10',
        slug: 'slotenbak-400mm-cw10',
        description: 'Veelzijdige slotenbak voor drainage en kabelsleufjes. Geschikt voor 3-8 ton graafmachines.',
        category_slug: 'slotenbakken',
        excavator_weight_min: 3000,
        excavator_weight_max: 8000,
        width: 400,
        volume: 120,
        weight: 110,
        attachment_type: 'CW10',
        is_featured: true
      },
      {
        title: 'Slotenbak 600mm CW20',
        slug: 'slotenbak-600mm-cw20',
        description: 'Brede slotenbak voor grotere sloten en rioleringswerkzaamheden.',
        category_slug: 'slotenbakken',
        excavator_weight_min: 8000,
        excavator_weight_max: 15000,
        width: 600,
        volume: 250,
        weight: 180,
        attachment_type: 'CW20',
        is_featured: false
      },
      {
        title: 'Dieplepelbak 600mm CW10',
        slug: 'dieplepelbak-600mm-cw10',
        description: 'Standaard dieplepelbak voor algemeen graafwerk. Robuuste constructie met Hardox slijtplaten.',
        category_slug: 'dieplepelbakken',
        excavator_weight_min: 3000,
        excavator_weight_max: 8000,
        width: 600,
        volume: 180,
        weight: 140,
        attachment_type: 'CW10',
        is_featured: true
      },
      {
        title: 'Dieplepelbak 800mm CW20',
        slug: 'dieplepelbak-800mm-cw20',
        description: 'Grote dieplepelbak voor zwaardere graafwerkzaamheden.',
        category_slug: 'dieplepelbakken',
        excavator_weight_min: 8000,
        excavator_weight_max: 15000,
        width: 800,
        volume: 350,
        weight: 220,
        attachment_type: 'CW20',
        is_featured: true
      },
      {
        title: 'Dieplepelbak 1000mm CW30',
        slug: 'dieplepelbak-1000mm-cw30',
        description: 'Extra brede dieplepelbak voor grote graafprojecten.',
        category_slug: 'dieplepelbakken',
        excavator_weight_min: 15000,
        excavator_weight_max: 25000,
        width: 1000,
        volume: 600,
        weight: 380,
        attachment_type: 'CW30',
        is_featured: false
      },
      {
        title: 'Puinbak 1200mm CW30',
        slug: 'puinbak-1200mm-cw30',
        description: 'Versterkte puinbak voor het laden van puin, stenen en grof materiaal.',
        category_slug: 'puinbakken',
        excavator_weight_min: 15000,
        excavator_weight_max: 25000,
        width: 1200,
        volume: 800,
        weight: 450,
        attachment_type: 'CW30',
        is_featured: true
      },
      {
        title: 'Puinbak 1500mm CW40',
        slug: 'puinbak-1500mm-cw40',
        description: 'Extra grote puinbak voor zware sloopwerkzaamheden.',
        category_slug: 'puinbakken',
        excavator_weight_min: 25000,
        excavator_weight_max: 40000,
        width: 1500,
        volume: 1200,
        weight: 680,
        attachment_type: 'CW40',
        is_featured: false
      }
    ];

    for (const product of products) {
      const categoryId = categoryMap[product.category_slug];
      
      const result = await pool.query(`
        INSERT INTO products (
          title, slug, description, category_id,
          excavator_weight_min, excavator_weight_max, width, volume, weight,
          attachment_type, is_featured, stock_quantity
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (slug) DO UPDATE SET
          title = $1, description = $3, category_id = $4,
          excavator_weight_min = $5, excavator_weight_max = $6,
          width = $7, volume = $8, weight = $9,
          attachment_type = $10, is_featured = $11
        RETURNING id
      `, [
        product.title, product.slug, product.description, categoryId,
        product.excavator_weight_min, product.excavator_weight_max,
        product.width, product.volume, product.weight,
        product.attachment_type, product.is_featured,
        Math.floor(Math.random() * 20) + 1 // Random stock 1-20
      ]);

      // Add price
      const productId = result.rows[0].id;
      const price = (Math.floor(Math.random() * 30) + 10) * 100; // Random price €1000-€4000
      
      await pool.query(`
        INSERT INTO product_prices (product_id, price)
        VALUES ($1, $2)
      `, [productId, price]);
    }

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📋 Test accounts:');
    console.log('   Admin: admin@structon.nl / admin123');
    console.log('   Klant: klant@test.nl / klant123');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
