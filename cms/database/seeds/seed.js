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
    // HOOFDCATEGORIEËN: Graafbakken, Sloop- en sorteergrijpers, Overige
    // Slotenbakken en Dieplepelbakken zijn SUBCATEGORIEËN van Graafbakken
    console.log('📁 Creating categories...');
    const categories = [
      { 
        title: 'Graafbakken', 
        slug: 'graafbakken', 
        description: 'Professionele graafbakken voor alle graafmachines.',
        seo_title: 'Graafbak Kopen | Graafbakken voor Minigraver & Kraan',
        seo_description: 'Graafbak kopen? Structon levert graafbakken voor minigravers en graafmachines. CW00 t/m CW40. Belgische productie, Hardox staal.',
        seo_h1: 'Graafbak Kopen voor Jouw Graafmachine',
        seo_intro: 'Structon produceert hoogwaardige graafbakken voor minigravers en graafmachines van 0.8 tot 40 ton. Alle CW-aansluitingen beschikbaar.'
      },
      { 
        title: 'Sloop- en sorteergrijpers', 
        slug: 'sloop-sorteergrijpers', 
        description: 'Sorteergrijpers en sloopgrijpers voor sloop- en sorteerwerk.',
        seo_title: 'Sorteergrijper Kopen | Sloopgrijpers voor Kraan',
        seo_description: 'Sorteergrijper kopen? Structon levert sorteergrijpers en sloopgrijpers voor minigravers en graafmachines. CW05, CW10, CW20.',
        seo_h1: 'Sorteergrijper Kopen voor Sloop & Sorteerwerk',
        seo_intro: 'Sorteergrijpers zijn onmisbaar voor sloopwerk, sorteren en recycling. Geschikt voor het oppakken en verplaatsen van puin, hout en metaal.'
      },
      { 
        title: 'Overige', 
        slug: 'overige', 
        description: 'Overige aanbouwdelen en accessoires.',
        seo_title: 'Overige Aanbouwdelen | Accessoires voor Kraan',
        seo_description: 'Overige aanbouwdelen en accessoires voor graafmachines. Tanden, slijtdelen, hydrauliek en meer.',
        seo_h1: 'Overige Aanbouwdelen & Accessoires',
        seo_intro: 'Naast graafbakken en grijpers levert Structon ook tanden, slijtdelen, hydraulische onderdelen en accessoires.'
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
    // Graafbakken subcategorieën: Slotenbakken, Dieplepelbakken, Sleuvenbakken, Kantelbakken
    // Sloop- en sorteergrijpers subcategorieën: Sorteergrijpers, Sloopgrijpers, Betonscharen, Pulverisers
    console.log('📂 Creating subcategories...');
    const subcategories = [
      // Graafbakken subcategorieën (producttypen)
      { category_slug: 'graafbakken', title: 'Slotenbakken', slug: 'slotenbakken', tonnage_min: null, tonnage_max: null, sort_order: 1 },
      { category_slug: 'graafbakken', title: 'Dieplepelbakken', slug: 'dieplepelbakken', tonnage_min: null, tonnage_max: null, sort_order: 2 },
      { category_slug: 'graafbakken', title: 'Sleuvenbakken', slug: 'sleuvenbakken', tonnage_min: null, tonnage_max: null, sort_order: 3 },
      { category_slug: 'graafbakken', title: 'Kantelbakken', slug: 'kantelbakken', tonnage_min: null, tonnage_max: null, sort_order: 4 },
      
      // Sloop- en sorteergrijpers subcategorieën
      { category_slug: 'sloop-sorteergrijpers', title: 'Sorteergrijpers', slug: 'sorteergrijpers', tonnage_min: null, tonnage_max: null, sort_order: 1 },
      { category_slug: 'sloop-sorteergrijpers', title: 'Sloopgrijpers', slug: 'sloopgrijpers', tonnage_min: null, tonnage_max: null, sort_order: 2 },
      { category_slug: 'sloop-sorteergrijpers', title: 'Betonscharen', slug: 'betonscharen', tonnage_min: null, tonnage_max: null, sort_order: 3 },
      { category_slug: 'sloop-sorteergrijpers', title: 'Pulverisers', slug: 'pulverisers', tonnage_min: null, tonnage_max: null, sort_order: 4 },
      
      // Overige subcategorieën
      { category_slug: 'overige', title: 'Tanden & Slijtdelen', slug: 'tanden-slijtdelen', tonnage_min: null, tonnage_max: null, sort_order: 1 },
      { category_slug: 'overige', title: 'Hydraulische Onderdelen', slug: 'hydrauliek', tonnage_min: null, tonnage_max: null, sort_order: 2 },
      { category_slug: 'overige', title: 'Smeermiddelen', slug: 'smeermiddelen', tonnage_min: null, tonnage_max: null, sort_order: 3 },
      { category_slug: 'overige', title: 'Accessoires', slug: 'accessoires', tonnage_min: null, tonnage_max: null, sort_order: 4 }
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
    // Alle graafbakken (slotenbakken, dieplepelbakken) vallen onder hoofdcategorie 'graafbakken'
    console.log('📦 Creating products...');
    const products = [
      {
        title: 'Slotenbak 300mm CW10',
        slug: 'slotenbak-300mm-cw10',
        description: 'Smalle slotenbak voor het graven van kabelsleufjes en smalle sloten. Vervaardigd uit Hardox 450 voor maximale slijtvastheid.',
        category_slug: 'graafbakken',
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
        category_slug: 'graafbakken',
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
        category_slug: 'graafbakken',
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
        category_slug: 'graafbakken',
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
        category_slug: 'graafbakken',
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
        category_slug: 'graafbakken',
        excavator_weight_min: 15000,
        excavator_weight_max: 25000,
        width: 1000,
        volume: 600,
        weight: 380,
        attachment_type: 'CW30',
        is_featured: false
      },
      {
        title: 'Sorteergrijper 5-10t',
        slug: 'sorteergrijper-5-10t',
        description: 'Sorteergrijper voor het oppakken en sorteren van puin, hout en metaal.',
        category_slug: 'sloop-sorteergrijpers',
        excavator_weight_min: 5000,
        excavator_weight_max: 10000,
        width: 800,
        volume: null,
        weight: 320,
        attachment_type: 'CW20',
        is_featured: true
      },
      {
        title: 'Sloopgrijper 10-20t',
        slug: 'sloopgrijper-10-20t',
        description: 'Krachtige sloopgrijper voor afbraakwerk en recycling.',
        category_slug: 'sloop-sorteergrijpers',
        excavator_weight_min: 10000,
        excavator_weight_max: 20000,
        width: 1000,
        volume: null,
        weight: 580,
        attachment_type: 'CW30',
        is_featured: true
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
